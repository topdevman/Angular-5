import { Injectable, Inject } from '@angular/core';
import {Color} from '../classes/color';
import { Observable} from 'rxjs/Observable';
import { HttpClient, HttpHeaders} from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable()
export class ColorService {

  private colorsUrl = `${this.apiEndpoint}/colors`;

  /** GET sites from the server */
  getColors(): Observable<Color[]> {
    return  this.http.get<Color[]>(this.colorsUrl)
      .map(response => response.map(x => new Color(x.id, x.color_name) ));
  }

  constructor(
    private http: HttpClient,
    @Inject('API_ENDPOINT') private apiEndpoint: string
  ) { }

}
