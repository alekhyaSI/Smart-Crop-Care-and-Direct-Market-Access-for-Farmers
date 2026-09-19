# ML module

This independent PyTorch module screens tomato leaf images with a pretrained ResNet18 using ImageNet weights. It supports four classes only: bacterial spot, early blight, late blight, and healthy.

Install with `pip install -r requirements.txt`. To download the reproducible four-class subset from Hugging Face, run from this directory:

```powershell
python download_dataset.py --seed 42
```

The script streams `Project-AgML/tomato_leaf_disease`, saves only the four supported classes, and creates 280 train, 60 validation, and 60 test JPGs per class. Do not commit the generated `dataset/` directory. To use an already prepared dataset instead, put the four class folders into each of `dataset/train`, `dataset/val`, and `dataset/test`, then run the commands in `model/README.md`.

The prediction confidence is a model probability, not diagnostic certainty. Treatment guidance is maintained separately in `dataset/treatments.json`.

## Run the ML API

From the repository root, install the ML dependencies and start the local API:

```powershell
python -m pip install -r ml/requirements.txt
python ml/api.py
```

The frontend sends crop images to `http://localhost:8000/predict`. Set `VITE_ML_API_URL` when the API is hosted elsewhere. The API loads the model once and returns the prediction together with the matching treatment guidance.