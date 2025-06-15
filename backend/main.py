from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pytesseract
from PIL import Image
import cv2
import numpy as np
import re
from io import BytesIO
import logging
import os
import platform

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configure Tesseract path
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Enhanced medical patterns with better regex
MEDICAL_PATTERNS = {
    "Hemoglobin": {
        "pattern": r"Hemoglobin\s*\(Hb\)\s*[+\-]?\s*(\d+\.?\d*)",
        "unit": "g/dl",
        "normal_range": "12-15",
        "category": "Blood Counts"
    },
    "RBC": {
        "pattern": r"Total\s+RBC\s+Count\s*[+\-]?\s*(\d+\.?\d*)",
        "unit": "Millions/cumm",
        "normal_range": "3.8-4.8",
        "category": "Blood Counts"
    },
    "WBC": {
        "pattern": r"Total\s+Leucocyte\s+Count\s*\(TLC\)\s*[:\s]*(\d+)",
        "unit": "Cells/cumm",
        "normal_range": "4000-10000",
        "category": "Blood Counts"
    },
    "Platelets": {
        "pattern": r"Platelet\s+Count\s*[+\-]?\s*(\d+\.?\d*)",
        "unit": "Lakhs/cumm",
        "normal_range": "1.5-4.5",
        "category": "Blood Counts"
    },
    "PCV": {
        "pattern": r"PCV\s*[:\s]*(\d+\.?\d*)",
        "unit": "%",
        "normal_range": "40-50",
        "category": "Blood Counts"
    },
    "MCV": {
        "pattern": r"Mcv\s*[:\s]*(\d+\.?\d*)",
        "unit": "fl",
        "normal_range": "83-101",
        "category": "Red Cell Indices"
    },
    "MCH": {
        "pattern": r"MCH\s*[+\-]?\s*(\d+\.?\d*)",
        "unit": "pg",
        "normal_range": "27-32",
        "category": "Red Cell Indices"
    },
    "MCHC": {
        "pattern": r"MCHC\s*[+\-]?\s*(\d+\.?\d*)",
        "unit": "g/dl",
        "normal_range": "315-345",
        "category": "Red Cell Indices"
    },
    "Polymorphs": {
        "pattern": r"Polymorphs\s*[:\s]*(\d+\.?\d*)",
        "unit": "%",
        "normal_range": "40-80",
        "category": "Differential Count"
    },
    "Lymphocytes": {
        "pattern": r"Lymphocytes\s*[+\-]?\s*(\d+\.?\d*)",
        "unit": "%",
        "normal_range": "20-40",
        "category": "Differential Count"
    },
    "Monocytes": {
        "pattern": r"Monocytes\s*[+\-]?\s*(\d+\.?\d*)",
        "unit": "%",
        "normal_range": "2-10",
        "category": "Differential Count"
    },
    "Eosinophils": {
        "pattern": r"Eosinophils\s*[:\s]*(\d+\.?\d*)",
        "unit": "%",
        "normal_range": "1-6",
        "category": "Differential Count"
    },
    "Basophils": {
        "pattern": r"Basophils\s*[+\-]?\s*(\d+\.?\d*)",
        "unit": "%",
        "normal_range": "0-2",
        "category": "Differential Count"
    }
}

def determine_status(value, normal_range):
    """Determine if a value is normal, high, or low"""
    try:
        if '-' in normal_range:
            min_val, max_val = map(float, normal_range.split('-'))
            if value < min_val:
                return "Low"
            elif value > max_val:
                return "High"
            else:
                return "Normal"
        else:
            return "Normal"
    except:
        return "Unknown"

def get_health_interpretation(parameter, value, status):
    """Provide basic health interpretation"""
    interpretations = {
        "Hemoglobin": {
            "Low": "May indicate anemia or blood loss",
            "High": "May indicate dehydration or lung disease",
            "Normal": "Healthy oxygen-carrying capacity"
        },
        "WBC": {
            "Low": "May indicate weakened immune system",
            "High": "May indicate infection or inflammation",
            "Normal": "Healthy immune system"
        },
        "Platelets": {
            "Low": "May indicate bleeding disorders",
            "High": "May indicate blood clotting issues",
            "Normal": "Healthy blood clotting ability"
        }
    }
    
    return interpretations.get(parameter, {}).get(status, "Consult your doctor for interpretation")

