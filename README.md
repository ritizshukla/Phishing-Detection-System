🔐 Real-Time Phishing Detection System using AI/ML

Detect. Analyze. Protect — Real-time phishing defense using AI.

📌 Overview

This project is a Real-Time AI/ML-Based Phishing Detection and Prevention System designed to identify and block malicious websites during browsing. It uses a Hybrid Super Learner Ensemble Model combining multiple machine learning algorithms to achieve high accuracy and robust performance.

The system is integrated with a FastAPI backend and a Chrome Extension, enabling real-time detection and user protection.

🚀 Features

🔍 Real-time phishing detection: Instantly scans URLs as you browse.

🤖 Hybrid AI/ML model: Combines Random Forest, XGBoost, and LightGBM.

🌐 Chrome Extension: Seamless browser integration for live website monitoring.

⚡ FastAPI backend: High-performance, asynchronous prediction API.

📊 High accuracy: Fine-tuned to drastically reduce false positives.

🧠 Feature-engineered dataset: Optimized features for highly efficient training.

📸 Screenshots & Demo

(Replace the placeholder links below with your actual image/video URLs)

🎥 Live Demo

(Link your demo GIF or video here)

🖼️ Extension in Action

Malicious Website Warning

Safe Website Indicator

(Add screenshot URL here)

(Add screenshot URL here)

🧠 Model Architecture

The system uses a Hybrid Super Learner Ensemble:

Random Forest → Handles noisy data and reduces overfitting.

XGBoost → Learns complex patterns effectively.

LightGBM → Fast and efficient gradient boosting.

Stacking Ensemble → Combines the strengths of all individual models to produce a definitive classification.

📁 Project Structure

phishing-detection-system/
│
├── venv/
├── requirements.txt
├── README.md
│
├── data/
│   ├── raw/
│   │   ├── data_bal.xlsx
│   │   ├── data_imbal.xlsx
│   │
│   ├── processed/
│   │   ├── final_dataset.csv
│
├── ml/
│   ├── train_model.py
│   ├── evaluate_model.py
│   ├── hybrid_model.pkl
│
├── backend/
│   ├── main.py
│   ├── model_loader.py
│   ├── feature_extractor.py
│
├── extension/
│   ├── manifest.json
│   ├── background.js
│   ├── content.js
│   │
│   ├── popup/
│   │   ├── popup.html
│   │   ├── popup.js
│   │
│   ├── warning/
│   │   ├── warning.html
│
├── notebooks/
│   ├── analysis.ipynb
│
└── tests/
    ├── test_model.py
    ├── test_api.py


⚙️ Tech Stack

Programming Language: Python

Machine Learning: Scikit-learn, XGBoost, LightGBM

Backend: FastAPI

Frontend: HTML, CSS, JavaScript

Extension: Chrome Extension API

Data Processing: Pandas, NumPy

📊 Dataset

The model is trained on a combined dataset:

data_bal - 20000.xlsx

data_imbal - 55000.xlsx

Key Features Extracted:

URL length

Number of dots

HTTPS usage

Presence of special characters

Domain-based attributes

🛠️ Installation & Setup

1. Clone Repository

git clone [https://github.com/your-username/phishing-detection-system.git](https://github.com/your-username/phishing-detection-system.git)
cd phishing-detection-system


2. Create Virtual Environment

python -m venv venv


Activate the environment:

Windows:

venv\Scripts\activate


Linux/Mac:

source venv/bin/activate


3. Install Dependencies

pip install -r requirements.txt


🧪 Run Backend Server

Start the FastAPI server:

cd backend
uvicorn main:app --reload


Open your browser and navigate to the interactive API documentation:
👉 http://localhost:8000/docs

🌐 Chrome Extension Setup

Open Google Chrome.

Navigate to chrome://extensions.

Toggle Developer Mode on (top right corner).

Click Load Unpacked.

Select the extension/ folder from this repository.

🔄 System Workflow

graph TD;
    A[User opens a website] --> B[Chrome Extension triggers];
    B --> C[Extracts URL Features];
    C --> D[Sends POST request to FastAPI Backend];
    D --> E[Hybrid ML Model processes data];
    E --> F{Prediction Result};
    F -- Phishing --> G[Block page & Show Warning];
    F -- Safe --> H[Allow normal browsing];


(Note: The above diagram uses Mermaid.js which renders beautifully as a visual flowchart on GitHub!)

📈 Performance Metrics

The model is evaluated based on:

Accuracy: Overall correctness of the model.

Precision: Accuracy of positive (phishing) predictions.

Recall: Ability to find all phishing sites (Most important metric for security).

F1-score: Balance between Precision and Recall.

🎯 Expected Outcome

Real-time, on-the-fly phishing detection.

Significantly improved browsing security for end-users.

Reduced risk of credential theft and social engineering attacks.

A highly scalable AI-based cybersecurity solution.

🔮 Future Enhancements

[ ] Deep Learning Integration: Implement LSTM or BERT for complex URL sequence analysis.

[ ] Visual Phishing Detection: Compare website screenshots against known legitimate brands.

[ ] Mobile Support: Develop extensions for mobile browsers (e.g., Firefox/Kiwi on Android).

[ ] Threat Intelligence: Sync with global threat feeds (e.g., VirusTotal, PhishTank APIs).

📚 References

PhishTank Dataset

Kaggle Phishing Datasets

Academic research papers on Ensemble Learning for phishing detection.

👨‍💻 Author

Ritiz Shukla | B.Tech Computer Science & Engineering
LinkedIn | Portfolio | Email

⭐ Support

If you found this project helpful, please consider giving it a ⭐ on GitHub! It helps others find it and motivates me to keep building.
