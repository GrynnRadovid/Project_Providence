import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, Subject, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

interface LoginResponse {
  token: string;
  username?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8000/api/';
  private registerUrl = this.apiUrl + 'register/';
  public _isAuthenticated = false;
  private authChangeSubject = new Subject<boolean>();

  authChange = this.authChangeSubject.asObservable();

  constructor(private http: HttpClient) {
    // Initialize authentication state based on token in local storage
    this._isAuthenticated = !!localStorage.getItem('authToken');
  }

  private getCookie(name: string): string | null {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);

    if (parts.length === 2) {
      const poppedValue = parts.pop();
      if (poppedValue) {
        return poppedValue.split(";").shift() || null;
      }
    }

    return null;
  }

  getHeaders(): HttpHeaders {
    let headers: HttpHeaders = new HttpHeaders();
    const csrfToken = this.getCookie('csrftoken');
    const authToken = localStorage.getItem('authToken');

    if (csrfToken) {
        headers = headers.append('X-CSRFToken', csrfToken);
    }
    if (authToken) {
        headers = headers.append('Authorization', 'Bearer ' + authToken);
    }

    return headers;
}

  login(username: string, password: string): Observable<LoginResponse> {
    let headers: HttpHeaders = new HttpHeaders();

    const csrfToken = this.getCookie('csrftoken');
    if (csrfToken) {
      headers = headers.append('X-CSRFToken', csrfToken);
    }

    return this.http.post<LoginResponse>(this.apiUrl + 'login/', { username, password }, { headers }).pipe(
      tap(response => {
        if (response && response.token) {
          localStorage.setItem('authToken', response.token);
          if (response.username) {
            localStorage.setItem('username', response.username);
          }
          this._isAuthenticated = true;
          this.authChangeSubject.next(true);  // Notify subscribers of authentication change
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    this._isAuthenticated = false;
    this.authChangeSubject.next(false);  // Notify subscribers of authentication change
  }

  isLoggedIn(): boolean {
    return this._isAuthenticated;
  }

  getUsername(): string {
    return localStorage.getItem('username') || '';
  }
  register(data: { username: string; password: string; email: string }): Observable<any> {
    return this.http.post(this.registerUrl, data).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => this.handleError(error));
      })
    );
  }

  private handleError(error: HttpErrorResponse): string {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else if (error.status === 400 && error.error) {
      errorMessage = error.error.message || error.error.detail || 'Registration failed!';
    } else {
      errorMessage = `Server Error: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return errorMessage;
  }
}
