import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiUrl = 'http://localhost:8000/api/login/';

  constructor(private http: HttpClient) {}

  getCookie(name: string): string | null {
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

  login(username: string, password: string): Observable<any> {
    let headers: HttpHeaders = new HttpHeaders();

    const csrfToken = this.getCookie('csrftoken');
    if (csrfToken) {
      headers = headers.append('X-CSRFToken', csrfToken);
    }

    return this.http.post(this.apiUrl, { username, password }, { headers });
  }
}
