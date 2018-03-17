import { Injectable, Inject } from '@angular/core';
import { Observable} from 'rxjs/Observable';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import {VehicleType} from '../classes/vehicleType';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable()
export class VehicleTypeService {

  private vehicleTypesUrl = `${this.apiEndpoint}/vehicletypes`;

  /** GET vehicles from the server */
  getVehicleTypes(): Observable<VehicleType[]> {
    return  this.http.get<VehicleType[]>(this.vehicleTypesUrl)
      .map(response => response.map(x => new VehicleType (x.id, x.type_name) ));
  }

  constructor(
    private http: HttpClient,
    @Inject('API_ENDPOINT') private apiEndpoint: string
  ) { }


}
