import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UploadComponent } from './upload.component';
import { ApiService } from '../api.service';
import { of, throwError } from 'rxjs';

describe('UploadComponent', () => {
  let component: UploadComponent;
  let fixture: ComponentFixture<UploadComponent>;
  let apiService: ApiService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, HttpClientTestingModule],
      declarations: [UploadComponent],
      providers: [ApiService]
    }).compileComponents();

    fixture = TestBed.createComponent(UploadComponent);
    component = fixture.componentInstance;
    apiService = TestBed.inject(ApiService);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with default values', () => {
    expect(component.uploadForm.value).toEqual({ file: null });
  });

  it('should handle file input and update the form control', () => {
    const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
    const event = { target: { files: [file] } };

    component.handleFileInput(event as any);

    expect(component.fileToUpload).toBe(file);
    expect(component.uploadForm.get('file')?.value).toBe(file);
  });

  it('should submit the form and call the API service for file upload', () => {
    const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
    const formData = new FormData();
    formData.append('file', file);

    spyOn(apiService, 'uploadFile').and.returnValue(of({ data: 'Analysis result' }));
    component.fileToUpload = file;

    component.submitForm();

    expect(apiService.uploadFile).toHaveBeenCalledWith(formData);
    expect(component.analysisResult).toBe('Analysis result');
  });

  it('should handle errors during file upload', () => {
    const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
    const formData = new FormData();
    formData.append('file', file);

    spyOn(apiService, 'uploadFile').and.returnValue(throwError(() => new Error('Upload failed')));
    component.fileToUpload = file;

    component.submitForm();

    expect(apiService.uploadFile).toHaveBeenCalledWith(formData);
    expect(component.analysisResult).toBeNull();
  });

  it('should call the API service for document anonymization', () => {
    const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
    const formData = new FormData();
    formData.append('file', file);

    spyOn(apiService, 'anonymizeDocument').and.returnValue(of({ anonymized_text: 'Anonymized result' }));
    component.fileToUpload = file;

    component.anonymizeDocument();

    expect(apiService.anonymizeDocument).toHaveBeenCalledWith(formData);
    expect(component.anonymizationResult).toBe('Anonymized result');
  });

  it('should handle errors during document anonymization', () => {
    const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
    const formData = new FormData();
    formData.append('file', file);

    spyOn(apiService, 'anonymizeDocument').and.returnValue(throwError(() => new Error('Anonymization failed')));
    component.fileToUpload = file;

    component.anonymizeDocument();

    expect(apiService.anonymizeDocument).toHaveBeenCalledWith(formData);
    expect(component.anonymizationResult).toBeNull();
  });

  it('should download the anonymized file as text', () => {
    const anonymizedText = 'Anonymized content';
    component.anonymizationResult = anonymizedText;

    spyOn(document, 'createElement').and.callThrough();
    spyOn(window.URL, 'createObjectURL').and.callThrough();

    component.downloadAnonymizedFile();

    expect(document.createElement).toHaveBeenCalledWith('a');
    expect(window.URL.createObjectURL).toHaveBeenCalled();
  });

  it('should download the anonymized file from the backend', () => {
    const fileId = '12345';
    const fileName = 'anonymized_document.pdf';
    const mockBlob = new Blob(['anonymized content'], { type: 'application/pdf' });

    component.anonymizationResult = { fileId, fileName };

    spyOn(apiService, 'downloadAnonymizedFile').and.returnValue(of(mockBlob));
    spyOn(document, 'createElement').and.callThrough();
    spyOn(window.URL, 'createObjectURL').and.callThrough();

    component.downloadAnonymizedFile();

    expect(apiService.downloadAnonymizedFile).toHaveBeenCalledWith(fileId);
    expect(document.createElement).toHaveBeenCalledWith('a');
    expect(window.URL.createObjectURL).toHaveBeenCalled();
  });

  it('should handle missing anonymized file during download', () => {
    spyOn(console, 'error');

    component.anonymizationResult = null;
    component.downloadAnonymizedFile();

    expect(console.error).toHaveBeenCalledWith('No anonymized file available for download');
  });
});
