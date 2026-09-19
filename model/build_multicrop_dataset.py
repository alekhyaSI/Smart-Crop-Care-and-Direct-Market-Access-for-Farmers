"""Build the real 16-class ImageFolder dataset from the named public sources."""

from __future__ import annotations

import argparse
from concurrent.futures import ThreadPoolExecutor, as_completed
import hashlib
import json
import random
import shutil
import tempfile
import urllib.request
from collections import defaultdict
from pathlib import Path
from typing import Any

from datasets import load_dataset
from PIL import Image

SEED = 42
ML_DIR = Path(__file__).resolve().parents[1]
SOURCE_TOMATO = ML_DIR / "dataset"
OUTPUT_DIR = ML_DIR / "dataset_multicrop"
PLANTVILLAGE_API = "https://api.github.com/repos/spMohanty/PlantVillage-Dataset/contents/raw/color"
PLANTVILLAGE_RAW = "https://raw.githubusercontent.com/spMohanty/PlantVillage-Dataset/master/raw/color"
RICE_DATASET = "Project-AgML/rice_leaf_disease_classification_india"
CHILLI_DATASET = "Project-AgML/COLD_chili_leaf_disease_classification"

CLASSES = [
    "Tomato___Bacterial_spot", "Tomato___Early_blight", "Tomato___Late_blight", "Tomato___healthy",
    "Potato___Early_blight", "Potato___Late_blight", "Potato___healthy",
    "Rice___Bacterialblight", "Rice___Blast", "Rice___Brownspot", "Rice___Tungro",
    "Chilli___cercospora", "Chilli___healthy", "Chilli___mites_and_trips", "Chilli___nutritional", "Chilli___powdery_mildew",
]
POTATO_CLASSES = CLASSES[4:7]
RICE_LABELS = {"Bacterialblight", "Blast", "Brownspot", "Tungro"}
CHILLI_LABELS = {"cercospora", "healthy", "mites_and_trips", "nutritional", "powdery mildew"}
POTATO_MAX_IMAGES = 400
RICE_MAX_IMAGES = 400


def _safe_name(value: str) -> str:
    return value.strip().lower().replace("-", " ").replace("_", " ")


def _class_from_local(path: Path) -> str:
    return f"Tomato___{path.name}"


def _save_image(value: Any, destination: Path) -> None:
    if isinstance(value, Image.Image):
        image = value.convert("RGB")
    elif isinstance(value, dict) and value.get("bytes") is not None:
        from io import BytesIO
        image = Image.open(BytesIO(value["bytes"])).convert("RGB")
    else:
        raise TypeError(f"Unsupported image value: {type(value).__name__}")
    image.save(destination, format="JPEG", quality=95)


def _collect_local() -> dict[str, list[Path]]:
    collected: dict[str, list[Path]] = defaultdict(list)
    for split in ("train", "val"):
        root = SOURCE_TOMATO / split
        if not root.exists():
            raise FileNotFoundError(f"Missing existing Tomato split: {root}")
        for class_dir in root.iterdir():
            if class_dir.is_dir():
                target = _class_from_local(class_dir)
                collected[target].extend(sorted(p for p in class_dir.iterdir() if p.is_file()))
    return collected


def _collect_huggingface(dataset_id: str, target_labels: set[str], config: str | None, max_per_class: int | None = None) -> dict[str, list[Any]]:
    dataset = load_dataset(dataset_id, name=config, split="train") if config else load_dataset(dataset_id, split="train")
    selected: dict[str, list[Any]] = defaultdict(list)
    label_names = dataset.features["label"].names
    for row in dataset:
        label = label_names[int(row["label"])] if isinstance(row["label"], int) else str(row["label"])
        if label in target_labels:
            selected[label].append(row["image"])
    if max_per_class:
        rng = random.Random(SEED)
        selected = {
            label: rng.sample(images, max_per_class) if len(images) > max_per_class else images
            for label, images in selected.items()
        }
    return selected


def _collect_potato(download_dir: Path) -> dict[str, list[Path]]:
    headers = {"User-Agent": "KisanSetu-multicrop-builder"}
    collected: dict[str, list[Path]] = defaultdict(list)
    for target in POTATO_CLASSES:
        url = f"{PLANTVILLAGE_API}/{target}"
        request = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(request, timeout=60) as response:
            entries = json.load(response)
        destination_dir = download_dir / target
        destination_dir.mkdir(parents=True, exist_ok=True)
        files = [entry for entry in entries if entry.get("type") == "file" and entry.get("download_url")]
        if target != "Potato___healthy":
            files = sorted(files, key=lambda entry: entry["name"])[:POTATO_MAX_IMAGES]

        def download(entry: dict[str, str]) -> Path:
            destination = destination_dir / entry["name"]
            if destination.exists() and destination.stat().st_size > 0:
                return destination
            for attempt in range(3):
                try:
                    request = urllib.request.Request(entry["download_url"], headers=headers)
                    with urllib.request.urlopen(request, timeout=120) as response, destination.open("wb") as output:
                        shutil.copyfileobj(response, output)
                    return destination
                except (OSError, TimeoutError):
                    if attempt == 2:
                        raise
            raise RuntimeError("Unreachable download retry state")

        with ThreadPoolExecutor(max_workers=16) as executor:
            futures = [executor.submit(download, entry) for entry in files]
            for future in as_completed(futures):
                collected[target].append(future.result())
        print(f"{target}: downloaded {len(collected[target])} source images")
    return collected


