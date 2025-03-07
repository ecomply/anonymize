import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UploadComponent } from './upload.component';

describe('UploadComponent', () => {
  let component: UploadComponent;
  let fixture: ComponentFixture<UploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UploadComponent],
      imports: [ReactiveFormsModule, HttpClientTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with default values', () => {
    expect(component.uploadForm).toBeDefined();
    expect(component.uploadForm.get('file')?.value).toBeNull();
    expect(component.uploadForm.get('description')?.value).toBe('');
  });

  it('should validate the form as invalid when required fields are missing', () => {
    component.uploadForm.get('file')?.setValue(null);
    component.uploadForm.get('description')?.setValue('');
    expect(component.uploadForm.valid).toBeFalse();
  });

  it('should validate the form as valid when required fields are filled', () => {
    const mockFile = new File(['test content'], 'test-file.txt', { type: 'text/plain' });
    component.uploadForm.get('file')?.setValue(mockFile);
    component.uploadForm.get('description')?.setValue('Test description');
    expect(component.uploadForm.valid).toBeTrue();
  });

  it('should call the uploadFile method when the form is submitted', () => {
    spyOn(component, 'uploadFile');
    const mockFile = new File(['test content'], 'test-file.txt', { type: 'text/plain' });
    component.uploadForm.get('file')?.setValue(mockFile);
    component.uploadForm.get('description')?.setValue('Test description');
    component.uploadForm.markAsDirty();
    component.uploadForm.markAsTouched();

    const formElement = fixture.nativeElement.querySelector('form');
    formElement.dispatchEvent(new Event('submit'));

    expect(component.uploadFile).toHaveBeenCalled();
  });

  it('should reset the form after a successful upload', () => {
    const mockFile = new File(['test content'], 'test-file.txt', { type: 'text/plain' });
    component.uploadForm.get('file')?.setValue(mockFile);
    component.uploadForm.get('description')?.setValue('Test description');

    component.uploadFile();

    expect(component.uploadForm.get('file')?.value).toBeNull();
    expect(component.uploadForm.get('description')?.value).toBe('');
  });

  it('should display an error message if the upload fails', () => {
    spyOn(component, 'uploadFile').and.callFake(() => {
      component.errorMessage = 'Upload failed. Please try again.';
    });

    component.uploadFile();

    fixture.detectChanges();
    const errorElement = fixture.nativeElement.querySelector('.error-message');
    expect(errorElement.textContent).toContain('Upload failed. Please try again.');
  });
});
