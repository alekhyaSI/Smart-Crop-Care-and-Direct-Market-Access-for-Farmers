from fastapi import APIRouter, File, UploadFile

from backend.services.diagnosis_service import diagnose_upload, treatment_for

router = APIRouter(tags=["diagnosis"])


@router.post("/api/diagnose", summary="Screen a crop image for tomato disease")
async def diagnose(image: UploadFile = File(...)):
    return await diagnose_upload(image)


@router.get("/api/treatments/{disease}", summary="Get curated treatment guidance")
def treatment(disease: str):
    return treatment_for(disease)