def _split_paths(paths: list[Any], seed: int) -> dict[str, list[Any]]:
    shuffled = list(paths)
    random.Random(seed).shuffle(shuffled)
    total = len(shuffled)
    test_count = max(1, round(total * 0.15))
    val_count = max(1, round(total * 0.15))
    return {
        "train": shuffled[: total - val_count - test_count],
        "val": shuffled[total - val_count - test_count : total - test_count],
        "test": shuffled[total - test_count :],
    }


def _write_dataset(collected: dict[str, list[Any]], staging: Path, seed: int) -> dict[str, dict[str, int]]:
    counts: dict[str, dict[str, int]] = {split: {} for split in ("train", "val", "test")}
    for class_name in CLASSES:
        paths = list(collected.get(class_name, []))
        if not paths:
            raise ValueError(f"Class has no source images: {class_name}")
        for split, items in _split_paths(paths, seed).items():
            target_dir = staging / split / class_name
            target_dir.mkdir(parents=True, exist_ok=True)
            for index, item in enumerate(items, start=1):
                target = target_dir / f"{index:05d}.jpg"
                if isinstance(item, Path):
                    shutil.copy2(item, target)
                else:
                    _save_image(item, target)
            print(f"{class_name}/{split}: {len(items)} images", flush=True)
            counts[split][class_name] = len(items)
    return counts


def _remove_cross_split_duplicates(dataset_root: Path) -> None:
    seen: set[str] = set()
    for split in ("train", "val", "test"):
        for image_path in dataset_root.joinpath(split).rglob("*"):
            if not image_path.is_file():
                continue
            digest = hashlib.sha256(image_path.read_bytes()).hexdigest()
            if digest in seen:
                image_path.unlink()
            else:
                seen.add(digest)


def _count_dataset(dataset_root: Path) -> dict[str, dict[str, int]]:
    return {
        split: {
            class_name: len(list(dataset_root.joinpath(split, class_name).glob("*")))
            for class_name in CLASSES
        }
        for split in ("train", "val", "test")
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", type=Path, default=OUTPUT_DIR)
    parser.add_argument("--seed", type=int, default=SEED)
    parser.add_argument("--force", action="store_true", help="Replace an existing output directory")
    args = parser.parse_args()
    if args.output.exists() and not args.force:
        raise FileExistsError(f"Output exists; use --force to rebuild safely: {args.output}")

    staging_root = Path(tempfile.mkdtemp(prefix="multicrop-build-", dir=args.output.parent))
    potato_downloads = ML_DIR / ".cache" / "potato_source"
    try:
        collected: dict[str, list[Any]] = {}
        local = _collect_local()
        for class_name in CLASSES[:4]:
            collected[class_name] = local[class_name]
        collected.update(_collect_potato(potato_downloads))
        for label, images in _collect_huggingface(RICE_DATASET, RICE_LABELS, None, RICE_MAX_IMAGES).items():
            collected[f"Rice___{label}"] = images
        for label, images in _collect_huggingface(CHILLI_DATASET, CHILLI_LABELS, "raw").items():
            normalized = "powdery_mildew" if label == "powdery mildew" else label
            collected[f"Chilli___{normalized}"] = images

        dataset_root = staging_root / "dataset_multicrop"
        _write_dataset(collected, dataset_root, args.seed)
        _remove_cross_split_duplicates(dataset_root)
        counts = _count_dataset(dataset_root)
        metadata = {
            "seed": args.seed,
            "classes": CLASSES,
            "sources": {
                "Tomato": "Existing local ml/dataset/ (original preserved)",
                "Potato": "https://github.com/spMohanty/PlantVillage-Dataset/tree/master/raw/color",
                "Rice": f"https://huggingface.co/datasets/{RICE_DATASET}",
                "Chilli": f"https://huggingface.co/datasets/{CHILLI_DATASET} (raw config only)",
            },
            "counts": counts,
            "notes": "Deterministic source-image split; no augmented Chilli images used. Potato Early/Late blight are capped at 400 deterministic source images per class to avoid unnecessary download volume.",
        }
        (dataset_root / "dataset_metadata.json").write_text(json.dumps(metadata, indent=2), encoding="utf-8")
        if args.output.exists():
            shutil.rmtree(args.output)
        shutil.move(str(dataset_root), str(args.output))
        print(json.dumps(metadata, indent=2))
    finally:
        shutil.rmtree(staging_root, ignore_errors=True)


if __name__ == "__main__":
    main()
