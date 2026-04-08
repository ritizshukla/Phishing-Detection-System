import joblib

model = joblib.load("ml/hybrid_model.pkl")

def get_model():
    return model