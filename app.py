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
anonymization_pipeline = pipeline("ner", model="llmai4privacy/llama-ai4privacy-multilingual-anonymiser-openpii")
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
    def extract_text_from_docx(file_path):
        """Extract text from a DOCX file."""
        doc = docx.Document(file_path)
        return "\\n".join([paragraph.text for paragraph in doc.paragraphs])

def anonymize_text(text):
    # Use the initialized anonymization_pipeline
    anonymized_text = anonymization_pipeline(text)[0]['generated_text']
    return anonymized_text

def anonymize_pdf(input_path, output_path):
    reader = PyPDF2.PdfFileReader(input_path)
    writer = PyPDF2.PdfFileWriter()

    for i in range(reader.getNumPages()):
        page = reader.getPage(i)
        page_content = page.extract_text()
        anonymized_content = anonymize_text(page_content)
        # Note: PyPDF2 does not support writing text back to pages directly
        # This is a simplified example, you may need to use a different library for full functionality
        writer.add_page(page)

    with open(output_path, 'wb') as output_file:
        writer.write(output_file)

def anonymize_docx(input_path, output_path):
    doc = Document(input_path)
    for para in doc.paragraphs:
        para.text = anonymize_text(para.text)
    doc.save(output_path)

@app.route('/answer', methods=['POST'])
def answer():
    """Handle file input and return extracted answers."""
    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400

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
    """Handle file input and return anonymized text."""
    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400

    text = ""
    try:
        # Handle file upload
        if 'file' in request.files:
            uploaded_file = request.files['file']
            if uploaded_file.filename == '':
                return jsonify({"error": "No file selected"}), 400
            
            file = request.files['file']
            file_type = file.filename.split('.')[-1]
            
            # Create temporary files with unique names
            with tempfile.NamedTemporaryFile(delete=False, suffix=f'.{file_type}') as input_temp:
                input_path = input_temp.name
                file.save(input_path)
            
            output_fd, output_path = tempfile.mkstemp(suffix=f'.{file_type}')
            os.close(output_fd)  # Close the file descriptor

        if file_type == 'pdf':
            import PyPDF2

            # Later in the code:
            anonymize_pdf(input_path, output_path)
        elif file_type == 'docx':
            from docx import Document

            # Later in the code:
            def anonymize_docx(input_path, output_path):
                doc = Document(input_path)
                for para in doc.paragraphs:
                    para.text = anonymize_text(para.text)
                doc.save(output_path)
        else:
            return jsonify({"error": "Unsupported file type"}), 400

        if not text.strip():
            return jsonify({"error": "No text could be extracted"}), 400

        return send_file(output_path, as_attachment=True)


    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)