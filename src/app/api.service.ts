import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = '/answer'; // Backend endpoint
  private anonymizeUrl = '/anonymize'; // Backend endpoint for anonymization
  private downloadAnonymizedUrl = '/download-anonymized'; // Backend endpoint for downloading anonymized files

  constructor(private http: HttpClient) {}

  uploadFile(formData: FormData): Observable<any> {
    return this.http.post<any>(this.apiUrl, formData).pipe(
      catchError(this.handleError)
    );
  }

  anonymizeDocument(formData: FormData): Observable<any> {
    return this.http.post<any>(this.anonymizeUrl, formData).pipe(
      catchError(this.handleError)
    );
  }

  downloadAnonymizedFile(fileId: string): Observable<Blob> {
    return this.http.get(`${this.downloadAnonymizedUrl}/${fileId}`, { responseType: 'blob' }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Backend returned an unsuccessful response code
      errorMessage = `Error Code: ${error.status}\\\\\\\\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}