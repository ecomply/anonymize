from fastapi import FastAPI, File, UploadFile
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from transformers import pipeline
import pdfplumber
import docx
from docx import Document
from PyPDF2 import PdfWriter, PdfReader
import os

app = FastAPI()

# Serve the static files (HTML, CSS, JS)
app.mount("/static", StaticFiles(directory="static"), name="static")

# Load the anonymizer model
anonymizer = pipeline("ner", model="ai4privacy/llama-ai4privacy-multilingual-anonymiser-openpii")

def anonymize_text(text):
    entities = anonymizer(text)
    for entity in entities:
        text = text.replace(entity['word'], "[ANONYMIZED]")
    return text

def anonymize_pdf(file):
    reader = PdfReader(file)
    writer = PdfWriter()
    
    for page in reader.pages:
        text = page.extract_text()
        anonymized_text = anonymize_text(text)
        
        # Create a new page with the anonymized text
        writer.add_page(page)
        writer.pages[-1].extract_text = lambda: anonymized_text
    
    output_path = "anonymized_output.pdf"
    with open(output_path, "wb") as output_file:
        writer.write(output_file)
    
    return output_path

def anonymize_docx(file):
    doc = Document(file)
    for paragraph in doc.paragraphs:
        for run in paragraph.runs:
            run.text = anonymize_text(run.text)
    
    output_path = "anonymized_output.docx"
    doc.save(output_path)
    
    return output_path

@app.post("/uploadfile/")
async def create_upload_file(file: UploadFile):
    if file.content_type == "application/pdf":
        output_path = anonymize_pdf(file.file)
    elif file.content_type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        output_path = anonymize_docx(file.file)
    else:
        return {"error": "Unsupported file type"}

    return {"anonymized_file": f"/static/{output_path}"}

@app.get("/")
async def read_index():
    return FileResponse('static/index.html')
