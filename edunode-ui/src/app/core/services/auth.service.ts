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
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) {
  }

  register(credentials: UserCredentialsModel): Observable<UserDetailsModel> {
    return this.http.post<UserDetailsModel>('api/register', credentials, this.httpOptions);
  }

  login(credentials: UserCredentialsModel): Observable<{}> {
    return this.http.post('api/login', credentials, this.httpOptions);
  }

  logout(): Observable<{}> {
    return this.http.post('/api/logout', this.httpOptions);
  }

  getMe(): Observable<UserDetailsModel> {
    return this.http.get<UserDetailsModel>('/api/users/me', this.httpOptions);
  }
}
