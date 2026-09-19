"""Small HTTP API for crop image prediction and treatment guidance."""

from __future__ import annotations

import base64
import json
import os
import tempfile
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

from model.inference import predict_image


ML_DIR = Path(__file__).resolve().parent
TREATMENTS_PATH = ML_DIR / "dataset" / "treatments.json"


def load_treatments() -> dict[str, dict[str, list[str]]]:
    with TREATMENTS_PATH.open(encoding="utf-8") as file:
        return json.load(file)


def treatment_for(disease: str, treatments: dict[str, dict[str, list[str]]]) -> dict[str, list[str]]:
    normalized = disease.replace("_", " ").strip().lower()
    for name, guidance in treatments.items():
        if name.lower() == normalized:
            return guidance

    return {
        "symptoms": [f"The model detected possible {disease.lower()} symptoms."],
        "recommended_actions": [
            "Isolate heavily affected plant material where practical",
            "Avoid overhead irrigation and prolonged leaf wetness",
            "Ask a local agricultural expert to confirm the diagnosis",
        ],
        "prevention": [
            "Inspect plants regularly",
            "Keep tools and growing areas clean",
            "Monitor nearby plants for changes",
        ],
    }


class CropHealthHandler(BaseHTTPRequestHandler):
    treatments = load_treatments()

    def _send_json(self, status: int, payload: dict) -> None:
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self) -> None:
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_POST(self) -> None:
        if self.path != "/predict":
            self._send_json(404, {"error": "Not found"})
            return

        try:
            content_length = int(self.headers.get("Content-Length", "0"))
            request = json.loads(self.rfile.read(content_length))
            image_data = request["image"]
            encoded_image = image_data.split(",", 1)[-1]

            image_file = tempfile.NamedTemporaryFile(
                suffix=".jpg", delete=False
            )
            try:
                image_file.write(base64.b64decode(encoded_image))
                image_file.close()
                prediction = predict_image(image_file.name)
            finally:
                os.unlink(image_file.name)

            guidance = treatment_for(prediction["disease"], self.treatments)
            self._send_json(
                200,
                {
                    **prediction,
                    "symptoms": guidance["symptoms"],
                    "treatments": guidance["recommended_actions"],
                    "prevention": guidance["prevention"],
                },
            )
        except (KeyError, ValueError, json.JSONDecodeError) as error:
            self._send_json(400, {"error": f"Invalid image request: {error}"})
        except Exception as error:
            self._send_json(500, {"error": str(error)})


if __name__ == "__main__":
    server = ThreadingHTTPServer(("0.0.0.0", 8000), CropHealthHandler)
    print("Crop health ML API listening on http://localhost:8000")
    server.serve_forever()