from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.routes.diagnosis import router as diagnosis_router
from backend.routes.marketplace import router as marketplace_router

app = FastAPI(title="Smart Crop Care API", version="0.2.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)
app.include_router(diagnosis_router)
app.include_router(marketplace_router)


@app.get("/", summary="API status")
def root():
    return {"message": "Smart Crop Care API", "status": "running"}


@app.get("/api/health", summary="Health check")
def health():
    return {"status": "healthy"}