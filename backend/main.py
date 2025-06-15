from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pytesseract
from PIL import Image, ImageEnhance, ImageFilter
import cv2
import numpy as np
import re
from io import BytesIO
import logging
from fuzzywuzzy import fuzz, process
from typing import Dict, List, Tuple, Optional
import math

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

# Enhanced medical patterns with multiple variations and fuzzy matching
MEDICAL_PATTERNS = {
    "Hemoglobin": {
        "patterns": [
            r"Hemoglobin\s*(?:\(Hb\))?\s*[:\-\s]*(\d+\.?\d*)",
            r"Hb\s*[:\-\s]*(\d+\.?\d*)",
            r"Haemoglobin\s*[:\-\s]*(\d+\.?\d*)"
        ],
        "fuzzy_names": ["hemoglobin", "hb", "haemoglobin", "hemoglobin (hb)"],
        "unit": "g/dl",
        "normal_range": "12-15",
        "category": "Blood Counts"
    },
    "RBC": {
        "patterns": [
            r"Total\s+RBC\s+Count\s*[:\-\s]*(\d+\.?\d*)",
            r"RBC\s+Count\s*[:\-\s]*(\d+\.?\d*)",
            r"Red\s+Blood\s+Cell\s*[:\-\s]*(\d+\.?\d*)",
            r"Total\s+RBC\s*[:\-\s]*(\d+\.?\d*)"
        ],
        "fuzzy_names": ["total rbc count", "rbc count", "rbc", "red blood cell", "total rbc"],
        "unit": "Millions/cumm",
        "normal_range": "3.8-4.8",
        "category": "Blood Counts"
    },
    "WBC": {
        "patterns": [
            r"Total\s+Leucocyte\s+Count\s*(?:\(TLC\))?\s*[:\-\s]*(\d+)",
            r"TLC\s*[:\-\s]*(\d+)",
            r"WBC\s*[:\-\s]*(\d+)",
            r"White\s+Blood\s+Cell\s*[:\-\s]*(\d+)",
            r"Total\s+Leukocyte\s+Count\s*[:\-\s]*(\d+)"
        ],
        "fuzzy_names": ["total leucocyte count", "tlc", "wbc", "white blood cell", "total leukocyte count"],
        "unit": "Cells/cumm",
        "normal_range": "4000-10000",
        "category": "Blood Counts"
    },
    "Platelets": {
        "patterns": [
            r"Platelet\s+Count\s*[:\-\s]*(\d+\.?\d*)",
            r"Platelets\s*[:\-\s]*(\d+\.?\d*)",
            r"PLT\s*[:\-\s]*(\d+\.?\d*)"
        ],
        "fuzzy_names": ["platelet count", "platelets", "plt"],
        "unit": "Lakhs/cumm",
        "normal_range": "1.5-4.5",
        "category": "Blood Counts"
    },
    "PCV": {
        "patterns": [
            r"PCV\s*[:\-\s]*(\d+\.?\d*)",
            r"Packed\s+Cell\s+Volume\s*[:\-\s]*(\d+\.?\d*)",
            r"Hematocrit\s*[:\-\s]*(\d+\.?\d*)",
            r"HCT\s*[:\-\s]*(\d+\.?\d*)"
        ],
        "fuzzy_names": ["pcv", "packed cell volume", "hematocrit", "hct"],
        "unit": "%",
        "normal_range": "40-50",
        "category": "Blood Counts"
    },
    "MCV": {
        "patterns": [
            r"MCV\s*[:\-\s]*(\d+\.?\d*)",
            r"Mean\s+Cell\s+Volume\s*[:\-\s]*(\d+\.?\d*)",
            r"Mcv\s*[:\-\s]*(\d+\.?\d*)"
        ],
        "fuzzy_names": ["mcv", "mean cell volume"],
        "unit": "fl",
        "normal_range": "83-101",
        "category": "Red Cell Indices"
    },
    "MCH": {
        "patterns": [
            r"MCH\s*[:\-\s]*(\d+\.?\d*)",
            r"Mean\s+Cell\s+Hemoglobin\s*[:\-\s]*(\d+\.?\d*)",
            r"Mch\s*[:\-\s]*(\d+\.?\d*)"
        ],
        "fuzzy_names": ["mch", "mean cell hemoglobin"],
        "unit": "pg",
        "normal_range": "27-32",
        "category": "Red Cell Indices"
    },
    "MCHC": {
        "patterns": [
            r"MCHC\s*[:\-\s]*(\d+\.?\d*)",
            r"Mean\s+Cell\s+Hemoglobin\s+Concentration\s*[:\-\s]*(\d+\.?\d*)",
            r"Mchc\s*[:\-\s]*(\d+\.?\d*)"
        ],
        "fuzzy_names": ["mchc", "mean cell hemoglobin concentration"],
        "unit": "g/dl",
        "normal_range": "31.5-34.5",
        "category": "Red Cell Indices"
    },
    "RDW-CV": {
        "patterns": [
            r"RDW-CV\s*[:\-\s]*(\d+\.?\d*)",
            r"RDW\s*CV\s*[:\-\s]*(\d+\.?\d*)",
            r"Red\s+Cell\s+Distribution\s+Width\s*[:\-\s]*(\d+\.?\d*)"
        ],
        "fuzzy_names": ["rdw-cv", "rdw cv", "red cell distribution width", "rdw"],
        "unit": "%",
        "normal_range": "11.6-14.0",
        "category": "Red Cell Indices"
    },
    "Polymorphs": {
        "patterns": [
            r"Polymorphs\s*[:\-\s]*(\d+\.?\d*)",
            r"Neutrophils\s*[:\-\s]*(\d+\.?\d*)",
            r"PMN\s*[:\-\s]*(\d+\.?\d*)"
        ],
        "fuzzy_names": ["polymorphs", "neutrophils", "pmn"],
        "unit": "%",
        "normal_range": "40-80",
        "category": "Differential Count"
    },
    "Lymphocytes": {
        "patterns": [
            r"Lymphocytes\s*[:\-\s]*(\d+\.?\d*)",
            r"Lymphs\s*[:\-\s]*(\d+\.?\d*)"
        ],
        "fuzzy_names": ["lymphocytes", "lymphs"],
        "unit": "%",
        "normal_range": "20-40",
        "category": "Differential Count"
    },
    "Monocytes": {
        "patterns": [
            r"Monocytes\s*[:\-\s]*(\d+\.?\d*)",
            r"Monos\s*[:\-\s]*(\d+\.?\d*)"
        ],
        "fuzzy_names": ["monocytes", "monos"],
        "unit": "%",
        "normal_range": "2-10",
        "category": "Differential Count"
    },
    "Eosinophils": {
        "patterns": [
            r"Eosinophils\s*[:\-\s]*(\d+\.?\d*)",
            r"Eos\s*[:\-\s]*(\d+\.?\d*)"
        ],
        "fuzzy_names": ["eosinophils", "eos"],
        "unit": "%",
        "normal_range": "1-6",
        "category": "Differential Count"
    },
    "Basophils": {
        "patterns": [
            r"Basophils\s*[:\-\s]*(\d+\.?\d*)",
            r"Basos\s*[:\-\s]*(\d+\.?\d*)"
        ],
        "fuzzy_names": ["basophils", "basos"],
        "unit": "%",
        "normal_range": "0-2",
        "category": "Differential Count"
    }
}

