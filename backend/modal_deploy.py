import modal
from main import app

image = modal.Image.debian_slim().pip_install("fastapi", 
    "pytesseract", 
    "pillow", 
    "opencv-python",
    "google-cloud-vision")

app = modal.App("sahyog-api")  # Updated syntax

@app.function(image=image)
@app.asgi_app()
def fastapi_app():
    return app