# Backend

Install with `pip install -r requirements.txt`, then from the project root run:

```powershell
uvicorn backend.main:app --reload
```

The API serves diagnosis and clearly marked demo market endpoints. Diagnosis requires the trained model at `ml/model/crop_disease_model.pth`.