import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule]
})
export class UploadComponent {
  uploadForm: FormGroup;
  fileToUpload: File | null = null;
  analysisResult: string | null = null;
  anonymizationResult: string | { fileId: string; fileName?: string } | null = null;

  constructor(private fb: FormBuilder, private apiService: ApiService) {
    this.uploadForm = this.fb.group({
      file: [null],
    });
  }

  handleFileInput(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.fileToUpload = file;
      this.uploadForm.patchValue({ file });
    }
  }

  submitForm(): void {
    if (this.uploadForm.valid) {
      const formData = new FormData();

      if (this.fileToUpload) {
        formData.append('file', this.fileToUpload);
      }


      this.apiService.uploadFile(formData).subscribe(
        (response) => {
          this.analysisResult = response.data;
          console.log('Document Analysis Result:', response.data);
        },
        (error) => {
          console.error('Operation failed:', error);
        }
      );
    } else {
      console.error('Form is invalid');
    }
  }

  anonymizeDocument(): void {
    if (this.uploadForm.valid) {
      const formData = new FormData();

      if (this.fileToUpload) {
        formData.append('file', this.fileToUpload);
      }


      this.apiService.anonymizeDocument(formData).subscribe(
        (response) => {
          this.anonymizationResult = response.anonymized_text || { fileId: response.fileId, fileName: response.fileName };
          console.log('Document Anonymization Result:', this.anonymizationResult);
        },
        (error) => {
          console.error('Anonymization failed:', error);
        }
      );
    } else {
      console.error('Form is invalid');
    }
  }
  downloadAnonymizedFile(): void {
    if (this.anonymizationResult) {
      // For direct text download from the component
      if (typeof this.anonymizationResult === 'string') {
        const blob = new Blob([this.anonymizationResult], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'anonymized_output.txt';
        a.click();
        window.URL.revokeObjectURL(url);
      } 
      // For downloading the file processed by the backend
      else if (typeof this.anonymizationResult === 'object' && this.anonymizationResult.fileId) {
        this.apiService.downloadAnonymizedFile(this.anonymizationResult.fileId)
          .subscribe(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = this.anonymizationResult.fileName || 'anonymized_document';
            a.click();
            window.URL.revokeObjectURL(url);
          }, error => {
            console.error('Failed to download file:', error);
          });
      }
    } else {
      console.error('No anonymized file available for download');
    }
  }
}