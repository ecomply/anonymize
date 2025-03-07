from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import os
import tempfile
from presidio_analyzer import AnalyzerEngine
from presidio_anonymizer import AnonymizerEngine
from docx import Document
import fitz  # PyMuPDF
from flasgger import Swagger

app = Flask(__name__)
CORS(app)
swagger = Swagger(app, template_file="/static/swagger.json")

# Initialize Presidio engines
analyzer = AnalyzerEngine()
anonymizer = AnonymizerEngine()

def extract_text_from_pdf(file_path):
    """Extract text from a PDF file."""
    text = ""
    with fitz.open(file_path) as pdf:
        for page in pdf:
            text += page.get_text()
    return text

def extract_text_from_docx(file_path):
    """Extract text from a DOCX file."""
    doc = Document(file_path)
    return "\\\\\\\\n".join([paragraph.text for paragraph in doc.paragraphs])

def anonymize_text(text):
    """Anonymize text using Presidio."""
    results = analyzer.analyze(text=text, entities=[], language="en")
    anonymized_text = anonymizer.anonymize(text=text, analyzer_results=results).text
    return anonymized_text

def anonymize_pdf(input_path, output_path):
    """Anonymize a PDF file."""
    with fitz.open(input_path) as pdf:
        doc = fitz.open()
        for page in pdf:
            text = page.get_text()
            anonymized_text = anonymize_text(text)
            new_page = doc.new_page(width=page.rect.width, height=page.rect.height)
            new_page.insert_text((72, 72), anonymized_text)
        doc.save(output_path)

def anonymize_docx(input_path, output_path):
    """Anonymize a DOCX file."""
    doc = Document(input_path)
    for para in doc.paragraphs:
        para.text = anonymize_text(para.text)
    doc.save(output_path)

@app.route('/anonymize', methods=['POST'])
def anonymize():
    """
    Handle file input and return anonymized file.
    ---
    tags:
      - Anonymization
    consumes:
      - multipart/form-data
    parameters:
      - name: file
        in: formData
        type: file
        required: true
        description: The file to be anonymized (PDF or DOCX).
    responses:
      200:
        description: Anonymized file successfully returned.
        schema:
          type: file
      400:
        description: Invalid input or unsupported file type.
      500:
        description: Internal server error.
    """
    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400

    uploaded_file = request.files['file']
    if uploaded_file.filename == '':
        return jsonify({"error": "No file selected"}), 400

    file_extension = os.path.splitext(uploaded_file.filename)[1].lower()
    input_temp = tempfile.NamedTemporaryFile(delete=False, suffix=file_extension)
    output_temp = tempfile.NamedTemporaryFile(delete=False, suffix=file_extension)
    input_path = input_temp.name
    output_path = output_temp.name

    try:
        uploaded_file.save(input_path)

        if file_extension == '.pdf':
            anonymize_pdf(input_path, output_path)
        elif file_extension == '.docx':
            anonymize_docx(input_path, output_path)
        else:
            return jsonify({"error": "Unsupported file type"}), 400

        return send_file(output_path, as_attachment=True)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    finally:
        os.remove(input_path)
        os.remove(output_path)



@app.route('/')
def redirect_to_swagger():
    """Redirect root URL to Swagger documentation."""
    return jsonify({"message": "Redirecting to Swagger documentation"}), 302, {'Location': '/api-docs'}

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)