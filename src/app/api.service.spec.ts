import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiService } from './api.service';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService]
    });
    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('uploadFile', () => {
    it('should send a POST request to upload a file and return the response', () => {
      const mockResponse = { data: 'File uploaded and analyzed successfully' };
      const formData = new FormData();
      formData.append('file', new Blob(['test content'], { type: 'text/plain' }), 'test.txt');

      service.uploadFile(formData).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne('/answer');
      expect(req.request.method).toBe('POST');
      req.flush(mockResponse);
    });

    it('should handle errors when uploading a file', () => {
      const errorMessage = 'File upload failed';
      const formData = new FormData();
      formData.append('file', new Blob(['test content'], { type: 'text/plain' }), 'test.txt');

      service.uploadFile(formData).subscribe(
        () => fail('Expected an error, but got a response'),
        (error) => {
          expect(error.message).toContain(errorMessage);
        }
      );

      const req = httpMock.expectOne('/answer');
      req.flush({ message: errorMessage }, { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('anonymizeDocument', () => {
    it('should send a POST request to anonymize a document and return the response', () => {
      const mockResponse = { anonymized_text: 'Anonymized content' };
      const formData = new FormData();
      formData.append('file', new Blob(['test content'], { type: 'text/plain' }), 'test.txt');

      service.anonymizeDocument(formData).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne('/anonymize');
      expect(req.request.method).toBe('POST');
      req.flush(mockResponse);
    });

    it('should handle errors when anonymizing a document', () => {
      const errorMessage = 'Anonymization failed';
      const formData = new FormData();
      formData.append('file', new Blob(['test content'], { type: 'text/plain' }), 'test.txt');

      service.anonymizeDocument(formData).subscribe(
        () => fail('Expected an error, but got a response'),
        (error) => {
          expect(error.message).toContain(errorMessage);
        }
      );

      const req = httpMock.expectOne('/anonymize');
      req.flush({ message: errorMessage }, { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('downloadAnonymizedFile', () => {
    it('should send a GET request to download an anonymized file and return a Blob', () => {
      const mockBlob = new Blob(['anonymized content'], { type: 'application/pdf' });
      const fileId = '12345';

      service.downloadAnonymizedFile(fileId).subscribe((response) => {
        expect(response).toEqual(mockBlob);
      });

      const req = httpMock.expectOne(`/download-anonymized/${fileId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockBlob);
    });

    it('should handle errors when downloading an anonymized file', () => {
      const errorMessage = 'File download failed';
      const fileId = '12345';

      service.downloadAnonymizedFile(fileId).subscribe(
        () => fail('Expected an error, but got a response'),
        (error) => {
          expect(error.message).toContain(errorMessage);
        }
      );

      const req = httpMock.expectOne(`/download-anonymized/${fileId}`);
      req.flush({ message: errorMessage }, { status: 404, statusText: 'Not Found' });
    });
  });
});
