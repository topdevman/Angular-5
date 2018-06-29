import { Component, Input, Output, EventEmitter,  OnInit, OnChanges, ViewChild } from '@angular/core';

import 'leaflet-draw';
import * as L from 'leaflet';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';

import { Job } from './../../classes/job';

import MapOptions from './../../classes/MapOptions';
import {Agent} from '../../classes/agent';

@Component({
  selector: 'app-mapview',
  templateUrl: './mapview.component.html',
  styleUrls: ['./mapview.component.css']
})
export class MapviewComponent implements OnInit, OnChanges {

  private provider = new OpenStreetMapProvider();

  @Input() private options: MapOptions;
  @Input() mapdata: string;
  @Input() markerIconsPath: string;
  @Input() jobType: string;

  @Output() mapDataChangedEmitter: EventEmitter<string> = new EventEmitter<string>();


  @ViewChild('mapDiv') mapContainer;

  private mapDataObj: L.GeoJSON;
  private map: L.Map;
  private drawItems: L.FeatureGroup;
  private JobTypeMarker: L.Marker;

  private baseMaps = {
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

  constructor() {}

  ngOnInit() {

    this.configureMap();
    this.handleEvents();
    this.displayDrawings();
  }

  ngOnChanges() {
    if (this.mapdata) {
      const geoJsonData = JSON.parse(this.mapdata);
      this.mapDataObj = L.geoJSON(geoJsonData);
    } else {
      this.mapDataObj = L.geoJSON();
    }

    this.clearMap();
    this.displayDrawings();
  }

  configureMap() {
    this.map = L.map(this.mapContainer.nativeElement, {
      zoomControl: false,
      center: L.latLng(this.options.centerLocation.lat, this.options.centerLocation.lng),
      zoom: 12,
      minZoom: 4,
      maxZoom: 18,
      layers: [this.baseMaps.Esri]
    });

    this.drawItems = new L.FeatureGroup();
    // Initialise the draw control and pass it the FeatureGroup of editable layers

    const drawOptions = {
      polyline: false,
      rectangle: false,
      circlemarker: false,
      polygon: this.options.polygon,
      circle: this.options.circle,
      marker: this.options.marker
    };

    const drawControl = new L.Control.Draw({
      edit: {
        featureGroup: this.drawItems
      },
      draw: ( drawOptions as L.Control.DrawOptions )
    });

    L.control.zoom({ position: 'topright' }).addTo(this.map);
    L.control.layers(this.baseMaps).addTo(this.map);
    L.control.scale().addTo(this.map);

    this.map.addLayer(this.drawItems);
    if (this.options.editing) {
      this.map.addControl(drawControl);
    }
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

      this.map.addControl(searchControl);
    }
  }

  handleEvents() {
    this.map.on(L.Draw.Event.CREATED, (e) => {
      let ableToAddLayer = true;

      // Use this to avoid typescript type checking.
      const layer: any = (e as L.DrawEvents.Created).layer;
      const type = (e as L.DrawEvents.Created).layerType;

      let feature = layer.feature = layer.feature || {};
      feature.type = "Feature";
      feature.properties = feature.properties || {};
      
      feature.properties.options = feature.properties.options || {};
      feature.properties.options = Object.assign(feature.properties.options, layer.options);

      // Create a job marker.
      if (type === 'marker' && this.jobType) {
        feature.properties["jobType"] = this.jobType;
        feature.properties["markerIconsPath"] = this.markerIconsPath;

        if(this.drawItems.getLayers().length > 0) ableToAddLayer = false;
      }
    
      if (ableToAddLayer) {
        this.drawItems.addLayer(layer);
        const layersGeoJson = this.drawItems.toGeoJSON();
        this.mapDataObj = L.geoJSON(layersGeoJson);
        // Save drawings to DB
        const mapdataJson = JSON.stringify(this.mapDataObj.toGeoJSON());
        this.updateMapData(mapdataJson);
      }
    });

    this.map.on('draw:deleted', (e) => {
      const layers = (e as L.DrawEvents.Deleted).layers;
      layers.getLayers().forEach(layer => {
        this.drawItems.removeLayer(layer);
      });
      const layersGeoJson = this.drawItems.toGeoJSON();
      this.mapDataObj = L.geoJSON(layersGeoJson);
      // Save drawings to DB
      const mapdataJson = JSON.stringify(this.mapDataObj.toGeoJSON());
      this.updateMapData(mapdataJson);
    });

    this.map.on(L.Draw.Event.EDITED, (e) => {
      const editedLayers = (e as L.DrawEvents.Edited).layers;
      this.drawItems.getLayers().map(layer => {
        const originalLayerId = this.drawItems.getLayerId(layer);
        const editedLayer = editedLayers.getLayer(originalLayerId);
        if (editedLayer) {
          return editedLayer;
        } else {
          return layer;
        }
      });
      const layersGeoJson = this.drawItems.toGeoJSON();
      this.mapDataObj = L.geoJSON(layersGeoJson);
      // Save drawings to DB
      const mapdataJson = JSON.stringify(this.mapDataObj.toGeoJSON());
      this.updateMapData(mapdataJson);
    });
  }

  displayDrawings() {

    // Display all drawings passed to this mapview.
    if (this.mapDataObj && this.drawItems) {
      this.mapDataObj.eachLayer((layer:any) => {
        
        if(layer && 
          layer.options && 
          layer.feature && 
          layer.feature.properties && 
          layer.feature.properties.options) 
          layer.options = Object.assign(layer.options, layer.feature.properties.options);

        if(layer instanceof L.Marker) {
          if(layer.feature.properties.jobType) {
            L.Icon.Default.imagePath = layer.feature.properties.markerIconsPath;
            layer.setIcon(Job.getJobTypeIcon(layer.feature.properties.jobType));

            layer.bindPopup('Popup content for job marker to be set here!');

            layer.on("dblclick", (event) => {
              window.open('https://www.google.com/', '_blank');
            });
          }
        }
        if((layer as L.Marker).feature.properties.userType) {
          L.Icon.Default.imagePath = (layer as L.Marker).feature.properties.markerIconsPath;
          (layer as L.Marker).setIcon(Agent.getUserIcon((layer as L.Marker).feature.properties.userType));

          layer.bindPopup('Popup content for user marker to be set here!');
        }
        this.drawItems.addLayer(layer);
      });
    }

  }

  clearMap() {
    if (this.drawItems) {
      this.drawItems.clearLayers();
    }
  }

  // Pass drawings to parent component of this mapview.
  updateMapData(mapdata) {
    this.mapDataChangedEmitter.emit(mapdata);
  }
}

