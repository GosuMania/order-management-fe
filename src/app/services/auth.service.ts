import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {environment} from "../../environments/environment";
import {map} from "rxjs/operators";
import {IUser} from "../interfaces/IUser";
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
  public userProfile: BehaviorSubject<IUser | null> = new BehaviorSubject<IUser | null>( null);

  constructor(private http: HttpClient) {
    this.profileUser().subscribe((data: any) => {
      this.userProfile.next(data);
    });
  }
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

  resetPassword(email: string): Observable<any> {
    return this.http.post<any>(environment.urlApi + 'auth/reset-password', {email: email});
  }
}
