import { Injectable, Inject } from '@angular/core';
import { UserType} from '../classes/userType';
import { Observable} from 'rxjs/Observable';
import { HttpClient, HttpHeaders} from '@angular/common/http';

import 'rxjs/add/operator/map';
import {Job} from '../classes/job';



const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable()
export class UserTypeService {

  private userTypeUrl = `${this.apiEndpoint}/usertypes`;

  constructor(
    private http: HttpClient,
    @Inject('API_ENDPOINT') private apiEndpoint: string
  ) { }

  /** GET UserType list */
  getUserTypes(): Observable<UserType[]> {
    return  this.http.get<UserType[]>(`${this.userTypeUrl}`)
      .map(response => response.map(item => new UserType(item.nametype, item.apprights, item.viewrights)));
  }
}
