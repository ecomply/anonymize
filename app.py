from flask import Flask, request, jsonify, send_file
import fitz  # PyMuPDF
import docx
import requests
from bs4 import BeautifulSoup
from transformers import pipeline
from huggingface_hub import hf_hub_download
import fasttext
import os
import tempfile

app = Flask(__name__)

# Initialize the Hugging Face pipelines
qa_pipeline = pipeline("question-answering")
anonymization_pipeline = pipeline("text2text-generation", model=hf_hub_download(repo_id="ai4privacy/llama-ai4privacy-multilingual-anonymiser-openpii", filename="pytorch_model.bin"))
language_model = fasttext.load_model("lid.176.bin")

def extract_text_from_pdf(file_path):
    """Extract text from a PDF file."""
    text = ""
    with fitz.open(file_path) as pdf:
        for page in pdf:
            text += page.get_text()
    return text

def extract_text_from_docx(file_path):
    """Extract text from a DOCX file."""
    doc = docx.Document(file_path)
    return "\\\\\\\n".join([paragraph.text for paragraph in doc.paragraphs])

def extract_text_from_url(url):
    """Extract text from a webpage given its URL."""
    response = requests.get(url)
    response.raise_for_status()
    soup = BeautifulSoup(response.text, 'html.parser')
    return soup.get_text()

@app.route('/answer', methods=['POST'])
def answer():
    """Handle file or URL input and return extracted answers."""
    if 'file' not in request.files and 'url' not in request.form:
        return jsonify({"error": "No file or URL provided"}), 400

    text = ""
    try:
        # Handle file upload
        if 'file' in request.files:
            uploaded_file = request.files['file']
            if uploaded_file.filename == '':
                return jsonify({"error": "No file selected"}), 400

            file_extension = os.path.splitext(uploaded_file.filename)[1].lower()
            file_path = os.path.join("/tmp", uploaded_file.filename)
            uploaded_file.save(file_path)

            if file_extension == '.pdf':
                text = extract_text_from_pdf(file_path)
            elif file_extension == '.docx':
                text = extract_text_from_docx(file_path)
            else:
                return jsonify({"error": "Unsupported file type"}), 400

            os.remove(file_path)

        # Handle URL input
        elif 'url' in request.form:
            url = request.form['url']
            text = extract_text_from_url(url)

        if not text.strip():
            return jsonify({"error": "No text could be extracted"}), 400

        # Perform question answering
        question = "What is the document about?"
        qa_result = qa_pipeline(question=question, context=text)

        return jsonify({
            "question": question,
            "answer": qa_result.get("answer", ""),
            "score": qa_result.get("score", 0),
            "context": text[:500]  # Include a snippet of the context for reference
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/anonymize', methods=['POST'])
def anonymize():
    """Handle file or URL input and return anonymized text."""
    if 'file' not in request.files and 'url' not in request.form:
        return jsonify({"error": "No file or URL provided"}), 400

    text = ""
    try:
        # Handle file upload
        if 'file' in request.files:
            uploaded_file = request.files['file']
            if uploaded_file.filename == '':
                return jsonify({"error": "No file selected"}), 400

            file_extension = os.path.splitext(uploaded_file.filename)[1].lower()
            file_path = os.path.join(tempfile.gettempdir(), uploaded_file.filename)
            uploaded_file.save(file_path)

            if file_extension == '.pdf':
                text = extract_text_from_pdf(file_path)
            elif file_extension == '.docx':
                text = extract_text_from_docx(file_path)
            else:
                return jsonify({"error": "Unsupported file type"}), 400

        # Handle URL input
        elif 'url' in request.form:
            url = request.form['url']
            text = extract_text_from_url(url)

        if not text.strip():
            return jsonify({"error": "No text could be extracted"}), 400

        # Perform anonymization
        anonymized_text = anonymization_pipeline(text, max_length=1024, truncation=True)[0]['generated_text']

        # Save anonymized text to a file for download
        anonymized_file_path = os.path.join(tempfile.gettempdir(), "anonymized_output.docx")
        doc = docx.Document()
        for paragraph in anonymized_text.split("\\\n"):
            doc.add_paragraph(paragraph)
        doc.save(anonymized_file_path)

        return send_file(anonymized_file_path, as_attachment=True, download_name="anonymized_output.docx")

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)