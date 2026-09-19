from __future__ import annotations

import json
from pathlib import Path
from typing import Any

from fastapi import HTTPException

DATA_DIR = Path(__file__).resolve().parents[2] / "data"
FILES = {"prices": "market_prices.json", "buyers": "buyers.json", "fpos": "fpos.json", "storage": "storage.json", "logistics": "logistics.json"}


def load_records(kind: str) -> list[dict[str, Any]]:
    with (DATA_DIR / FILES[kind]).open(encoding="utf-8") as file:
        return json.load(file)["records"]


def matches(record: dict[str, Any], crop: str | None = None, location: str | None = None) -> bool:
    return (not crop or str(record.get("crop", "")).lower() == crop.lower()) and (not location or str(record.get("location", "")).lower() == location.lower())


def filtered(kind: str, crop: str | None = None, location: str | None = None) -> list[dict[str, Any]]:
    return [record for record in load_records(kind) if matches(record, crop, location)]


def by_id(kind: str, record_id: str) -> dict[str, Any]:
    record = next((item for item in load_records(kind) if item.get("id") == record_id), None)
    if record is None:
        raise HTTPException(status_code=404, detail=f"Record not found: {record_id}")
    return record