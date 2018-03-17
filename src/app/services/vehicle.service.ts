import { Injectable, Inject } from '@angular/core';
import { Vehicle} from '../classes/vehicle';
import { Observable} from 'rxjs/Observable';
import { HttpClient, HttpHeaders} from '@angular/common/http';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable()
export class VehicleService {

  private vehiclesUrl = `${this.apiEndpoint}/vehicles`;

  constructor(
    private http: HttpClient,
    @Inject('API_ENDPOINT') private apiEndpoint: string
  ) { }
  
  /** GET vehicles from the server */
  getVehicles(): Observable<Vehicle[]> {
    return  this.http.get<Vehicle[]>(this.vehiclesUrl)
      .map(response => response.map(x => new Vehicle (x.id, x.brand, x.color, x.issuedate, x.licence_plate, x.model, x.type) ));
  }

  /** PUT: update the vehicle on the server */
  updateVehicle (vehicle: Vehicle): Observable<any> {
    return this.http.put(this.vehiclesUrl, vehicle, httpOptions);
  }

  /** POST: add a new vehicle to the server */
  addVehicle (vehicle: Vehicle): Observable<Vehicle> {
    return this.http.post<Vehicle>(this.vehiclesUrl, vehicle, httpOptions);
  }

  /** DELETE: delete the vehicle from the server */
  deleteVehicle(vehicle: Vehicle | string): Observable<Vehicle> {
    const id = typeof vehicle === 'string' ? vehicle : vehicle.id;
    const url = `${this.vehiclesUrl}?id=${id}`;

    return this.http.delete<Vehicle>(url, httpOptions);
  }

  /** GET vehicles from the server */
  getVehicleTypes(): Observable<any[]> {
    return  this.http.get<any[]>(this.vehiclesUrl + "/types")
    .map(response => response.map(x => new Object({ id: x.id, name: x.type_name })));
  }

}
