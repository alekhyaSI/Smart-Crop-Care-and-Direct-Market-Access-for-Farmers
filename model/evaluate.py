"""Evaluate the trained tomato classifier on the held-out test set."""

from pathlib import Path

import torch
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix, f1_score, precision_score, recall_score
from torch.utils.data import DataLoader
from torchvision import datasets
from torchvision.models import ResNet18_Weights, resnet18

from inference import _build_model


ML_DIR = Path(__file__).resolve().parents[1]
MODEL_PATH = ML_DIR / "model" / "crop_disease_model.pth"
TEST_DIR = ML_DIR / "dataset" / "test"


def main():
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    dataset = datasets.ImageFolder(TEST_DIR, transform=ResNet18_Weights.DEFAULT.transforms())
    loader = DataLoader(dataset, batch_size=32, shuffle=False, num_workers=0)
    model = _build_model(len(dataset.classes))
    checkpoint = torch.load(MODEL_PATH, map_location=device, weights_only=True)
    model.load_state_dict(checkpoint.get("model_state_dict", checkpoint))
    model.to(device).eval()
    predictions, actual = [], []
    with torch.inference_mode():
        for images, labels in loader:
            predictions.extend(model(images.to(device)).argmax(1).cpu().tolist())
            actual.extend(labels.tolist())
    print(f"Accuracy: {accuracy_score(actual, predictions):.4f}")
    print(f"Precision: {precision_score(actual, predictions, average='weighted', zero_division=0):.4f}")
    print(f"Recall: {recall_score(actual, predictions, average='weighted', zero_division=0):.4f}")
    print(f"F1 score: {f1_score(actual, predictions, average='weighted', zero_division=0):.4f}")
    print("\nClassification report:")
    print(classification_report(actual, predictions, target_names=dataset.classes, zero_division=0))
    print("Confusion matrix:")
    print(confusion_matrix(actual, predictions))


if __name__ == "__main__":
    main()