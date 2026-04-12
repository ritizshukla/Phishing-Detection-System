🔐 Real-Time Phishing Detection System (AI/ML + Chrome Extension)
A production-ready AI-powered phishing detection system that analyzes URLs in real time and warns users before they visit potentially malicious websites. This project combines Machine Learning, Feature Engineering, a FastAPI backend, and a Chrome Extension UI to deliver a complete end-to-end cybersecurity solution.
🚀 Features
🔍 Real-time URL analysis: Instant scanning of URLs as you browse.
🧠 ML-based detection: Uses an optimized Random Forest model for high accuracy.
📊 Confidence & Explanation: Shows a probability score and specific reasons why a site was flagged.
⚡ FastAPI Backend: Asynchronous API designed for low-latency predictions.
🌐 Chrome Extension: Seamless browser integration for live protection.
🎨 Modern UI: Glassmorphism design with fluid animations.
🟢 Smart Routing: Dedicated "Safe" and "Warning" pages with risk meters.
📉 Precision Tuning: Optimized decision threshold () to reduce false positives.
🧠 Model Overview
The heart of the system is a Random Forest classifier trained on a balanced dataset of 20,000+ URLs.
🧩 Feature Engineering
The model extracts 12+ linguistic and structural features from each URL:
Length Metrics: URL length, Domain length, Path length.
Structural Signals: Number of dots, Presence of digits, Special characters (@, -).
Security Markers: HTTPS presence.
Suspicious Keywords: Detecting terms like login, secure, verify, update, bank, etc.
Query Analysis: Evaluation of query parameters and sensitive strings.
📌 Key Logic
Instead of a simple binary classification, the system uses Probability-based Prediction. By setting a custom threshold of 0.65, we ensure that warnings are only issued when the model is highly confident, significantly reducing user fatigue from false alarms.
🏗️ Project Structure
Phishing Detection System/
│
├── backend/
│   ├── main.py              # FastAPI Entry Point
│   ├── feature_extractor.py # URL Feature Engineering Logic
│   ├── model_loader.py      # ML Model loading utility
│   └── schemas.py           # Pydantic data models
│
├── ml/
│   ├── train_model.py       # Script to train the classifier
│   ├── evaluate_model.py    # Performance metrics (Accuracy, F1, Precision)
│   ├── hybrid_model.pkl     # The saved production model
│
├── extension/
│   ├── background.js        # Event listener for URL changes
│   ├── manifest.json        # Extension configuration
│   ├── warning/             # Red-screen warning UI
│   ├── safe/                # Green-screen safety UI
│   └── popup/               # Extension toolbar UI
│
├── data/
│   └── raw/                 # Training datasets (e.g., data_bal-20000.xlsx)
│
├── tests/                   # Automated API and Model tests
└── requirements.txt         # Project dependencies


⚙️ Installation
1️⃣ Clone the Repository
git clone [https://github.com/your-username/phishing-detection-system.git](https://github.com/your-username/phishing-detection-system.git)
cd phishing-detection-system


2️⃣ Create a Virtual Environment
python -m venv phish_venv

# Activate on Windows:
phish_venv\Scripts\activate   
# Activate on macOS/Linux:
source phish_venv/bin/activate


3️⃣ Install Dependencies
pip install -r requirements.txt


🧪 Training & Running
Train the Model
If you wish to retrain the model with your own data:
python -m ml.train_model


Start the Backend API
uvicorn backend.main:app --reload


Once running, you can access the interactive Swagger documentation at: http://127.0.0.1:8000/docs
Setup Chrome Extension
Open Chrome and go to chrome://extensions/.
Turn on Developer Mode (top right).
Click Load Unpacked.
Select the extension/ folder in this project directory.
⚡ How It Works
Detection: The Chrome Extension monitors the active tab's URL.
Request: The URL is sent to the FastAPI /predict endpoint.
Extraction: The backend extracts 12+ features from the raw URL string.
Inference: The Random Forest model calculates a phishing probability.
Response: If probability , the extension redirects the user to the warning.html page.
📊 API Example Response
{
  "prediction": 1,
  "confidence": 0.82,
  "explanation": [
    "URL length exceeds safe limits",
    "Contains suspicious keyword: 'login'",
    "Non-standard use of special characters"
  ]
}


🔮 Future Improvements
🌍 Domain Reputation: Integrate with Google Safe Browsing API.
🔐 SSL Check: Add real-time SSL certificate validation.
🧠 Deep Learning: Experiment with LSTM or Transformer-based URL analysis.
☁️ Cloud Deployment: Deploy the API via AWS or Docker.

👨‍💻 Author
Ritiz Shukla
Ai Developer
⭐ If you like this project, please give it a star on GitHub and share it with others!
