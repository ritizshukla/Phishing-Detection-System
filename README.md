# **🔐 Real-Time Phishing Detection System (AI/ML \+ Chrome Extension)**

A production-ready AI-powered phishing detection system that analyzes URLs in real time and warns users before they visit potentially malicious websites. This project combines **Machine Learning**, **Feature Engineering**, a **FastAPI backend**, and a **Chrome Extension UI** to deliver a complete end-to-end cybersecurity solution.

## **🚀 Features**

* 🔍 **Real-time URL analysis**: Instant scanning of URLs as you browse.  
* 🧠 **ML-based detection**: Uses an optimized Random Forest model for high accuracy.  
* 📊 **Confidence & Explanation**: Shows a probability score and specific reasons why a site was flagged.  
* ⚡ **FastAPI Backend**: Asynchronous API designed for low-latency predictions.  
* 🌐 **Chrome Extension**: Seamless browser integration for live protection.  
* 🎨 **Modern UI**: Glassmorphism design with fluid animations.  
* 🟢 **Smart Routing**: Dedicated "Safe" and "Warning" pages with risk meters.  
* 📉 **Precision Tuning**: Optimized decision threshold (![][image1]) to reduce false positives.

## **🧠 Model Overview**

The heart of the system is a **Random Forest** classifier trained on a balanced dataset of 20,000+ URLs.

### **🧩 Feature Engineering**

The model extracts 12+ linguistic and structural features from each URL:

* **Length Metrics**: URL length, Domain length, Path length.  
* **Structural Signals**: Number of dots, Presence of digits, Special characters (@, \-).  
* **Security Markers**: HTTPS presence.  
* **Suspicious Keywords**: Detecting terms like login, secure, verify, update, bank, etc.  
* **Query Analysis**: Evaluation of query parameters and sensitive strings.

### **📌 Key Logic**

Instead of a simple binary classification, the system uses **Probability-based Prediction**. By setting a custom threshold of **0.65**, we ensure that warnings are only issued when the model is highly confident, significantly reducing user fatigue from false alarms.

## **🏗️ Project Structure**

Phishing Detection System/  
│  
├── backend/  
│   ├── main.py              \# FastAPI Entry Point  
│   ├── feature\_extractor.py \# URL Feature Engineering Logic  
│   ├── model\_loader.py      \# ML Model loading utility  
│   └── schemas.py           \# Pydantic data models  
│  
├── ml/  
│   ├── train\_model.py       \# Script to train the classifier  
│   ├── evaluate\_model.py    \# Performance metrics (Accuracy, F1, Precision)  
│   ├── hybrid\_model.pkl     \# The saved production model  
│  
├── extension/  
│   ├── background.js        \# Event listener for URL changes  
│   ├── manifest.json        \# Extension configuration  
│   ├── warning/             \# Red-screen warning UI  
│   ├── safe/                \# Green-screen safety UI  
│   └── popup/               \# Extension toolbar UI  
│  
├── data/  
│   └── raw/                 \# Training datasets (e.g., data\_bal-20000.xlsx)  
│  
├── tests/                   \# Automated API and Model tests  
└── requirements.txt         \# Project dependencies

## **⚙️ Installation**

### **1️⃣ Clone the Repository**

