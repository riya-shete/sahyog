from fastapi import FastAPI
from predict import predict_risk  # Your AI function

app = FastAPI()
@app.post("/predict")
async def predict(test_data: dict):
    return predict_risk(test_data)  # Returns {"risk": "Anemia"}