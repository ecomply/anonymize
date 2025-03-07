const express = require('express');
const httpProxy = require('http-proxy');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const apiProxy = httpProxy.createProxyServer();

// Configuration
const PORT = process.env.PORT || 3000; // Port for the Node.js server
const PYTHON_API_URL = process.env.PYTHON_API_URL || 'http://localhost:5000'; // URL of the Python Flask API

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve the Angular frontend
app.use(express.static(path.join(__dirname, 'public')));

// Proxy requests to the Python API
app.use('/api/:tenantId/anonymize', (req, res) => {
  const tenantId = req.params.tenantId;
  req.headers['X-Tenant-ID'] = tenantId; // Add tenant ID to headers for multi-tenancy
  apiProxy.web(req, res, { target: PYTHON_API_URL });
});

// Catch-all route to serve the Angular app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling for the proxy
apiProxy.on('error', (err, req, res) => {
  console.error('Proxy error:', err);
  res.status(500).send('An error occurred while processing your request.');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Node.js server is running on http://localhost:${PORT}`);
  console.log(`Proxying API requests to ${PYTHON_API_URL}`);
});