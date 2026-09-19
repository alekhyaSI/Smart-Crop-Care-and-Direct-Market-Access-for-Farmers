"""Download a reproducible four-class tomato image dataset split.

The source dataset contains more classes than this MVP needs. Streaming mode
lets the script inspect examples and save only the four selected classes.
"""

from __future__ import annotations

import argparse
import io
import random
import shutil
from collections import defaultdict
from pathlib import Path
from typing import Any

from datasets import ClassLabel, load_dataset
from PIL import Image


DATASET_ID = "Project-AgML/tomato_leaf_disease"
SCRIPT_DIR = Path(__file__).resolve().parent
OUTPUT_DIR = SCRIPT_DIR / "dataset"
CLASSES = {
	"bacterial spot": "Bacterial_spot",
	"bacterial_spot": "Bacterial_spot",
	"tomato bacterial spot": "Bacterial_spot",
	"tomato___bacterial_spot": "Bacterial_spot",
	"early blight": "Early_blight",
	"early_blight": "Early_blight",
	"tomato early blight": "Early_blight",
	"tomato___early_blight": "Early_blight",
	"late blight": "Late_blight",
	"late_blight": "Late_blight",
	"tomato late blight": "Late_blight",
	"tomato___late_blight": "Late_blight",
	"healthy": "healthy",
	"tomato healthy": "healthy",
	"tomato___healthy": "healthy",
}
TARGETS_PER_CLASS = 400
SPLIT_COUNTS = {"train": 280, "val": 60, "test": 60}


def normalize_label(value: Any, label_feature: ClassLabel | None) -> str | None:
	"""Convert a source label ID/name into one of the four output folders."""
	if label_feature is not None and isinstance(value, int):
		value = label_feature.names[value]
	normalized = str(value).strip().lower().replace("-", " ")
	return CLASSES.get(normalized)


def find_column(example: dict[str, Any], preferred_names: tuple[str, ...]) -> str:
	for name in preferred_names:
		if name in example:
			return name
	raise KeyError(f"Could not find a column named one of: {', '.join(preferred_names)}")


def image_from_value(value: Any) -> Image.Image:
	if isinstance(value, Image.Image):
		return value.convert("RGB")
	if isinstance(value, dict):
		if value.get("bytes") is not None:
			return Image.open(io.BytesIO(value["bytes"])).convert("RGB")
		if value.get("path"):
			return Image.open(value["path"]).convert("RGB")
	if isinstance(value, (bytes, bytearray)):
		return Image.open(io.BytesIO(value)).convert("RGB")
	raise TypeError(f"Unsupported image value: {type(value).__name__}")


def prepare_output() -> None:
	output_classes = ["Bacterial_spot", "Early_blight", "Late_blight", "healthy"]
	for split in SPLIT_COUNTS:
		for class_name in output_classes:
			class_dir = OUTPUT_DIR / split / class_name
			if class_dir.exists():
				shutil.rmtree(class_dir)
			class_dir.mkdir(parents=True, exist_ok=True)


def download(seed: int) -> None:
	prepare_output()
	dataset = load_dataset(DATASET_ID, split="train", streaming=True)
	first_example = next(iter(dataset))
	image_column = find_column(first_example, ("image", "img", "picture"))
	label_column = find_column(first_example, ("label", "class", "disease", "category"))
	label_feature = dataset.features.get(label_column) if dataset.features else None
	if not isinstance(label_feature, ClassLabel):
		label_feature = None

	selected: dict[str, list[Any]] = defaultdict(list)
	print(f"Reading {DATASET_ID} in streaming mode...")
	for example in dataset:
		class_name = normalize_label(example[label_column], label_feature)
		if class_name is None or len(selected[class_name]) >= TARGETS_PER_CLASS:
			continue
		selected[class_name].append(example[image_column])
		total = sum(len(images) for images in selected.values())
		print(f"Collected {total}/{TARGETS_PER_CLASS * 4} selected images", end="\r")
		if all(len(selected[name]) == TARGETS_PER_CLASS for name in set(CLASSES.values())):
			break

	output_classes = ["Bacterial_spot", "Early_blight", "Late_blight", "healthy"]
	missing = {name: TARGETS_PER_CLASS - len(selected[name]) for name in output_classes if len(selected[name]) < TARGETS_PER_CLASS}
	if missing:
		raise RuntimeError(f"Not enough images for the requested classes: {missing}")

	rng = random.Random(seed)
	for class_name in output_classes:
		images = selected[class_name]
		rng.shuffle(images)
		offset = 0
		for split, count in SPLIT_COUNTS.items():
			for image_index, image_value in enumerate(images[offset : offset + count], start=1):
				output_path = OUTPUT_DIR / split / class_name / f"{class_name.lower()}_{image_index:04d}.jpg"
				image = image_from_value(image_value)
				image.save(output_path, format="JPEG", quality=95)
			offset += count
			print(f"{class_name}: {split}={count}")

	print("\nFinal image counts:")
	for split, expected_count in SPLIT_COUNTS.items():
		for class_name in output_classes:
			actual_count = len(list((OUTPUT_DIR / split / class_name).glob("*.jpg")))
			print(f"{split}/{class_name}: {actual_count} (expected {expected_count})")


def main() -> None:
	parser = argparse.ArgumentParser(description="Download four tomato classes into ImageFolder directories.")
	parser.add_argument("--seed", type=int, default=42, help="Seed used for the reproducible split.")
	args = parser.parse_args()
	download(args.seed)


if __name__ == "__main__":
	main()
