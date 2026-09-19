"""Evaluate a trained multicrop ResNet18 on its held-out test split."""

from __future__ import annotations

import argparse
import json
from pathlib import Path

import torch
import matplotlib.pyplot as plt
from sklearn.metrics import accuracy_score, confusion_matrix, f1_score, precision_recall_fscore_support, precision_score, recall_score
from torch.utils.data import DataLoader
from torchvision import datasets
from torchvision.models import ResNet18_Weights
from torchvision.transforms import v2

from ml.model.inference import _build_model

ML_DIR = Path(__file__).resolve().parents[1]
DEFAULT_DATASET = ML_DIR / "dataset_multicrop"
DEFAULT_MODEL = ML_DIR / "model" / "crop_disease_model_multicrop.pth"
DEFAULT_OUTPUT = ML_DIR / "model" / "evaluation_multicrop.json"


def main(dataset_dir: Path, model_path: Path, output_path: Path, batch_size: int, image_size: int) -> None:
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    transform = v2.Compose([
        v2.Resize((image_size, image_size)),
        v2.ToImage(),
        v2.ToDtype(torch.float32, scale=True),
        v2.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
    ])
    dataset = datasets.ImageFolder(dataset_dir / "test", transform=transform)
    loader = DataLoader(dataset, batch_size=batch_size, shuffle=False, num_workers=0)
    model = _build_model(len(dataset.classes))
    checkpoint = torch.load(model_path, map_location=device, weights_only=True)
    model.load_state_dict(checkpoint.get("model_state_dict", checkpoint))
    model.to(device).eval()

    predictions: list[int] = []
    actual: list[int] = []
    with torch.inference_mode():
        for images, labels in loader:
            predictions.extend(model(images.to(device)).argmax(1).cpu().tolist())
            actual.extend(labels.tolist())

    precision, recall, f1, support = precision_recall_fscore_support(
        actual, predictions, labels=list(range(len(dataset.classes))), zero_division=0
    )
    result = {
        "dataset_dir": str(dataset_dir),
        "model_path": str(model_path),
        "device": str(device),
        "accuracy": accuracy_score(actual, predictions),
        "macro_precision": precision_score(actual, predictions, average="macro", zero_division=0),
        "macro_recall": recall_score(actual, predictions, average="macro", zero_division=0),
        "macro_f1": f1_score(actual, predictions, average="macro", zero_division=0),
        "per_class": {
            name: {"precision": float(precision[index]), "recall": float(recall[index]), "f1": float(f1[index]), "support": int(support[index])}
            for index, name in enumerate(dataset.classes)
        },
        "confusion_matrix": confusion_matrix(actual, predictions, labels=list(range(len(dataset.classes)))).tolist(),
    }
    crop_metrics = {}
    for crop in ("Tomato", "Potato", "Rice", "Chilli"):
        class_ids = [index for index, name in enumerate(dataset.classes) if name.startswith(f"{crop}___")]
        selected = [index for index, label in enumerate(actual) if label in class_ids]
        crop_actual = [actual[index] for index in selected]
        crop_predictions = [predictions[index] for index in selected]
        crop_metrics[crop] = {
            "accuracy": accuracy_score(crop_actual, crop_predictions),
            "macro_f1": f1_score(crop_actual, crop_predictions, labels=class_ids, average="macro", zero_division=0),
            "support": len(crop_actual),
        }
    result["per_crop"] = crop_metrics
    matrix = confusion_matrix(actual, predictions, labels=list(range(len(dataset.classes))))
    figure, axis = plt.subplots(figsize=(12, 10))
    axis.imshow(matrix, cmap="Blues")
    axis.set_xticks(range(len(dataset.classes)), dataset.classes, rotation=90, fontsize=7)
    axis.set_yticks(range(len(dataset.classes)), dataset.classes, fontsize=7)
    axis.set_xlabel("Predicted")
    axis.set_ylabel("Actual")
    figure.tight_layout()
    figure.savefig(output_path.with_name(f"{output_path.stem}_confusion_matrix.png"), dpi=160)
    plt.close(figure)
    output_path.write_text(json.dumps(result, indent=2), encoding="utf-8")
    print(json.dumps(result, indent=2))


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--dataset-dir", type=Path, default=DEFAULT_DATASET)
    parser.add_argument("--model", type=Path, default=DEFAULT_MODEL)
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT)
    parser.add_argument("--batch-size", type=int, default=32)
    parser.add_argument("--image-size", type=int, default=224)
    args = parser.parse_args()
    main(args.dataset_dir, args.model, args.output, args.batch_size, args.image_size)
