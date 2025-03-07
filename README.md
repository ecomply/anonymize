# Ecomply Anonymize Application

Ecomply Anonymize is a multi-user, multi-tenant application designed to anonymize sensitive information in PDF and Word documents while preserving their structure and formatting. The application includes a Python backend for processing files, a Node.js server for proxying requests, and an Angular frontend for user interaction.

---

## Features

- **Anonymization**: Automatically detects and anonymizes sensitive information in PDF and Word documents.
- **Multi-User Support**: Designed to handle multiple users simultaneously.
- **Multi-Tenant Architecture**: Supports isolated environments for different tenants.
- **Frontend**: User-friendly Angular-based interface for uploading files or providing URLs.
- **Backend**: Python Flask API for processing files and Node.js server for proxying requests.
- **Downloadable Results**: Anonymized files can be downloaded directly.

---

## Prerequisites

Ensure you have the following installed on your system:

1. **Node.js** (v16 or higher)
2. **Python** (v3.8 or higher)
3. **pip** (Python package manager)
4. **Angular CLI** (for frontend development)
5. **Git** (for cloning the repository)

---

## Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/ecomply/anonymize.git
cd anonymize
```

### Step 2: Install Backend Dependencies

Navigate to the root directory and install Python dependencies:

```bash
pip install -r requirements.txt
```

### Step 3: Install Frontend Dependencies

Navigate to the `src` directory and install Node.js dependencies:

```bash
npm install
```

---

## Running the Application

### Step 1: Start the Python Backend

Run the Python Flask API:

```bash
python3 app.py
```

The backend will start on `http://localhost:5000`.

### Step 2: Start the Node.js Server

Run the Node.js server to serve the frontend and proxy requests:

```bash
npm run dev
```

The server will start on `http://localhost:3000`.

### Step 3: Access the Application

Open your browser and navigate to:

```
http://localhost:3000
```

---

## Usage

1. **Upload a File**: Use the file input to upload a PDF or Word document.
2. **Enter a URL**: Alternatively, provide a URL to a webpage for anonymization.
3. **Anonymize**: Click the "Anonymize Document" button to process the file or URL.
4. **Download Results**: Once processing is complete, download the anonymized file.

---

## Testing

### Backend Tests

To test the Python backend, use the following command:

```bash
pytest
```

Ensure all tests pass successfully.

### Frontend Tests

To test the Angular frontend, use the following command:

```bash
npm run test
```

---

## Multi-Tenant and Multi-User Considerations

- **Multi-Tenant**: Each tenant's data is isolated using unique identifiers. Ensure tenant-specific configurations are applied in the backend.
- **Multi-User**: The application supports concurrent user sessions. Temporary files are managed using unique names to avoid conflicts.

---

## File Structure

- **`app.py`**: Python Flask API for file processing.
- **`server.js`**: Node.js server for proxying requests and serving the frontend.
- **`public/`**: Static files for the frontend (HTML, CSS, JS).
- **`src/`**: Angular frontend source code.
- **`requirements.txt`**: Python dependencies.
- **`package.json`**: Node.js dependencies and scripts.

---

## Troubleshooting

### Common Issues

1. **Port Conflicts**: Ensure ports `3000` (Node.js) and `5000` (Python) are not in use.
2. **Dependency Errors**: Verify all dependencies are installed correctly using `pip list` and `npm list`.

### Logs

- **Python Backend Logs**: Check the terminal output where `app.py` is running.
- **Node.js Server Logs**: Check the terminal output where `server.js` is running.

---

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Submit a pull request with a detailed description.

---

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

---

## Contact

For support or inquiries, please contact:

- **Email**: support@ecomply.com
- **Website**: [Ecomply](https://www.ecomply.com)
