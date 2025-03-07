document.addEventListener('DOMContentLoaded', () => {
  const uploadForm = document.getElementById('uploadForm');
  const fileInput = document.getElementById('fileInput');
  const urlInput = document.getElementById('urlInput');
  const analyzeButton = document.getElementById('analyzeButton');
  const anonymizeButton = document.getElementById('anonymizeButton');
  const resultContainer = document.getElementById('resultContainer');
  const resultMessage = document.getElementById('resultMessage');
  const downloadLink = document.getElementById('downloadLink');

  // Helper function to reset the result container
  const resetResultContainer = () => {
    resultContainer.style.display = 'none';
    resultMessage.textContent = '';
    downloadLink.style.display = 'none';
    downloadLink.href = '#';
  };

  // Handle form submission for analysis
  uploadForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    resetResultContainer();

    const formData = new FormData();

    if (fileInput.files.length > 0) {
      formData.append('file', fileInput.files[0]);
    }

    const url = urlInput.value.trim();
    if (url) {
      formData.append('url', url);
    }

    if (!formData.has('file') && !formData.has('url')) {
      alert('Please upload a file or enter a URL.');
      return;
    }

    try {
      analyzeButton.disabled = true;
      analyzeButton.textContent = 'Analyzing...';

      const response = await fetch('/answer', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'An error occurred during analysis.');
      }

      const result = await response.json();
      resultMessage.textContent = `Analysis Result: ${result.answer}`;
      resultContainer.style.display = 'block';
    } catch (error) {
      resultMessage.textContent = `Error: ${error.message}`;
      resultContainer.style.display = 'block';
    } finally {
      analyzeButton.disabled = false;
      analyzeButton.textContent = 'Analyze';
    }
  });

  // Handle anonymization
  anonymizeButton.addEventListener('click', async () => {
    resetResultContainer();

    const formData = new FormData();

    if (fileInput.files.length > 0) {
      formData.append('file', fileInput.files[0]);
    }

    const url = urlInput.value.trim();
    if (url) {
      formData.append('url', url);
    }

    if (!formData.has('file') && !formData.has('url')) {
      alert('Please upload a file or enter a URL.');
      return;
    }

    try {
      anonymizeButton.disabled = true;
      anonymizeButton.textContent = 'Anonymizing...';

      const response = await fetch('/anonymize', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'An error occurred during anonymization.');
      }

      const blob = await response.blob();
      const fileURL = URL.createObjectURL(blob);

      resultMessage.textContent = 'File anonymized successfully!';
      downloadLink.href = fileURL;
      downloadLink.download = 'anonymized_file';
      downloadLink.style.display = 'inline-block';
      resultContainer.style.display = 'block';
    } catch (error) {
      resultMessage.textContent = `Error: ${error.message}`;
      resultContainer.style.display = 'block';
    } finally {
      anonymizeButton.disabled = false;
      anonymizeButton.textContent = 'Anonymize';
    }
  });
});
