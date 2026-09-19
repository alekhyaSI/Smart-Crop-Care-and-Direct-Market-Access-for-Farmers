from fastapi import APIRouter, Query

from backend.services.marketplace_service import by_id, filtered

router = APIRouter(tags=["marketplace"])


@router.get("/api/markets/prices", summary="Get demo market prices")
def prices(crop: str | None = None, location: str | None = None):
    return {"crop": crop.title() if crop else None, "location": location.title() if location else None, "prices": filtered("prices", crop, location), "demo": True}


@router.get("/api/buyers", summary="Find demo buyers")
def buyers(crop: str | None = None, location: str | None = None):
    return {"buyers": filtered("buyers", crop, location), "demo": True}


@router.get("/api/buyers/{buyer_id}", summary="Get a demo buyer")
def buyer(buyer_id: str):
    return by_id("buyers", buyer_id)


@router.get("/api/fpos", summary="Find demo farmer producer organisations")
def fpos(crop: str | None = None, location: str | None = None):
    return {"fpos": filtered("fpos", crop, location), "demo": True}


@router.get("/api/fpos/{fpo_id}", summary="Get a demo FPO")
def fpo(fpo_id: str):
    return by_id("fpos", fpo_id)


@router.get("/api/storage", summary="Find demo storage")
def storage(crop: str | None = None, location: str | None = None):
    return {"storage": filtered("storage", crop, location), "demo": True}


@router.get("/api/storage/{storage_id}", summary="Get demo storage")
def storage_item(storage_id: str):
    return by_id("storage", storage_id)


@router.get("/api/logistics", summary="Find demo logistics providers")
def logistics(location: str | None = None, quantity: int | None = Query(None, ge=1)):
    records = [record for record in filtered("logistics", location=location) if quantity is None or record["capacity_kg"] >= quantity]
    return {"logistics": records, "demo": True}