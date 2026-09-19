"""Reusable ResNet18 inference for the crop diagnosis API."""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any

import torch
from PIL import Image
from torchvision.models import ResNet18_Weights, resnet18
from torchvision.transforms import v2


MODEL_DIR = Path(__file__).resolve().parent
ML_DIR = MODEL_DIR.parent
TOMATO_MODEL_PATH = MODEL_DIR / "crop_disease_model.pth"
TOMATO_LABELS_PATH = MODEL_DIR / "labels.json"
MODEL_PATH = MODEL_DIR / "crop_disease_model_multicrop_best.pth"
LABELS_PATH = MODEL_DIR / "labels_multicrop_v2_staged.json"
MODEL_IMAGE_SIZE = 128


def _load_labels() -> dict[int, str]:
    with LABELS_PATH.open(encoding="utf-8") as file:
        return {int(key): value for key, value in json.load(file).items()}


def _build_model(num_classes: int) -> torch.nn.Module:
    model = resnet18(weights=None)
    model.fc = torch.nn.Linear(model.fc.in_features, num_classes)
    return model


def _parse_label(label: str) -> tuple[str, str]:
    if "___" in label:
        crop, disease = label.split("___", 1)
        disease = disease.replace("_", " ")
        return crop, disease
    return "Tomato", label.replace("_", " ")


class CropDiseaseClassifier:
    """Loads the trained model once and provides image-path predictions."""

    def __init__(
        self,
        model_path: Path = MODEL_PATH,
        labels_path: Path = LABELS_PATH,
        image_size: int = MODEL_IMAGE_SIZE,
    ):
        self.model_path = Path(model_path)
        self.labels_path = Path(labels_path)

        with self.labels_path.open(encoding="utf-8") as file:
            self.labels = {
                int(key): value
                for key, value in json.load(file).items()
            }

        self.device = torch.device(
            "cuda" if torch.cuda.is_available() else "cpu"
        )

        checkpoint = torch.load(
            self.model_path,
            map_location=self.device,
            weights_only=True,
        )

        self.model = _build_model(len(self.labels))

        state_dict = (
            checkpoint.get("model_state_dict", checkpoint)
            if isinstance(checkpoint, dict)
            else checkpoint
        )

        self.model.load_state_dict(state_dict)
        self.model.to(self.device)
        self.model.eval()

        self.transform = v2.Compose([
            v2.Resize((image_size, image_size)),
            v2.ToImage(),
            v2.ToDtype(torch.float32, scale=True),
            v2.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
        ])

    def predict(self, image_path: str | Path) -> dict[str, Any]:
        image = Image.open(image_path).convert("RGB")

        tensor = self.transform(image).unsqueeze(0).to(self.device)

        with torch.inference_mode():
            probabilities = torch.softmax(
                self.model(tensor), dim=1
            )[0]

        class_id = int(torch.argmax(probabilities).item())
        label = self.labels[class_id]
        crop, disease = _parse_label(label)
        predicted_class = label if "___" in label else f"Tomato___{label.replace(' ', '_')}"

        return {
            "crop": crop,
            "disease": disease,
            "predicted_class": predicted_class,
            "confidence": round(
                float(probabilities[class_id].item()),
                4,
            ),
        }


_classifier: CropDiseaseClassifier | None = None


def predict_image(
    image_path: str | Path,
    model_path: Path = MODEL_PATH,
    labels_path: Path = LABELS_PATH,
    image_size: int = MODEL_IMAGE_SIZE,
) -> dict[str, Any]:
    """Predict with the verified multicrop model; Tomato remains a separate backup."""

    global _classifier

    if _classifier is None or _classifier.model_path != Path(model_path) or _classifier.labels_path != Path(labels_path):
        _classifier = CropDiseaseClassifier(model_path, labels_path, image_size)

    return _classifier.predict(image_path)