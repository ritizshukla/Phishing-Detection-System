import pandas as pd
import joblib
from sklearn.metrics import classification_report

df = pd.read_excel("data/raw/data_bal - 20000.xlsx")
df = df.dropna()

X = df.drop("Result", axis=1)
y = df["Result"]
y = y.replace({-1: 0})

model = joblib.load("ml/hybrid_model.pkl")

y_pred = model.predict(X)

print(classification_report(y, y_pred))