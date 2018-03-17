import * as moment from 'moment';
import * as L from 'leaflet';
import {LayerGroup, Marker} from 'leaflet';

export class Job {
  public static color? = '#AEB404';
  id: string;
  car_licence_plate: string;
  car_brand: string;
  car_color: string;
  custom_job_description: string;
  job_type: string;
  creation: string;
  start: string;
  end: string;
  taker_first_name: string;
  zone_name: string;
  latitude: number;
  longitude: number;
  layer_id?: number;
  zone_id: string;
  marker?: Marker;
  jobIcon: L.Icon;
  constructor(id: string, car_licence_plate: string, car_brand: string, car_color: string, custom_job_description: string, job_type: string, creation: string, start: string, end: string, taker_first_name: string, zone_name: string, latitude: number, longitude: number, zone_id: string) {
    this.id = id;
    this.car_licence_plate = car_licence_plate;
    this.car_brand = car_brand;
    this.car_color = car_color;
    this.custom_job_description = custom_job_description;
    this.job_type = job_type;
    this.creation = moment(creation).format('MMMM Do YYYY, h:mm:ss a');
    this.start = moment(start).format('MMMM Do YYYY, h:mm:ss a');
    this.end = moment(end).format('MMMM Do YYYY, h:mm:ss a');
    this.taker_first_name = taker_first_name;
    this.zone_name = zone_name;
    this.latitude = latitude;
    this.longitude = longitude;
    this.jobIcon = L.icon({
      iconUrl: '/assets/drapeau.png',
      iconSize: [38, 95],
    });
    this.zone_id = zone_id;
  }
  public jobToMarker(): Marker {
    if (this.latitude && this.longitude) {
      const marker = L.marker([this.latitude, this.longitude], {icon: this.jobIcon});
      marker.bindPopup('<b> Licence Plate : ' + this.car_licence_plate + '</b><br> ' +
        'Created at : ' + this.creation +
        '</br> Type : ' + this.job_type);
      this.marker = marker;
      return marker;
    } else {
      console.error('Job marker : error while reading data object.');
    }
  }
}
