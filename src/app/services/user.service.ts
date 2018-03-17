import { Injectable, Inject } from '@angular/core';
import { User} from '../classes/user';
import { Observable} from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import {Address} from '../classes/address';



const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable()
export class UserService {

  private usersUrl = `${this.apiEndpoint}/users`;

  constructor(
    private http: HttpClient,
    @Inject('API_ENDPOINT') private apiEndpoint: string
  ) { }

  /** GET users from the server */
  getUsers(): Observable<User[]> {
    return  this.http.get<User[]>(this.usersUrl)
      .map(response => response.map(x => {
        x.address = x.address || new Address(null, null, null, null);
        return new User(x.id, x.username, x.first_name, x.last_name, x.entitle, x.usertype, x.password, x.zonerights,
          new Address( x.address.street, x.address.city, x.address.state, x.address.zip_code), x.site_id, x.teamright, x.siteright, x.picture);
      } ));
  }

  /** GET users filtered by type */
  getUsersByType(userType: string): Observable<User[]> {
    return  this.http.get<User[]>(`${this.usersUrl}`, {params: {usertype: userType}})
      .map(response => response.map(x => {
        x.address = x.address || new Address(null, null, null, null);
        return new User(x.id, x.username, x.first_name, x.last_name, x.entitle, x.usertype, x.password, x.zonerights,
          new Address( x.address.street, x.address.city, x.address.state, x.address.zip_code), x.site_id, x.teamright, x.siteright, x.picture);
      } ));
  }

  /** GET users filtered by type */
  searchByUsername(username: string): Observable<User[]> {
    return  this.http.get<User[]>(`${this.usersUrl}`, {params: {username: username}})
      .map(response => response.map(x => {
        x.address = x.address || new Address(null, null, null, null);
        return new User(x.id, x.username, x.first_name, x.last_name, x.entitle, x.usertype, x.password, x.zonerights,
          new Address( x.address.street, x.address.city, x.address.state, x.address.zip_code), x.site_id, x.teamright, x.siteright, x.picture);
      } ));
  }

  getUsersBySites(sites: string[]): Observable<User[]> {
    return  this.http.post<User[]>(`${this.usersUrl}/getUsersBySites`, {sites: sites})
      .map(response => response.map(x => {
        x.address = x.address || new Address(null, null, null, null);
        return new User(x.id, x.username, x.first_name, x.last_name, x.entitle, x.usertype, x.password, x.zonerights,
          new Address( x.address.street, x.address.city, x.address.state, x.address.zip_code), x.site_id, x.teamright, x.siteright, x.picture);
      } ));
  }

  /** PUT: update the user on the server */
  updateUser (user: User): Observable<any> {
    return this.http.put(this.usersUrl, user, httpOptions);
  }

  /** POST: add a new user to the server */
  addUser (user: User): Observable<User> {
    return this.http.post<User>(this.usersUrl, user, httpOptions);
  }

  /** DELETE: delete the user from the server */
  deleteUser (user: User | string): Observable<User> {
    const id = typeof user === 'string' ? user : user.id;
    const url = `${this.usersUrl}?id=${id}`;

    return this.http.delete<User>(url, httpOptions);
  }

}
