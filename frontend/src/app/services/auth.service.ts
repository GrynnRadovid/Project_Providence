import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, Subject, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  private apiUrl = 'http://127.0.0.1:8000/api/';
  private registerUrl = this.apiUrl + 'register/';
  public _isAuthenticated = false;
  private _username: string | null = null;
  private authChangeSubject = new Subject<boolean>();

  authChange = this.authChangeSubject.asObservable();

  constructor(private http: HttpClient) {
    const username = localStorage.getItem('username');
    this._isAuthenticated = !!username;
    this._username = username;
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post(this.apiUrl + 'login/', { username, password }).pipe(
      tap(response => {
        console.log(response);
        localStorage.setItem('username', username); // Store username in local storage
        this._isAuthenticated = true;
        this._username = username; // Set the username
        this.authChangeSubject.next(true);
      })
    );
  }
  getUsername(): string | null {
    return this._username;
  }
  logout(): void {
    localStorage.removeItem('username');
    this._isAuthenticated = false;
    this._username = null; // Reset the username
    this.authChangeSubject.next(false);
  }

  isLoggedIn(): boolean {
    return this._isAuthenticated;
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
