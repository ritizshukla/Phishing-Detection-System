import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import StackingClassifier

# Load dataset
df = pd.read_excel("data/raw/data_bal - 20000.xlsx")

# Clean columns
df.columns = df.columns.str.strip()

# Rename columns
df.rename(columns={"URLs": "url", "Labels": "label"}, inplace=True)

# Convert labels (if needed)
df["label"] = df["label"].replace({-1: 0})

# ---------------- FEATURE EXTRACTION ----------------
def extract_features(url):
    url = str(url)

    return [
        len(url),              # URL length
        url.count("."),        # dots
        int("https" in url),   # https
        int("@" in url),       # @ symbol
        int("-" in url),       # hyphen
    ]

# Apply feature extraction
X = df["url"].apply(extract_features)
X = pd.DataFrame(X.tolist())

y = df["label"]

# Split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Model
rf = RandomForestClassifier()

model = StackingClassifier(
    estimators=[("rf", rf)],
    final_estimator=LogisticRegression()
)

# Train
model.fit(X_train, y_train)

# Save model
joblib.dump(model, "ml/hybrid_model.pkl")

print("Model trained successfully!")