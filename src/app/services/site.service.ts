import { Injectable, Inject } from '@angular/core';
import { Site} from '../classes/site';
import { Observable} from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import {Address} from '../classes/address';



const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable()
export class SiteService {

  private sitesUrl = `${this.apiEndpoint}/sites`;

  /** GET sites from the server */
  getSites(): Observable<Site[]> {
    return  this.http.get<Site[]>(this.sitesUrl)
      .map(response => response.map(x => new Site(x.id, x.name, new Address( x.address.street, x.address.city, x.address.state, x.address.zip_code), x.type, x.project_uid) ));
  }

  /** PUT: update the site on the server */
  updateSite (site: Site): Observable<any> {
    return this.http.put(this.sitesUrl, site, httpOptions);
  }

  /** POST: add a new site to the server */
  addSite (site: Site): Observable<Site> {
    return this.http.post<Site>(this.sitesUrl, site, httpOptions);
  }

  /** DELETE: delete the site from the server */
  deleteSite (site: Site | string): Observable<Site> {
    const id = typeof site === 'string' ? site : site.id;
    const url = `${this.sitesUrl}?id=${id}`;

    return this.http.delete<Site>(url, httpOptions);
  }

  /** GET site types from the server */
  getSiteTypes(): Observable<any[]> {
    return new Observable(observer => {
      setTimeout(() => {
        observer.next([{id: 0, name: 'OFF STREET'}, {id:1, name: 'ON STREET'}]);
      }, 1);
    });
  }

  constructor(
    private http: HttpClient,
    @Inject('API_ENDPOINT') private apiEndpoint: string
  ) { }

}
