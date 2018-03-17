import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import * as L from 'leaflet';
import {Layer} from 'leaflet';

@Injectable()
export class MapService {

  private map: L.Map;
  public baseMaps: any;
  private provider = new OpenStreetMapProvider();

  constructor(private http: HttpClient) {
    this.baseMaps = {
      OpenStreetMap: L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, Tiles courtesy of <a href="http://hot.openstreetmap.org/" target="_blank">Humanitarian OpenStreetMap Team</a>'
      }),
      Esri: L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community'
      }),
      CartoDB: L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
      })
    };
  }

  public getMap(): L.Map {
    return this.map;
  }
  public setMap(map: L.Map) {
    this.map = map;
  }
  public search (city: string): any {
    return this.provider.search({query: city});
  }


}
