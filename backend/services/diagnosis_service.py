from __future__ import annotations

import io
import json
import tempfile
from pathlib import Path

from fastapi import HTTPException, UploadFile
from PIL import Image, UnidentifiedImageError

from ml.model.inference import predict_image

ROOT_DIR = Path(__file__).resolve().parents[2]
TREATMENTS_PATH = ROOT_DIR / "data" / "treatments.json"
ALLOWED_CONTENT_TYPES = {"image/jpeg", "image/jpg", "image/png"}
SUPPORTED_DISEASES = {"Bacterial Spot", "Early Blight", "Late Blight", "Healthy"}


def load_treatments() -> dict[str, dict]:
    with TREATMENTS_PATH.open(encoding="utf-8") as file:
        return json.load(file)


def treatment_for(disease: str) -> dict:
    treatments = load_treatments()
    canonical = next((name for name in SUPPORTED_DISEASES if name.lower() == disease.lower()), None)
    if canonical is None or canonical not in treatments:
        raise HTTPException(status_code=404, detail=f"Unsupported disease: {disease}")
    treatment = treatments[canonical]
    return {
        "symptoms": treatment.get("symptoms", []),
        "recommended_actions": treatment.get("recommended_actions", treatment.get("immediate_actions", [])),
        "prevention": treatment.get("prevention", []),
    }


async def diagnose_upload(upload: UploadFile) -> dict:
    if upload is None or not upload.filename:
        raise HTTPException(status_code=400, detail="An image upload is required.")
    if upload.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(status_code=400, detail="Unsupported image type. Use JPEG, JPG, or PNG.")
    contents = await upload.read()
    if not contents:
        raise HTTPException(status_code=400, detail="The uploaded image is empty.")

    suffix = ".png" if upload.content_type == "image/png" else ".jpg"
    temporary_path: Path | None = None
    try:
        try:
            with Image.open(io.BytesIO(contents)) as image:
                image.verify()
        except (UnidentifiedImageError, OSError) as error:
            raise HTTPException(status_code=400, detail="The uploaded file is not a valid image.") from error

        with tempfile.NamedTemporaryFile(suffix=suffix, delete=False) as temporary_file:
            temporary_file.write(contents)
            temporary_path = Path(temporary_file.name)
        try:
            prediction = predict_image(temporary_path)
        except FileNotFoundError as error:
            raise HTTPException(status_code=503, detail="The trained ML model is unavailable.") from error
        except Exception as error:
            raise HTTPException(status_code=500, detail="Image inference failed.") from error
        return {**prediction, "treatment": treatment_for(prediction["disease"])}
    finally:
        if temporary_path is not None:
            temporary_path.unlink(missing_ok=True)