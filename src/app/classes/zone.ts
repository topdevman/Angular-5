import {Marker, Polygon, Polyline} from 'leaflet';
import * as L from 'leaflet';

export class Zone {
  public static color? = '#2E64FE';
  id: string;
  name: string;
  site_name: string;
  pointszone: any[];
  type: string;
  site_id: string;
  polygon?: Polygon;
  layer_id?: number;
  constructor(id: string, name: string, site_name: string, pointszone: any[], type: string, site_id: string) {
    this.id = id;
    this.name = name;
    this.site_name = site_name;
    this.pointszone = pointszone;
    this.type = type;
    this.site_id = site_id;
  }

  private polylineOptions = {
    color: '#2E64FE',
    weight: 3,
    opacity: 0.7,
    className: 'zone'
  };
  public zoneToMarker(): Polygon {
    if (this.pointszone) {
      const polygonPoints = [];
      this.pointszone.forEach(tuple => polygonPoints.push(new L.LatLng(tuple[0], tuple[1])));
      polygonPoints.push(this.pointszone[0]);
      this.polygon = new L.Polygon(polygonPoints, this.polylineOptions);
      return this.polygon;
    } else {
        console.error('Zone marker : error while reading data object.'); // zone has no pointszone
    }
  }
}