git clone \[https://github.com/your-username/phishing-detection-system.git\](https://github.com/your-username/phishing-detection-system.git)  
cd phishing-detection-system

### **2️⃣ Create a Virtual Environment**

python \-m venv phish\_venv

\# Activate on Windows:  
phish\_venv\\Scripts\\activate     
\# Activate on macOS/Linux:  
source phish\_venv/bin/activate

### **3️⃣ Install Dependencies**

pip install \-r requirements.txt

## **🧪 Training & Running**

### **Train the Model**

If you wish to retrain the model with your own data:

python \-m ml.train\_model

### **Start the Backend API**

uvicorn backend.main:app \--reload

Once running, you can access the interactive Swagger documentation at: http://127.0.0.1:8000/docs

### **Setup Chrome Extension**

1. Open Chrome and go to chrome://extensions/.  
2. Turn on **Developer Mode** (top right).  
3. Click **Load Unpacked**.  
4. Select the extension/ folder in this project directory.

## **⚡ How It Works**

1. **Detection**: The Chrome Extension monitors the active tab's URL.  
2. **Request**: The URL is sent to the FastAPI /predict endpoint.  
3. **Extraction**: The backend extracts 12+ features from the raw URL string.  
4. **Inference**: The Random Forest model calculates a phishing probability.  
5. **Response**: If probability ![][image2], the extension redirects the user to the warning.html page.

### **📊 API Example Response**

{  
  "prediction": 1,  
  "confidence": 0.82,  
  "explanation": \[  
    "URL length exceeds safe limits",  
    "Contains suspicious keyword: 'login'",  
    "Non-standard use of special characters"  
  \]  
}

## **🔮 Future Improvements**

* 🌍 **Domain Reputation**: Integrate with Google Safe Browsing API.  
* 🔐 **SSL Check**: Add real-time SSL certificate validation.  
* 🧠 **Deep Learning**: Experiment with LSTM or Transformer-based URL analysis.  
* ☁️ **Cloud Deployment**: Deploy the API via AWS or Docker.

## **👨‍💻 Author**

**Ritiz Shukla**

*Cybersecurity Enthusiast & AI Developer*

⭐ **If you like this project, please give it a star on GitHub and share it with others\!**

[image1]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAXCAYAAABu8J3cAAACbElEQVR4Xu2VP2gUQRTGZzGCgqKCh+b+7NztHR6RdOcfELHSwiKFNirWYmOjgjYWNhYGbCRYBEUsQkRSaicSSCNEsFEUUUiagEIMBBQlRfy93Td37zYxRlMJ98HH7Hzzvbdvdt7uOtdDD3+BarW603t/JEmSOL+2HpRKpbLESx6rt1qtzbVabQ+XkdW5zw47T0HwE5LMwAfwKTyZ96yBiPgzxLxmfMQ4B6+GRa774Sz8DEfVI/f6anI4Vy6XtyJONxqNgkoR80UCDncZV0cUx/E1TRrJLpk/Zr4QDKaQZcOPlUrloMmTJnoIj1sR4ySchwNWtygUCtvyPjkGcl1gE5eDTwsRX38nOgeCdmGYZmxZXR/fMvqQ1S1YO4pnCU41m83t+fWAdRWiptk1CrludQvWr4gHTsgTZVyEM8SeY3mT8aWF4EkYR+Ew1/udbV7EATj/L4UED3wHx12naZekb4JPCmH+Qcjbw9Rfgj/w3mwnkwIQv22wkAUab1DlPuYT8GfwSSHwFUUcUkkKvi2xwbPRo7mvhTzDvyXoEiO6NLP1W8Sd/spehvg3zYo2pjc5bXUL3+mRMWfO2xYibxHXI3AO/YTxrDiJ8Ci7PmA+6/IVR2ZhdjVpd8/8rhTistz2G3LHxA6JxpgETY7hLOL5tuDSZG/hS/sZZn5PjixoMopHvMVicbfa5GOYPk3jmYLj8gsIuchzUT19QUvhs85/IQXBW3HW9e1XUD1v4HuS7wuaPvob8Dsc9tnun3OjvdajzflJe++LX+XL2jbT1ce0kFP59T+hXq9XJFaPsmsDAcFDAQfkfvn1Hnr4L/ALq/vO30/9dCwAAAAASUVORK5CYII=>

[image2]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADcAAAAXCAYAAACvd9dwAAAC60lEQVR4Xu2WT4jNURTHf683aoQsGC9v3pvfvDd4lFBjYShKFiz836iRxShjZVZSspiNhZSFkpqUKFmMphRJFLJidjKRRo16RkiyoKgZPl/v3td15/d+vdeb2ej3rW/3nnPuufec++f8fkGQIEGC/wadnZ2t+Xx+rdjW1rbQt9eBVBiGPV1dXcvUdw3t7e1LMpnMAlcH0qyV9XRzgjSBfYHDJHlNfdpz/qBaYOw2fMbl29HR8QZe7u7unmftyKewT9E+ox2CD+EvjXPnmRMQ1HEW2+7Iq5EnA+8EosC4g/A7PKqEtCn0p+EuO8Yk99vj+VwuN9+dK5ACw1tNFnHUDYOrsUeL+XoFRKD9vt4FfleUCGN3GFUKn31wsFgsLrbjNJdo5VjoDitz+BGe8e2NAP+zNZLbrWvm613g9wGWiSfn21w0lJyFTg6nARa4AJf79npg3lhkcugfxxUX+cFR5thE+8hs9kn/utnkCoVCCfsQ/cN13zoc+uAkTldpC769FgiqlfF3m0xOT+QBCa2g3Qy/KoGIgqJTHiHB9chPjN8ad76aMI/5kHEa8e1RUOBKoMnkpll3p6P7e80Vi9WZ5KoJsxErkT8x5rkd0whU2idwvh0XnDAL13Ism80utTrjJ/07d6yHFuy3otaNQ5pg98IXHP+6oL5SHllQ0B2AN4KYOUwST0ul0iKr85OjGm9UH153N6rWps6AeyUbfXeM7Y1axBYBX+8irLwjBV4tZsTRb5IblWyupOTPfB5WSRf3HP6Bqk5YqVKX3EXqBT4FWKbb4ukvwh4rawOR77llH/lmWPmzqRYG+qcVNEkOSjabPqEKGZhboGuMbgz+tH5VhJVvXBmHgbpLagzMBr1nvhPwGP1x2vvuGH2U0X9Dv8VRp5CPoP8Bh+FL+MpNViDBDehewzth5cSmlIP/yQj4Mc1j6JthaBK6MmaXe831qfnWfJifiv28863uJ8CF9LLrTdJmfHuCBAkSzBr+AAoV56k9JjJYAAAAAElFTkSuQmCC>