class EnhancedImagePreprocessor:
    """Enhanced image preprocessing for better OCR accuracy"""
    
    @staticmethod
    def enhance_image(image: np.ndarray) -> List[np.ndarray]:
        """Apply multiple preprocessing techniques and return list of processed images"""
        processed_images = []
        
        # Original grayscale
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        
        # Method 1: Adaptive thresholding
        adaptive_thresh = cv2.adaptiveThreshold(
            gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2
        )
        processed_images.append(adaptive_thresh)
        
        # Method 2: CLAHE + Adaptive threshold
        clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8,8))
        clahe_img = clahe.apply(gray)
        clahe_thresh = cv2.adaptiveThreshold(
            clahe_img, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2
        )
        processed_images.append(clahe_thresh)
        
        # Method 3: Gaussian blur + threshold
        blur = cv2.GaussianBlur(gray, (3, 3), 0)
        _, otsu_thresh = cv2.threshold(blur, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
        processed_images.append(otsu_thresh)
        
        # Method 4: Morphological operations
        kernel = np.ones((2,2), np.uint8)
        morph = cv2.morphologyEx(adaptive_thresh, cv2.MORPH_CLOSE, kernel)
        processed_images.append(morph)
        
        # Method 5: Noise reduction
        denoised = cv2.fastNlMeansDenoising(gray)
        denoised_thresh = cv2.adaptiveThreshold(
            denoised, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2
        )
        processed_images.append(denoised_thresh)
        
        return processed_images
    
    @staticmethod
    def correct_skew(image: np.ndarray) -> np.ndarray:
        """Detect and correct image skew"""
        try:
            # Find contours
            contours, _ = cv2.findContours(image, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
            
            # Find the largest contour (assumed to be the document)
            if contours:
                largest_contour = max(contours, key=cv2.contourArea)
                rect = cv2.minAreaRect(largest_contour)
                angle = rect[2]
                
                # Correct the angle
                if angle < -45:
                    angle = -(90 + angle)
                else:
                    angle = -angle
                
                # Rotate the image
                if abs(angle) > 0.5:  # Only rotate if significant skew
                    (h, w) = image.shape[:2]
                    center = (w // 2, h // 2)
                    M = cv2.getRotationMatrix2D(center, angle, 1.0)
                    rotated = cv2.warpAffine(image, M, (w, h), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE)
                    return rotated
        except:
            pass
        
        return image

class EnhancedTextExtractor:
    """Enhanced text extraction with multiple OCR configurations"""
    
    @staticmethod
    def extract_text_multiple_configs(images: List[np.ndarray]) -> List[str]:
        """Extract text using multiple Tesseract configurations"""
        configs = [
            '--oem 3 --psm 6',  # Default
            '--oem 3 --psm 4',  # Single column
            '--oem 3 --psm 1',  # Automatic page segmentation
            '--oem 3 --psm 3',  # Fully automatic
            '--oem 3 --psm 6 -c tessedit_char_whitelist=0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz.()-:/%',
        ]
        
        all_texts = []
        
        for img in images:
            for config in configs:
                try:
                    pil_image = Image.fromarray(img)
                    text = pytesseract.image_to_string(pil_image, config=config)
                    if text.strip():  # Only add non-empty text
                        all_texts.append(text)
                except Exception as e:
                    logger.warning(f"OCR config failed: {config}, Error: {str(e)}")
                    continue
        
        return all_texts

class FuzzyParameterExtractor:
    """Enhanced parameter extraction with fuzzy matching and context awareness"""
    
    def __init__(self):
        self.medical_patterns = MEDICAL_PATTERNS
    
    def preprocess_text(self, text: str) -> str:
        """Clean and preprocess text for better matching"""
        # Fix common OCR errors
        replacements = {
            '0': ['O', 'o', '°'],
            '1': ['I', 'l', '|'],
            '5': ['S', 's'],
            '6': ['G', 'g'],
            '8': ['B'],
            '.': [','],
            ':': [';'],
            '-': ['—', '–', '_'],
            '%': ['X', 'x'],
            ' ': ['  ', '\t']
        }
        
        processed_text = text
        for correct, wrong_list in replacements.items():
            for wrong in wrong_list:
                processed_text = processed_text.replace(wrong, correct)
        
        return processed_text
    
    def extract_value_near_parameter(self, text: str, param_name: str) -> Optional[float]:
        """Extract value near a parameter name using context"""
        lines = text.split('\n')
        
        for i, line in enumerate(lines):
            # Check if parameter name is in current line
            if any(fuzzy_name.lower() in line.lower() for fuzzy_name in self.medical_patterns[param_name]["fuzzy_names"]):
                # Look for value in current line and next few lines
                search_lines = lines[i:i+3]  # Current and next 2 lines
                
                for search_line in search_lines:
                    # Find numbers in the line
                    numbers = re.findall(r'\d+\.?\d*', search_line)
                    for num_str in numbers:
                        try:
                            value = float(num_str)
                            # Basic range validation to avoid extracting irrelevant numbers
                            if self.is_reasonable_value(param_name, value):
                                return value
                        except ValueError:
                            continue
        
        return None
    
    def is_reasonable_value(self, param_name: str, value: float) -> bool:
        """Check if extracted value is within reasonable medical range"""
        reasonable_ranges = {
            "Hemoglobin": (5.0, 25.0),
            "RBC": (1.0, 10.0),
            "WBC": (1000, 50000),
            "Platelets": (0.5, 10.0),
            "PCV": (15.0, 70.0),
            "MCV": (50.0, 150.0),
            "MCH": (15.0, 50.0),
            "MCHC": (25.0, 45.0),
            "RDW-CV": (8.0, 25.0),
            "Polymorphs": (10.0, 95.0),
            "Lymphocytes": (5.0, 70.0),
            "Monocytes": (0.0, 20.0),
            "Eosinophils": (0.0, 15.0),
            "Basophils": (0.0, 5.0)
        }
        
        if param_name in reasonable_ranges:
            min_val, max_val = reasonable_ranges[param_name]
            return min_val <= value <= max_val
        
        return True  # If no range defined, accept value
    
    def extract_parameters_fuzzy(self, texts: List[str]) -> Dict:
        """Extract parameters using fuzzy matching across multiple text extractions"""
        parameters = {}
        categories = {}
        confidence_scores = {}
        
        for param_name, config in self.medical_patterns.items():
            best_value = None
            best_confidence = 0
            
            # Try each text extraction
            for text in texts:
                processed_text = self.preprocess_text(text)
                
                # Method 1: Try regex patterns
                for pattern in config["patterns"]:
                    try:
                        matches = re.finditer(pattern, processed_text, re.IGNORECASE)
                        for match in matches:
                            if match.group(1):
                                try:
                                    value = float(match.group(1))
                                    if self.is_reasonable_value(param_name, value):
                                        confidence = 0.9  # High confidence for regex match
                                        if confidence > best_confidence:
                                            best_value = value
                                            best_confidence = confidence
                                except ValueError:
                                    continue
                    except Exception as e:
                        logger.warning(f"Regex pattern failed for {param_name}: {str(e)}")
                        continue
                
                # Method 2: Context-based extraction
                if best_confidence < 0.8:  # Only if regex didn't find good match
                    context_value = self.extract_value_near_parameter(processed_text, param_name)
                    if context_value is not None:
                        confidence = 0.7  # Medium confidence for context match
                        if confidence > best_confidence:
                            best_value = context_value
                            best_confidence = confidence
            
            # If we found a value with reasonable confidence
            if best_value is not None and best_confidence > 0.5:
                status = self.determine_status(best_value, config["normal_range"])
                interpretation = self.get_health_interpretation(param_name, best_value, status)
                
                param_data = {
                    "value": best_value,
                    "unit": config["unit"],
                    "normal_range": config["normal_range"],
                    "status": status,
                    "interpretation": interpretation,
                    "category": config["category"],
                    "confidence": round(best_confidence, 2)
                }
                
                parameters[param_name] = param_data
                confidence_scores[param_name] = best_confidence
                
                # Group by category
                category = config["category"]
                if category not in categories:
                    categories[category] = {}
                categories[category][param_name] = param_data
        
        return parameters, categories, confidence_scores
    
    def determine_status(self, value: float, normal_range: str) -> str:
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
    
    def get_health_interpretation(self, parameter: str, value: float, status: str) -> str:
        """Provide enhanced health interpretation"""
        interpretations = {
            "Hemoglobin": {
                "Low": "May indicate anemia, blood loss, or nutritional deficiency",
                "High": "May indicate dehydration, lung disease, or living at high altitude",
                "Normal": "Healthy oxygen-carrying capacity"
            },
            "RBC": {
                "Low": "May indicate anemia, blood loss, or bone marrow problems",
                "High": "May indicate dehydration, lung disease, or kidney problems",
                "Normal": "Healthy red blood cell count"
            },
            "WBC": {
                "Low": "May indicate weakened immune system or bone marrow problems",
                "High": "May indicate infection, inflammation, or blood disorders",
                "Normal": "Healthy immune system function"
            },
            "Platelets": {
                "Low": "May indicate bleeding disorders or bone marrow problems",
                "High": "May indicate blood clotting issues or inflammatory conditions",
                "Normal": "Healthy blood clotting ability"
            },
            "PCV": {
                "Low": "May indicate anemia or blood loss",
                "High": "May indicate dehydration or lung disease",
                "Normal": "Healthy blood volume percentage"
            },
            "MCV": {
                "Low": "May indicate iron deficiency or thalassemia",
                "High": "May indicate vitamin B12 or folate deficiency",
                "Normal": "Healthy red blood cell size"
            },
            "MCH": {
                "Low": "May indicate iron deficiency anemia",
                "High": "May indicate vitamin B12 or folate deficiency",
                "Normal": "Healthy hemoglobin content per cell"
            },
            "MCHC": {
                "Low": "May indicate iron deficiency or thalassemia",
                "High": "May indicate spherocytosis or dehydration",
                "Normal": "Healthy hemoglobin concentration"
            },
            "RDW-CV": {
                "Low": "Uniform red blood cell size",
                "High": "May indicate mixed anemia types or nutritional deficiencies",
                "Normal": "Healthy red blood cell size variation"
            }
        }
        
        default_interpretation = {
            "Low": f"Below normal range - consult your doctor",
            "High": f"Above normal range - consult your doctor", 
            "Normal": f"Within normal range"
        }
        
        return interpretations.get(parameter, default_interpretation).get(status, "Consult your doctor for interpretation")

@app.post("/analyze-report")
async def analyze_report(file: UploadFile = File(...)):
    try:
        logger.info(f"Processing file: {file.filename}")
        
        if not file:
            raise HTTPException(status_code=400, detail="No file uploaded")

        if not file.content_type or not file.content_type.startswith('image/'):
            logger.warning(f"Invalid content type: {file.content_type}")
            raise HTTPException(status_code=400, detail="Only image files are supported")

        contents = await file.read()
        if not contents:
            raise HTTPException(status_code=400, detail="Empty file")

        logger.info(f"File size: {len(contents)} bytes")

        # Decode image
        try:
            nparr = np.frombuffer(contents, np.uint8)
            img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            
            if img is None:
                raise HTTPException(status_code=400, detail="Could not decode image")
            
            logger.info(f"Image shape: {img.shape}")
            
        except Exception as e:
            logger.error(f"Image decoding error: {str(e)}")
            raise HTTPException(status_code=400, detail=f"Image processing failed: {str(e)}")
        
        # Enhanced preprocessing
        try:
            preprocessor = EnhancedImagePreprocessor()
            processed_images = preprocessor.enhance_image(img)
            
            # Apply skew correction to best image
            if processed_images:
                processed_images[0] = preprocessor.correct_skew(processed_images[0])
            
            logger.info(f"Generated {len(processed_images)} processed images")
            
        except Exception as e:
            logger.error(f"Image preprocessing error: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Image preprocessing failed: {str(e)}")
        
        # Enhanced text extraction
        try:
            text_extractor = EnhancedTextExtractor()
            extracted_texts = text_extractor.extract_text_multiple_configs(processed_images)
            
            logger.info(f"Extracted {len(extracted_texts)} text variations")
            
            if not extracted_texts:
                raise HTTPException(status_code=500, detail="No text could be extracted from image")
            
        except Exception as e:
            logger.error(f"OCR error: {str(e)}")
            raise HTTPException(status_code=500, detail=f"OCR processing failed: {str(e)}")
        
        # Enhanced parameter extraction
        try:
            extractor = FuzzyParameterExtractor()
            parameters, categories, confidence_scores = extractor.extract_parameters_fuzzy(extracted_texts)
            
            logger.info(f"Extracted parameters: {list(parameters.keys())}")
            logger.info(f"Confidence scores: {confidence_scores}")
            
        except Exception as e:
            logger.error(f"Parameter extraction error: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Parameter extraction failed: {str(e)}")

        # Generate enhanced summary
        total_params = len(parameters)
        abnormal_params = len([p for p in parameters.values() if p["status"] != "Normal"])
        avg_confidence = sum(confidence_scores.values()) / len(confidence_scores) if confidence_scores else 0
        
        summary = {
            "total_parameters": total_params,
            "abnormal_parameters": abnormal_params,
            "overall_status": "Normal" if abnormal_params == 0 else f"{abnormal_params} parameter(s) abnormal",
            "report_type": "Complete Blood Count (CBC)" if any("Blood Counts" in p.get("category", "") for p in parameters.values()) else "Medical Report",
            "average_confidence": round(avg_confidence, 2),
            "extraction_quality": "High" if avg_confidence > 0.8 else "Medium" if avg_confidence > 0.6 else "Low"
        }

        return {
            "status": "success",
            "summary": summary,
            "parameters": parameters,
            "categories": categories,
            "confidence_scores": confidence_scores,
            "filename": file.filename,
            "processing_info": {
                "images_processed": len(processed_images),
                "text_extractions": len(extracted_texts),
                "total_patterns_tried": sum(len(config["patterns"]) for config in MEDICAL_PATTERNS.values())
            }
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@app.get("/")
async def root():
    return {"message": "Enhanced Medical Report Analyzer API v2.0"}

@app.get("/health")
async def health_check():
    try:
        version = pytesseract.get_tesseract_version()
        logger.info(f"Tesseract version: {version}")
        return {
            "status": "healthy", 
            "tesseract_version": str(version),
            "features": ["Enhanced OCR", "Fuzzy Matching", "Multi-pass Processing", "Confidence Scoring"]
        }
    except Exception as e:
        logger.error(f"Tesseract health check failed: {str(e)}")
        return {"status": "unhealthy", "error": str(e)}