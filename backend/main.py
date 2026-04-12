from fastapi import FastAPI
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from urllib.parse import urlsplit
from functools import lru_cache
from pathlib import Path
import pandas as pd

try:
    from backend.model_loader import get_model, predict_url_probability
except ModuleNotFoundError:
    from model_loader import get_model, predict_url_probability


app = FastAPI()

TRUSTED_EXACT_HOSTS = {
    "github.com",
    "www.github.com",
    "google.com",
    "www.google.com",
    "mail.google.com",
    "accounts.google.com",
    "youtube.com",
    "www.youtube.com",
    "paypal.com",
    "www.paypal.com",
    "stackoverflow.com",
    "www.stackoverflow.com",
    "microsoft.com",
    "www.microsoft.com",
}

TRUSTED_SUFFIX_HOSTS = (
    ".github.com",
    ".google.com",
    ".youtube.com",
    ".paypal.com",
    ".stackoverflow.com",
    ".microsoft.com",
)

PROJECT_ROOT = Path(__file__).resolve().parent.parent
CLEAN_DATA_PATH = PROJECT_ROOT / "data" / "processed" / "training_data_clean.csv"


def get_hostname(url: str) -> str:
    try:
        return urlsplit(url).hostname or ""
    except Exception:
        return ""


def is_trusted_host(hostname: str) -> bool:
    host = hostname.lower().strip()
    if not host:
        return False
    if host in TRUSTED_EXACT_HOSTS:
        return True
    if host in get_data_trusted_hosts():
        return True
    return any(host.endswith(suffix) for suffix in TRUSTED_SUFFIX_HOSTS)


@lru_cache(maxsize=1)
def get_data_trusted_hosts() -> set[str]:
    """Build a trusted host set from cleaned labels to cut false positives."""
    if not CLEAN_DATA_PATH.exists():
        return set()

    try:
        df = pd.read_csv(CLEAN_DATA_PATH, usecols=["url", "label"])
    except Exception:
        return set()

    def host_of(value: str) -> str:
        try:
            return (urlsplit(str(value)).hostname or "").lower().strip()
        except Exception:
            return ""

    df["host"] = df["url"].map(host_of)
    df = df[df["host"] != ""]
    if df.empty:
        return set()

    grouped = df.groupby("host")["label"].agg(["count", "sum"])
    grouped = grouped.rename(columns={"sum": "phishing_count"})
    grouped["phishing_ratio"] = grouped["phishing_count"] / grouped["count"]

    # A host is trusted if it appears enough times and is mostly/fully legitimate.
    trusted = grouped[
        (grouped["count"] >= 5)
        & (grouped["phishing_ratio"] <= 0.02)
    ]
    return set(trusted.index.tolist())


class URLRequest(BaseModel):
    url: str


@app.post("/predict")
def predict(data: URLRequest):
    url = data.url
    model = get_model()
    proba = predict_url_probability(model, url)
    hostname = get_hostname(url)

    # Validation-backed threshold chosen to maximize precision while keeping recall usable.
    threshold = 0.97
    prediction = 1 if proba > threshold else 0
    confidence = proba

    explanation = []

    if len(url) > 75:
        explanation.append("URL is very long")

    if url.count(".") > 3:
        explanation.append("Too many subdomains")

    if "@" in url:
        explanation.append("Contains '@' symbol")

    if "-" in url:
        explanation.append("Contains hyphen")

    if prediction == 1 and len(explanation) == 0:
        explanation.append("Suspicious pattern detected")

    # Prevent false positives on known trusted hosts unless URL has direct spoof markers.
    has_spoof_marker = ("@" in url) or ("xn--" in hostname)
    if is_trusted_host(hostname) and not has_spoof_marker:
        prediction = 0
        confidence = min(confidence, 0.25)
        explanation = ["Trusted domain matched"]

    if prediction == 0:
        if not explanation:
            explanation = ["No major security issues detected"]

    return {
        "prediction": prediction,
        "confidence": confidence,
        "explanation": explanation,
    }


@app.exception_handler(RuntimeError)
def runtime_error_handler(_, exc: RuntimeError):
    return JSONResponse(status_code=503, content={"detail": str(exc)})
