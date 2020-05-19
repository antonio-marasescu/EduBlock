import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {UserCredentialsModel} from '../models/users/user-credentials.model';
import {Observable} from 'rxjs';
import {UserDetailsModel} from '../models/users/user-details.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    })
  };

  constructor(private http: HttpClient) {
  }

  login(credentials: UserCredentialsModel): Observable<{}> {
    const body = new URLSearchParams();
    body.append('email', credentials.email);
    body.append('password', credentials.password);
    return this.http.post('api/login', body.toString(), this.httpOptions);
  }

  logout(): Observable<{}> {
    return this.http.post('/api/logout', '', this.httpOptions);
  }

  getMe(): Observable<UserDetailsModel> {
    return this.http.get<UserDetailsModel>('/api/me', this.httpOptions);
  }
}
