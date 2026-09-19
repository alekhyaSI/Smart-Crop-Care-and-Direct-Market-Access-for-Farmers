"""Train an ImageFolder crop disease classifier with transfer learning."""

from __future__ import annotations

import argparse
import json
from datetime import datetime, timezone
from pathlib import Path

import torch
from torch import nn, optim
from torch.utils.data import DataLoader
from torchvision import datasets, models
from torchvision.models import ResNet18_Weights
from torchvision.transforms import v2


ML_DIR = Path(__file__).resolve().parents[1]
TRAIN_DIR = ML_DIR / "dataset" / "train"
VAL_DIR = ML_DIR / "dataset" / "val"
MODEL_DIR = ML_DIR / "model"
MODEL_PATH = MODEL_DIR / "crop_disease_model.pth"
LABELS_PATH = MODEL_DIR / "labels.json"


def _label_name(class_name: str) -> str:
    return class_name if "___" in class_name else f"Tomato___{class_name}"


def build_loaders(dataset_dir: Path, batch_size: int, image_size: int = 224) -> tuple[DataLoader, DataLoader, list[str]]:
    weights = ResNet18_Weights.DEFAULT
    validation_transform = v2.Compose([
        v2.Resize((image_size, image_size)),
        v2.ToImage(),
        v2.ToDtype(torch.float32, scale=True),
        v2.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
    ])
    training_transform = v2.Compose([
        v2.RandomResizedCrop((image_size, image_size), scale=(0.8, 1.0)),
        v2.RandomHorizontalFlip(),
        v2.RandomRotation(10),
        v2.ColorJitter(brightness=0.15, contrast=0.15, saturation=0.1, hue=0.02),
        v2.ToImage(),
        v2.ToDtype(torch.float32, scale=True),
        v2.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
    ])
    train_dataset = datasets.ImageFolder(dataset_dir / "train", transform=training_transform)
    val_dataset = datasets.ImageFolder(dataset_dir / "val", transform=validation_transform)
    if train_dataset.classes != val_dataset.classes:
        raise ValueError("Train and validation folders must contain the same class directories.")
    return (
        DataLoader(train_dataset, batch_size=batch_size, shuffle=True, num_workers=0),
        DataLoader(val_dataset, batch_size=batch_size, shuffle=False, num_workers=0),
        [_label_name(class_name) for class_name in train_dataset.classes],
    )


def run_epoch(model, loader, criterion, device, optimizer=None, scheduler=None):
    training = optimizer is not None
    model.train(training)
    total_loss = total_correct = total_items = 0
    for images, labels in loader:
        images, labels = images.to(device), labels.to(device)
        if training:
            optimizer.zero_grad()
        with torch.set_grad_enabled(training):
            outputs = model(images)
            loss = criterion(outputs, labels)
            if training:
                loss.backward()
                optimizer.step()
                if scheduler is not None:
                    scheduler.step()
        total_loss += loss.item() * labels.size(0)
        total_correct += (outputs.argmax(1) == labels).sum().item()
        total_items += labels.size(0)
    return total_loss / total_items, total_correct / total_items


def main(
    dataset_dir: Path = ML_DIR / "dataset",
    epochs: int = 5,
    batch_size: int = 32,
    learning_rate: float = 1e-3,
    output_model: Path = MODEL_PATH,
    labels_path: Path = LABELS_PATH,
    image_size: int = 224,
    fine_tune: bool = False,
    head_epochs: int = 1,
):
    train_loader, val_loader, classes = build_loaders(dataset_dir, batch_size, image_size)
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model = models.resnet18(weights=ResNet18_Weights.DEFAULT)
    for parameter in model.parameters():
        parameter.requires_grad = False
    model.fc = nn.Linear(model.fc.in_features, len(classes))
    model.to(device)
    class_counts = torch.bincount(torch.tensor(train_loader.dataset.targets), minlength=len(classes)).float()
    class_weights = class_counts.sum() / (len(classes) * class_counts.clamp_min(1))
    criterion = nn.CrossEntropyLoss(weight=class_weights.to(device))
    optimizer = optim.AdamW(model.fc.parameters(), lr=learning_rate)
    scheduler = None
    best_val_loss = float("inf")
    output_model.parent.mkdir(parents=True, exist_ok=True)
    labels_path.parent.mkdir(parents=True, exist_ok=True)
    with labels_path.open("w", encoding="utf-8") as file:
        json.dump({str(index): name for index, name in enumerate(classes)}, file, indent=2)
    print(f"Using device: {device}")
    for epoch in range(1, epochs + 1):
        if fine_tune and epoch == head_epochs + 1:
            for name, parameter in model.named_parameters():
                if name.startswith("layer3") or name.startswith("layer4") or name.startswith("fc"):
                    parameter.requires_grad = True
            optimizer = optim.AdamW(
                [
                    {"params": model.layer3.parameters(), "lr": learning_rate * 0.05},
                    {"params": model.layer4.parameters(), "lr": learning_rate * 0.05},
                    {"params": model.fc.parameters(), "lr": learning_rate * 0.2},
                ],
                weight_decay=1e-4,
            )
            scheduler = optim.lr_scheduler.CosineAnnealingLR(
                optimizer, T_max=max(1, (epochs - epoch + 1) * len(train_loader))
            )
            print("Unfroze layer3/layer4/fc for fine-tuning")
        train_loss, train_accuracy = run_epoch(model, train_loader, criterion, device, optimizer, scheduler)
        val_loss, val_accuracy = run_epoch(model, val_loader, criterion, device)
        print(f"Epoch {epoch}/{epochs}")
        print(f"training loss: {train_loss:.4f} | training accuracy: {train_accuracy:.4f}")
        print(f"validation loss: {val_loss:.4f} | validation accuracy: {val_accuracy:.4f}")
        if val_loss < best_val_loss:
            best_val_loss = val_loss
            torch.save({"model_state_dict": model.state_dict(), "classes": classes}, output_model)
            print(f"Saved best model to {output_model}")
    metadata = {
        "dataset_dir": str(dataset_dir),
        "classes": classes,
        "epochs": epochs,
        "batch_size": batch_size,
        "learning_rate": learning_rate,
        "image_size": image_size,
        "fine_tune": fine_tune,
        "head_epochs": head_epochs,
        "device": str(device),
        "class_counts": class_counts.int().tolist(),
        "completed_at": datetime.now(timezone.utc).isoformat(),
    }
    metadata_path = output_model.with_name(f"{output_model.stem}_training_metadata.json")
    metadata_path.write_text(json.dumps(metadata, indent=2), encoding="utf-8")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--dataset-dir", type=Path, default=ML_DIR / "dataset")
    parser.add_argument("--epochs", type=int, default=5)
    parser.add_argument("--batch-size", type=int, default=32)
    parser.add_argument("--learning-rate", type=float, default=1e-3)
    parser.add_argument("--output-model", type=Path, default=MODEL_PATH)
    parser.add_argument("--labels-path", type=Path, default=LABELS_PATH)
    parser.add_argument("--image-size", type=int, default=224)
    parser.add_argument("--fine-tune", action="store_true")
    parser.add_argument("--head-epochs", type=int, default=1)
    args = parser.parse_args()
    main(args.dataset_dir, args.epochs, args.batch_size, args.learning_rate, args.output_model, args.labels_path, args.image_size, args.fine_tune, args.head_epochs)