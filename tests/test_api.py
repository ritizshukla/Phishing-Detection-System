import requests

data = {
    "f1": 1,
    "f2": 0,
    "f3": 1,
    "f4": 0
}

response = requests.post("http://localhost:8000/predict", json=data)

print(response.json())