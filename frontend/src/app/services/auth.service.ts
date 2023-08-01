import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';

interface LoginResponse {
  token: string;
  username?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8000/api/';
  public _isAuthenticated = false;
  private authChangeSubject = new Subject<boolean>();

  authChange = this.authChangeSubject.asObservable();

  constructor(private http: HttpClient) { }

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
}
