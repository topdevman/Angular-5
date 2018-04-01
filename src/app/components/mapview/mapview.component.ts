import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {MapService} from '../../services/map.service';
import 'leaflet-draw';
import * as L from 'leaflet';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import {OptionsMap} from './MapOptions';

@Component({
  selector: 'app-mapview',
  templateUrl: './mapview.component.html',
  styleUrls: ['./mapview.component.css']
})
export class MapviewComponent implements OnInit {

  private provider = new OpenStreetMapProvider();
  @Input()
  private options: OptionsMap;
  constructor(private mapService: MapService) {
  }

  ngOnInit() {
    const map = L.map('map', {
      zoomControl: false,
      center: L.latLng(this.options.location.lat, this.options.location.lng),
      zoom: 12,
      minZoom: 4,
      maxZoom: 19,
      layers: [this.mapService.baseMaps.OpenStreetMap]
    });
    const drawItems = new L.FeatureGroup();
    // Initialise the draw control and pass it the FeatureGroup of editable layers

    const polygonOptions = !this.options.polygon ? false: {};
    const circleOptions = !this.options.circle ? false: {};
    const markerOptions = !this.options.marker ? false: {};

    const drawControl = new L.Control.Draw({
      edit: {
        featureGroup: drawItems
      },
      draw: {
        polyline: false,
        rectangle: false,
        circlemarker: false,
        polygon: polygonOptions,
        marker: circleOptions,
        circle: markerOptions
      }
    });
    L.control.zoom({ position: 'topright' }).addTo(map);
    L.control.layers(this.mapService.baseMaps).addTo(map);
    L.control.scale().addTo(map);
    map.addLayer(drawItems);
    map.addControl(drawControl);
    if (this.options.search_bar) {
      const searchControl = new GeoSearchControl({
        provider: this.provider,                               // required
        showMarker: true,                                   // optional: true|false  - default true
        showPopup: false,                                   // optional: true|false  - default false
        marker: {                                           // optional: L.Marker    - default L.Icon.Default
          icon: new L.Icon.Default(),
          draggable: false,
        },
        popupFormat: ({ query, result }) => result.label,   // optional: function    - default returns result label
        maxMarkers: 1,                                      // optional: number      - default 1
        retainZoomLevel: false,                             // optional: true|false  - default false
        animateZoom: true,                                  // optional: true|false  - default true
        autoClose: true,                                   // optional: true|false  - default false
        searchLabel: 'Enter address',                       // optional: string      - default 'Enter address'
        keepResult: false                                   // optional: true|false  - default false
      });
      map.addControl(searchControl);
    }
    this.mapService.setMap(map);
    /**
     * Using map events example
     */
    // this.mapService.getMap().on(L.Draw.Event.CREATED, function (e: any) {
    //   const type = (e as L.DrawEvents.Created).layerType;
    //   const layer = (e as L.DrawEvents.Created).layer;
    //   console.log(e);
    //
    //   switch (type) {
    //     case 'marker': {
    //
    //       break;
    //     }
    //     case 'polygon': {
    //       break;
    //     }
    //     case 'circle': {
    //       console.log('circle');
    //       console.log(layer);
    //       break;
    //     }
    //     default: {
    //       console.log('wtf');
    //       console.log(layer);
    //       break;
    //     }
    //       // Do whatever else you need to. (save to db, add to map etc)
    //       drawItems.addLayer(layer);
    // });
    //
    // map.on('draw:edited', function(e: any){
    //   const layers = (e as L.DrawEvents.Edited).layers;
    //   // const missing = layers.filter(item => drawItems.getLayer(item.layer_id) !== null);
    //   console.log(layers);
    //   map.invalidateSize();
    // });
    // map.on('geosearch/showlocation', function(e: any){});

  }

}
