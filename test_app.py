import pytest
from flask import Flask
from flask.testing import FlaskClient
from app import app, extract_text_from_pdf, extract_text_from_docx, anonymize_text_presidio, anonymize_text_transformer

@pytest.fixture
def client():
    """Fixture to set up the Flask test client."""
    app.testing = True
    with app.test_client() as client:
        yield client

def test_home_redirect(client: FlaskClient):
    """Test the home route redirects to Swagger UI."""
    response = client.get('/')
    assert response.status_code == 302
    assert response.headers['Location'] == '/api-docs'

def test_anonymize_no_file(client: FlaskClient):
    """Test the /anonymize route with no file provided."""
    response = client.post('/anonymize')
    assert response.status_code == 400
    assert response.json == {"error": "No file provided"}

def test_anonymize_invalid_file(client: FlaskClient):
    """Test the /anonymize route with an invalid file."""
    data = {'file': (io.BytesIO(b''), '')}
    response = client.post('/anonymize', data=data, content_type='multipart/form-data')
    assert response.status_code == 400
    assert response.json == {"error": "No file selected"}

def test_anonymize_unsupported_file_type(client: FlaskClient):
    """Test the /anonymize route with an unsupported file type."""
    data = {'file': (io.BytesIO(b'Test content'), 'test.txt')}
    response = client.post('/anonymize', data=data, content_type='multipart/form-data')
    assert response.status_code == 400
    assert response.json == {"error": "Unsupported file type"}

def test_extract_text_from_pdf(mocker):
    """Test the extract_text_from_pdf function."""
    mock_pdf = mocker.patch('fitz.open')
    mock_pdf.return_value.__enter__.return_value = [mocker.Mock(get_text=lambda: "Page 1 text")]
    text = extract_text_from_pdf("dummy.pdf")
    assert text == "Page 1 text"

def test_extract_text_from_docx(mocker):
    """Test the extract_text_from_docx function."""
    mock_doc = mocker.patch('docx.Document')
    mock_doc.return_value.paragraphs = [mocker.Mock(text="Paragraph 1"), mocker.Mock(text="Paragraph 2")]
    text = extract_text_from_docx("dummy.docx")
    assert text == "Paragraph 1\\\\nParagraph 2"

def test_anonymize_text_presidio(mocker):
    """Test the anonymize_text_presidio function."""
    mock_analyzer = mocker.patch('app.analyzer.analyze')
    mock_anonymizer = mocker.patch('app.anonymizer.anonymize')
    mock_analyzer.return_value = [{"entity_type": "PERSON", "start": 0, "end": 4}]
    mock_anonymizer.return_value.text = "****"
    anonymized_text = anonymize_text_presidio("John")
    assert anonymized_text == "****"

def test_anonymize_text_transformer(mocker):
    """Test the anonymize_text_transformer function."""
    mock_transformer = mocker.patch('app.transformer_anonymizer')
    mock_transformer.return_value = [{"generated_text": "Anonymized text"}]
    anonymized_text = anonymize_text_transformer("Sensitive information")
    assert anonymized_text == "Anonymized text"

def test_anonymize_pdf_presidio(mocker):
    """Test the anonymize_pdf_presidio function."""
    mock_fitz_open = mocker.patch('fitz.open')
    mock_anonymize_text_presidio = mocker.patch('app.anonymize_text_presidio')
    mock_anonymize_text_presidio.return_value = "Anonymized text"
    mock_pdf = mock_fitz_open.return_value.__enter__.return_value
    mock_pdf.pages = [mocker.Mock(get_text=lambda: "Page text", rect=mocker.Mock(width=100, height=100))]
    mock_doc = mocker.Mock()
    mock_fitz_open.return_value.__enter__.return_value = mock_doc
    anonymize_pdf_presidio("input.pdf", "output.pdf")
    mock_doc.save.assert_called_once_with("output.pdf")

def test_anonymize_docx_presidio(mocker):
    """Test the anonymize_docx_presidio function."""
    mock_doc = mocker.patch('docx.Document')
    mock_anonymize_text_presidio = mocker.patch('app.anonymize_text_presidio')
    mock_anonymize_text_presidio.return_value = "Anonymized text"
    mock_doc.return_value.paragraphs = [mocker.Mock(text="Sensitive text")]
    anonymize_docx_presidio("input.docx", "output.docx")
    mock_doc.return_value.save.assert_called_once_with("output.docx")
