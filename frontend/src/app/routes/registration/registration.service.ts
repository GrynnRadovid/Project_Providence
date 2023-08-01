import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {
  private apiUrl = 'http://localhost:8000/api/register/';

  constructor(private http: HttpClient) {}

  register(data: { username: string; password: string; email: string }): Observable<any> {
    return this.http.post(this.apiUrl, data).pipe(
      catchError((error: HttpErrorResponse) => {
        // You can add any side-effect here, if required.
        // For example: this.authService.signOut();
        return throwError(() => this.handleError(error));
      })
    );
  }


  private handleError(error: HttpErrorResponse): string {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else if (error.status === 400 && error.error) {
      // Backend returned a 400 response. We try to extract its message.
      errorMessage = error.error.message || error.error.detail || 'Registration failed!';
    } else {
      // Server-side error
      errorMessage = `Server Error: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return errorMessage;
  }

}
