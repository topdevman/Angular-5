import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import 'rxjs/add/operator/map';
import { tokenNotExpired } from 'angular2-jwt';
import {Observable} from 'rxjs/Observable';
import {User} from '../models/user';

@Injectable()
export class AuthService {
  authToken: any;
  user: User;
  constructor(
      protected httpClient: HttpClient,
      @Inject('API_ENDPOINT') private apiEndpoint: string
  ) {
    try {
      this.user = JSON.parse(localStorage.getItem('user'));
    } catch(e) {}
  }

  authenticateUser(user): Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    return this.httpClient.post(`${this.apiEndpoint}/auth/authenticate`, user, {headers: headers});
  }

  getProfile(): Observable<any> {
    const headers = new HttpHeaders();
    this.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    return this.httpClient.get(`${this.apiEndpoint}/users/profile`, {headers: headers});
  }

  storeUserData(token, user): void {
    localStorage.setItem('id_token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.authToken = token;
    this.user = user;
  }

  getLoggedInUser(): User {
    return this.user;
  }

  loadToken(): void {
    const token = localStorage.getItem('id_token');
    this.authToken = token;
  }

  loggedIn(): boolean {
    return tokenNotExpired('id_token');
  }

  logOut(): void {
    this.authToken = null;
    this.user = null;
    localStorage.clear();
  }
}
