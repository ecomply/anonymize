# Ecomply Anonymize Application

## Overview
The Ecomply Anonymize application is a multi-user, multi-tenant system designed to anonymize sensitive information in PDF and Word documents while preserving their structure and formatting. It also supports text extraction and anonymization from URLs. The application consists of a Python backend for document processing, a Node.js server for proxying requests, and an Angular frontend for user interaction.

## Features
- **Document Anonymization**: Automatically anonymizes sensitive information in PDF and Word documents.
- **URL Anonymization**: Extracts and anonymizes text from web pages.
- **Multi-language Support**: Detects and processes documents in multiple languages.
- **Frontend Integration**: User-friendly interface for uploading files or entering URLs.
- **Download Anonymized Files**: Allows users to download anonymized documents.

---

## Prerequisites
Before setting up the application, ensure you have the following installed:
- **Node.js** (v16 or higher)
- **Python** (v3.8 or higher)
- **Angular CLI** (v19 or higher)
- **pip** (Python package manager)

---

## Setup Instructions

### Step 1: Clone the Repository
```bash
git clone https://github.com/ecomply/anonymize.git
cd anonymize
```

### Step 2: Install Dependencies

#### Backend (Python)
Navigate to the root directory and install Python dependencies:
```bash
pip install -r requirements.txt
```

#### Frontend (Angular) and Proxy Server (Node.js)
Install Node.js dependencies:
```bash
npm install
```

---

## Running the Application

### Step 1: Start the Python Backend
Run the Python backend server:
```bash
python3 app.py
```
The backend will start on `http://localhost:5000`.

### Step 2: Start the Node.js Proxy Server
Run the Node.js server:
```bash
npm run dev
```
The proxy server will start on `http://localhost:3000`.

### Step 3: Start the Angular Frontend
The Angular frontend is served automatically by the Node.js server. Access the application at:
```
http://localhost:3000
```

---

## Usage

### Upload a File
1. Open the application in your browser.
2. Use the "Upload File" option to select a PDF or Word document.
3. Click "Analyze Document" or "Anonymize Document" to process the file.

### Enter a URL
1. Enter a valid URL in the "Enter URL" field.
2. Click "Analyze Document" or "Anonymize Document" to process the webpage.

### Download Anonymized File
After anonymization, click the "Download Anonymized File" button to save the processed document.

---

## Testing

### Backend Tests
Run Python tests to verify backend functionality:
```bash
pytest
```

### Frontend Tests
Run Angular tests:
```bash
npm run test
```

---

## Multi-Tenant and Multi-User Support
The application is designed to support multiple users and tenants:
- **User Isolation**: Each user's data is processed and stored separately.
- **Tenant Configuration**: Extend the backend to include tenant-specific configurations for anonymization rules.

---

## Documentation
Detailed documentation for the application is available in the `docs/` directory. It includes API specifications, architecture diagrams, and developer guides.

---

## Contributing
We welcome contributions! Please follow these steps:
1. Fork the repository.
2. Create a feature branch.
3. Submit a pull request.

---

## License
This project is licensed under the MIT License. See the `LICENSE` file for details.

---

## Support
For issues or questions, please contact the development team at `support@ecomply.com`.
