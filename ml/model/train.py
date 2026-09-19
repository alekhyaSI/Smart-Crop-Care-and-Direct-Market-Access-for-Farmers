"""Train a four-class tomato disease classifier with transfer learning."""

from __future__ import annotations

import argparse
import json
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


def build_loaders(batch_size: int) -> tuple[DataLoader, DataLoader, list[str]]:
    weights = ResNet18_Weights.DEFAULT
    validation_transform = weights.transforms()
    training_transform = v2.Compose([
        v2.RandomResizedCrop((224, 224), scale=(0.8, 1.0)),
        v2.RandomHorizontalFlip(),
        v2.RandomRotation(10),
        v2.ToImage(),
        v2.ToDtype(torch.float32, scale=True),
        v2.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
    ])
    train_dataset = datasets.ImageFolder(TRAIN_DIR, transform=training_transform)
    val_dataset = datasets.ImageFolder(VAL_DIR, transform=validation_transform)
    if train_dataset.classes != val_dataset.classes:
        raise ValueError("Train and validation folders must contain the same class directories.")
    if len(train_dataset.classes) != 4:
        raise ValueError(f"Expected exactly 4 tomato classes, found {len(train_dataset.classes)}.")
    return (
        DataLoader(train_dataset, batch_size=batch_size, shuffle=True, num_workers=0),
        DataLoader(val_dataset, batch_size=batch_size, shuffle=False, num_workers=0),
        train_dataset.classes,
    )


def run_epoch(model, loader, criterion, device, optimizer=None):
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
        total_loss += loss.item() * labels.size(0)
        total_correct += (outputs.argmax(1) == labels).sum().item()
        total_items += labels.size(0)
    return total_loss / total_items, total_correct / total_items


def main(epochs: int = 5, batch_size: int = 32, learning_rate: float = 1e-3):
    train_loader, val_loader, classes = build_loaders(batch_size)
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model = models.resnet18(weights=ResNet18_Weights.DEFAULT)
    for parameter in model.parameters():
        parameter.requires_grad = False
    model.fc = nn.Linear(model.fc.in_features, 4)
    model.to(device)
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.fc.parameters(), lr=learning_rate)
    best_val_loss = float("inf")
    MODEL_DIR.mkdir(parents=True, exist_ok=True)
    with LABELS_PATH.open("w", encoding="utf-8") as file:
        json.dump({str(index): name.replace("Tomato___", "").replace("_", " ") for index, name in enumerate(classes)}, file, indent=2)
    print(f"Using device: {device}")
    for epoch in range(1, epochs + 1):
        train_loss, train_accuracy = run_epoch(model, train_loader, criterion, device, optimizer)
        val_loss, val_accuracy = run_epoch(model, val_loader, criterion, device)
        print(f"Epoch {epoch}/{epochs}")
        print(f"training loss: {train_loss:.4f} | training accuracy: {train_accuracy:.4f}")
        print(f"validation loss: {val_loss:.4f} | validation accuracy: {val_accuracy:.4f}")
        if val_loss < best_val_loss:
            best_val_loss = val_loss
            torch.save({"model_state_dict": model.state_dict(), "classes": classes}, MODEL_PATH)
            print(f"Saved best model to {MODEL_PATH}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--epochs", type=int, default=5)
    parser.add_argument("--batch-size", type=int, default=32)
    parser.add_argument("--learning-rate", type=float, default=1e-3)
    args = parser.parse_args()
    main(args.epochs, args.batch_size, args.learning_rate)