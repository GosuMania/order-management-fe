import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {environment} from "../../environments/environment";
import {map} from "rxjs/operators";
// User interface
export class User {
  name!: String;
  email!: String;
  password!: String;
  password_confirmation!: String;
}
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}
  // User registration
  register(user: User): Observable<any> {
    return this.http.post(environment.urlApi + 'auth/register', user);
  }
  // Login
  signin(user: User): Observable<any> {
    return this.http.post<any>(environment.urlApi + 'auth/login', user);
  }
  // Access authentication profile
  profileUser(): Observable<any> {
    return this.http.get(environment.urlApi + 'auth/user-profile');
  }

  getUsersList(): Observable<any> {
    return this.http.get<any>(environment.urlApi + environment.GET_ALL).pipe(
      map(res => res.data)
    );
  }
}
