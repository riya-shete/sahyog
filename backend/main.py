
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from fastapi import UploadFile, File
from ocr_service import extract_text_with_tesseract
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import requests
from io import BytesIO
from PIL import Image
import pytesseract
import cv2
import numpy as np


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class TestData(BaseModel):
    Hb: float
class ReportRequest(BaseModel):
    fileUrl: str
    
@app.post("/predict")
async def predict(data: TestData):
    return {"risk": predict_risk(data)}



def extract_medical_data(image_bytes):
    # Image processing
    img = Image.open(BytesIO(image_bytes))
    img = cv2.cvtColor(np.array(img), cv2.COLOR_RGB2BGR)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # OCR extraction
    text = pytesseract.image_to_string(gray)
    
    # Simple parameter extraction (customize as needed)
    parameters = {}
    if 'Hb' in text:
        parameters['Hb'] = float(text.split('Hb')[1].split()[0])
    if 'WBC' in text:
        parameters['WBC'] = float(text.split('WBC')[1].split()[0])
    
    return parameters

@app.post("/analyze-report")
async def analyze_report(request: ReportRequest):
    try:
        # 1. Download file from Firebase
        response = requests.get(request.fileUrl)
        response.raise_for_status()
        
        # 2. Process with OCR
        parameters = extract_medical_data(response.content)
        
        # 3. AI Risk Assessment (mock implementation)
        risk = "High risk" if parameters.get('Hb', 0) < 10 else "Normal"
        
        return {
            "status": "success",
            "parameters": parameters,
            "riskAssessment": risk,
            "fileUrl": request.fileUrl
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
