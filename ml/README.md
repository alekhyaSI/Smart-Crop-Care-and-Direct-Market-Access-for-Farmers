# ML module

This independent PyTorch module screens tomato leaf images with a pretrained ResNet18 using ImageNet weights. It supports four classes only: bacterial spot, early blight, late blight, and healthy.

Install with `pip install -r requirements.txt`. To download the reproducible four-class subset from Hugging Face, run from this directory:

```powershell
python download_dataset.py --seed 42
```

The script streams `Project-AgML/tomato_leaf_disease`, saves only the four supported classes, and creates 280 train, 60 validation, and 60 test JPGs per class. Do not commit the generated `dataset/` directory. To use an already prepared dataset instead, put the four class folders into each of `dataset/train`, `dataset/val`, and `dataset/test`, then run the commands in `model/README.md`.

The prediction confidence is a model probability, not diagnostic certainty. Treatment guidance is maintained separately in `data/treatments.json`.