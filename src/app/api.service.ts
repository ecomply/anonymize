import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:5001'; // Flask backend base URL
  private anonymizeEndpoint = `${this.baseUrl}/anonymize`; // Endpoint for anonymization

  constructor(private http: HttpClient) {}

  /**
   * Uploads a file to the backend for anonymization.
   * @param formData - The form data containing the file to be uploaded.
   * @returns Observable<any> - The response from the backend.
   */
  uploadFile(formData: FormData): Observable<any> {
    const headers = new HttpHeaders({
      'Accept': 'application/json'
    });

    return this.http.post<any>(this.anonymizeEndpoint, formData, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Handles errors from HTTP requests.
   * @param error - The HTTP error response.
   * @returns Observable<never> - Throws an error with a detailed message.
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      errorMessage = `Client-side error: ${error.error.message}`;
    } else {
      // Backend returned an unsuccessful response code
      errorMessage = `Server-side error: Code ${error.status}, Message: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
