import requests

# Test OCR
with open("sample_report.jpg", "rb") as f:
    response = requests.post(
        "http://localhost:8000/analyze-report",
        files={"file": f}
    )
    print("OCR Result:", response.json())

# Test AI Prediction
response = requests.post(
    "http://localhost:8000/predict",
    json={"Hb": 9.5}
)
print("AI Prediction:", response.json())