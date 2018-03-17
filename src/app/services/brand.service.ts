import { Injectable, Inject } from '@angular/core';
import {Brand} from '../classes/brand';
import { Observable} from 'rxjs/Observable';
import { HttpClient, HttpHeaders} from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable()
export class BrandService {

  private brandsUrl = `${this.apiEndpoint}/brands`;

  /** GET sites from the server */
  getBrands(): Observable<Brand[]> {
    return  this.http.get<Brand[]>(this.brandsUrl)
      .map(response => response.map(x => new Brand(x.id, x.brand_name) ));
  }

  constructor(
    private http: HttpClient,
    @Inject('API_ENDPOINT') private apiEndpoint: string
  ) { }
}
