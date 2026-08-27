from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pytesseract
from PIL import Image
from deep_translator import GoogleTranslator
import io

app = FastAPI()

# Allow the React frontend to communicate with the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://english-hindi-translator-frontend.onrender.com",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {
        "message": "English → Hindi Translator Backend is running!"
    }


@app.post("/ocr")
async def read_page(file: UploadFile = File(...)):
    try:
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

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"OCR/translation failed: {str(e)}"
        )
