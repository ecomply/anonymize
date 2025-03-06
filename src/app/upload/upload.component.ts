import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule]
})
export class UploadComponent {
  uploadForm: FormGroup;
  fileToUpload: File | null = null;
  analysisResult: string | null = null;
  anonymizationResult: string | null = null;

  constructor(private fb: FormBuilder, private apiService: ApiService) {
    this.uploadForm = this.fb.group({
      file: [null],
      url: ['', Validators.pattern('https?://.+')]
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

      const url = this.uploadForm.get('url')?.value;
      if (url) {
        formData.append('url', url);
      }

      this.apiService.uploadFileOrUrl(formData).subscribe(
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

      const url = this.uploadForm.get('url')?.value;
      if (url) {
        formData.append('url', url);
      }

      this.apiService.anonymizeDocument(formData).subscribe(
        (response) => {
          this.anonymizationResult = response.anonymized_text;
          console.log('Document Anonymization Result:', response.anonymized_text);
        },
        (error) => {
          console.error('Anonymization failed:', error);
        }
      );
    } else {
      console.error('Form is invalid');
    }
  }
}