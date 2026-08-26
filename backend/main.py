from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import pytesseract
from PIL import Image
from deep_translator import GoogleTranslator
import io

app = FastAPI()

# Allow the React website to communicate with the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Tesseract location
pytesseract.pytesseract.tesseract_cmd = (
    r"C:\Program Files\Tesseract-OCR\tesseract.exe"
)


@app.get("/")
def home():
    return {
        "message": "English → Hindi Translator Backend is running!"
    }


@app.post("/ocr")
async def read_page(file: UploadFile = File(...)):
    # Read uploaded image
    contents = await file.read()

    # Open image
    image = Image.open(io.BytesIO(contents))

    # Extract English text
    english_text = pytesseract.image_to_string(
        image,
        lang="eng"
    )

    # Translate English → Hindi
    if english_text.strip():
        hindi_text = GoogleTranslator(
            source="en",
            target="hi"
        ).translate(english_text)
    else:
        hindi_text = "No text was detected."

    return {
        "filename": file.filename,
        "english_text": english_text,
        "hindi_text": hindi_text
    }
