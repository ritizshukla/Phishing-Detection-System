from fastapi import FastAPI
from backend.model_loader import get_model
from backend.feature_extractor import extract_features
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# 🔥 FIX CORS ISSUE
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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