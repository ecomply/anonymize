document.addEventListener('DOMContentLoaded', () => {
  const uploadForm = document.getElementById('uploadForm');
  const fileInput = document.getElementById('fileInput');
  const urlInput = document.getElementById('urlInput');
  const anonymizeButton = document.getElementById('anonymizeButton');
  const resultContainer = document.getElementById('result');
  const resultMessage = document.getElementById('resultMessage');
  const downloadLink = document.getElementById('downloadLink');

  uploadForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    resultContainer.style.display = 'none';
    resultMessage.textContent = '';
    downloadLink.style.display = 'none';

    const formData = new FormData();

    if (fileInput.files.length > 0) {
      formData.append('file', fileInput.files[0]);
    }

    const url = urlInput.value.trim();
    if (url) {
      formData.append('url', url);
    }

    if (!formData.has('file')) {
      alert('Please upload a file.');
      return;
    }

    try {
      anonymizeButton.disabled = true;
      anonymizeButton.textContent = 'Processing...';

      const response = await fetch('/anonymize', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'An error occurred while processing the file.');
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