import unittest
from app import app
from flask import json

class TestApp(unittest.TestCase):

    def setUp(self):
        """Set up the test client."""
        self.app = app.test_client()
        self.app.testing = True

    def test_answer_with_pdf(self):
        """Test the /answer endpoint with a PDF file."""
        with open('test_files/sample.pdf', 'rb') as pdf_file:
            response = self.app.post('/answer', data={'file': (pdf_file, 'sample.pdf')})
        
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertIn('question', data)
        self.assertIn('answer', data)
        self.assertIn('score', data)
        self.assertIn('context', data)

    def test_answer_with_docx(self):
        """Test the /answer endpoint with a DOCX file."""
        with open('test_files/sample.docx', 'rb') as docx_file:
            response = self.app.post('/answer', data={'file': (docx_file, 'sample.docx')})
        
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertIn('question', data)
        self.assertIn('answer', data)
        self.assertIn('score', data)
        self.assertIn('context', data)

    def test_answer_with_no_file(self):
        """Test the /answer endpoint with no file."""
        response = self.app.post('/answer')
        self.assertEqual(response.status_code, 400)
        data = json.loads(response.data)
        self.assertIn('error', data)
        self.assertEqual(data['error'], 'No file provided')

    def test_anonymize_with_pdf(self):
        """Test the /anonymize endpoint with a PDF file."""
        with open('test_files/sample.pdf', 'rb') as pdf_file:
            response = self.app.post('/anonymize', data={'file': (pdf_file, 'sample.pdf')})
        
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.content_type, 'application/pdf')

    def test_anonymize_with_docx(self):
        """Test the /anonymize endpoint with a DOCX file."""
        with open('test_files/sample.docx', 'rb') as docx_file:
            response = self.app.post('/anonymize', data={'file': (docx_file, 'sample.docx')})
        
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.content_type, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')

    def test_anonymize_with_no_file(self):
        """Test the /anonymize endpoint with no file."""
        response = self.app.post('/anonymize')
        self.assertEqual(response.status_code, 400)
        data = json.loads(response.data)
        self.assertIn('error', data)
        self.assertEqual(data['error'], 'No file provided')

    def test_anonymize_with_unsupported_file_type(self):
        """Test the /anonymize endpoint with an unsupported file type."""
        with open('test_files/sample.txt', 'rb') as txt_file:
            response = self.app.post('/anonymize', data={'file': (txt_file, 'sample.txt')})
        
        self.assertEqual(response.status_code, 400)
        data = json.loads(response.data)
        self.assertIn('error', data)
        self.assertEqual(data['error'], 'Unsupported file type')

if __name__ == '__main__':
    unittest.main()
