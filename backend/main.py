from fastapi import FastAPI
from backend.model_loader import get_model
from backend.feature_extractor import extract_features

app = FastAPI()

model = get_model()

@app.post("/predict")
def predict(data: dict):

    url = data["url"]

    features = extract_features(url)

    prediction = model.predict([features])[0]

    return {
        "prediction": int(prediction),
        "result": "Phishing" if prediction == 1 else "Safe"
    }