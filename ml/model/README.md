Place these four ImageFolder directories under `ml/dataset/train`, `ml/dataset/val`, and `ml/dataset/test`:

```text
Tomato___Bacterial_spot/
Tomato___Early_blight/
Tomato___Late_blight/
Tomato___healthy/
```

Run from `ml/model` (after installing `ml/requirements.txt`):

```powershell
python test_model.py
python train.py --epochs 5
python evaluate.py
```

`train.py` freezes the pretrained ResNet18 backbone and trains its new four-class final layer. It derives `labels.json` from `ImageFolder.classes` and saves the best checkpoint as `crop_disease_model.pth`. The model file is intentionally not included in Git.