@app.post("/analyze-report")
async def analyze_report(file: UploadFile = File(...)):
    try:
        logger.info(f"Processing file: {file.filename}")
        
        if not file:
            raise HTTPException(status_code=400, detail="No file uploaded")

        if not file.content_type or not file.content_type.startswith(('image/', 'application/pdf')):
            logger.warning(f"Invalid content type: {file.content_type}")
            raise HTTPException(status_code=400, detail="Only images/PDFs are supported")

        contents = await file.read()
        if not contents:
            raise HTTPException(status_code=400, detail="Empty file")

        logger.info(f"File size: {len(contents)} bytes")

        if file.content_type == 'application/pdf':
            raise HTTPException(status_code=400, detail="PDF processing not implemented yet. Please upload an image file.")

        try:
            nparr = np.frombuffer(contents, np.uint8)
            img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            
            if img is None:
                raise HTTPException(status_code=400, detail="Could not decode image. Please ensure it's a valid image file.")
            
            logger.info(f"Image shape: {img.shape}")
            
        except Exception as e:
            logger.error(f"Image decoding error: {str(e)}")
            raise HTTPException(status_code=400, detail=f"Image processing failed: {str(e)}")
        
        try:
            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            thresh = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2)
            
        except Exception as e:
            logger.error(f"Image preprocessing error: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Image preprocessing failed: {str(e)}")
        
        try:
            pil_image = Image.fromarray(thresh)
            text = pytesseract.image_to_string(pil_image, config='--oem 3 --psm 6')
            logger.info(f"Extracted text length: {len(text)}")
            
        except Exception as e:
            logger.error(f"OCR error: {str(e)}")
            raise HTTPException(status_code=500, detail=f"OCR processing failed: {str(e)}")
        
        # Extract and categorize parameters
        parameters = {}
        categories = {}
        
        for param, config in MEDICAL_PATTERNS.items():
            try:
                match = re.search(config["pattern"], text, re.IGNORECASE)
                if match and match.group(1):
                    try:
                        value = float(match.group(1))
                        status = determine_status(value, config["normal_range"])
                        interpretation = get_health_interpretation(param, value, status)
                        
                        param_data = {
                            "value": value,
                            "unit": config["unit"],
                            "normal_range": config["normal_range"],
                            "status": status,
                            "interpretation": interpretation,
                            "category": config["category"]
                        }
                        
                        parameters[param] = param_data
                        
                        # Group by category
                        category = config["category"]
                        if category not in categories:
                            categories[category] = {}
                        categories[category][param] = param_data
                        
                    except ValueError:
                        logger.warning(f"Could not convert value to float for {param}")
                        continue
            except Exception as e:
                logger.error(f"Pattern matching error for {param}: {str(e)}")
                continue

        logger.info(f"Extracted parameters: {list(parameters.keys())}")

        # Generate summary
        total_params = len(parameters)
        abnormal_params = len([p for p in parameters.values() if p["status"] != "Normal"])
        
        summary = {
            "total_parameters": total_params,
            "abnormal_parameters": abnormal_params,
            "overall_status": "Normal" if abnormal_params == 0 else f"{abnormal_params} parameter(s) abnormal",
            "report_type": "Complete Blood Count (CBC)" if any("Blood Counts" in p.get("category", "") for p in parameters.values()) else "Medical Report"
        }

        return {
            "status": "success",
            "summary": summary,
            "parameters": parameters,
            "categories": categories,
            "filename": file.filename,
            "raw_text": text[:500] + "..." if len(text) > 500 else text  # For debugging
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@app.get("/")
async def root():
    return {"message": "Medical Report Analyzer API"}

@app.get("/health")
async def health_check():
    try:
        version = pytesseract.get_tesseract_version()
        logger.info(f"Tesseract version: {version}")
        return {"status": "healthy", "tesseract_version": str(version)}
    except Exception as e:
        logger.error(f"Tesseract health check failed: {str(e)}")
        return {"status": "unhealthy", "error": str(e)}