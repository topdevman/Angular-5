import { Component, OnInit } from '@angular/core';
import {MapService} from '../../services/map.service';
import {JobService} from '../../services/job.service';
import {ZoneService} from '../../services/zone.service';
import {SiteService} from '../../services/site.service';
import {SocketService} from '../../services/socket.service';
import {Site} from '../../classes/site';
import {Job} from '../../classes/job';
import {Zone} from '../../classes/zone';
import {Agent} from '../../classes/agent';
import {LayerGroup, Marker} from 'leaflet';
import * as L from 'leaflet';
import 'rxjs/add/observable/interval';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {
  sites: Site[] = [];
  zones: Zone[] = [];
  jobs: Job[] = [];
  enforcers: Agent[] = [];
  drivers: Agent[] = [];
  zonesLayers: LayerGroup;
  jobsLayers: LayerGroup;
  enforcersLayers: LayerGroup;
  driversLayers: LayerGroup;
  selectedSite: Site;
  selectedZone: Zone;
  siteSelected = false;
  zoneSelected = false;
  jobsSelected = false;
  driversSelected = false;
  enforcersSelected = false;
  constructor(private mapService: MapService, private jobService: JobService, private zoneService: ZoneService, private siteService: SiteService,
  private socketService: SocketService) {}

  ngOnInit() {
    Observable.interval(1000 * 60).subscribe(x => {
      if (this.enforcers.length > 0) {
        this.enforcers = [];
      }
      if (this.drivers.length > 0) {
        this.drivers = [];
      }
    });
    Observable.interval(1002 * 60).subscribe(x => {
      if (this.enforcersSelected) {
        this.enforcersLayers.clearLayers();
        this.enforcers.forEach(e => {
          const marker = Agent.agentToMarker(e);
          this.enforcersLayers.addLayer(marker);
        });
      }
      if (this.driversSelected) {
        this.driversLayers.clearLayers();
        this.drivers.forEach(e => {
          const marker = Agent.agentToMarker(e);
          this.driversLayers.addLayer(marker);
        });
      }
    });
  }

  Initialize() {
    this.siteService.getSites().subscribe(sites => this.sites = sites);
    this.zoneService.getZones().subscribe(zones => this.zones = zones);
    this.jobService.getJobs().subscribe(jobs => this.jobs = jobs);
    this.socketService.getMobileActiveUsers().subscribe(agent => {
      if (agent.usertype === 'Enforcer') {
        if (this.enforcers.length > 0) {
          const indexToUpdate = this.enforcers.indexOf(agent);
          if (indexToUpdate > 0) { this.enforcers.push(this.enforcers[indexToUpdate].updatePosition(agent)); console.log(this.enforcers[indexToUpdate]); console.log('2222222222222222'); }
        } else {
            this.enforcers.push(agent);
        }
      } else if (agent.usertype === 'Driver') {
          if (this.drivers.length > 0) {
            const indexToUpdate = this.drivers.indexOf(agent);
            if (indexToUpdate > 0) { this.drivers.push(this.drivers[indexToUpdate].updatePosition(agent)); }
          } else {
              this.drivers.push(agent);
          }
      }
    });
    this.zonesLayers = L.layerGroup().addTo(this.mapService.getMap());
    this.jobsLayers = L.layerGroup().addTo(this.mapService.getMap());
    this.enforcersLayers = L.layerGroup().addTo(this.mapService.getMap());
    this.driversLayers = L.layerGroup().addTo(this.mapService.getMap());
  }
  displayZones() {
    if (this.selectedSite && this.zones && !this.zoneSelected) {
      this.zoneSelected = true;
      this.zones.forEach(zone => {
        const marker = zone.zoneToMarker();
        if (marker) { marker.addTo(this.zonesLayers); }
        if (zone.polygon) { zone.layer_id = this.zonesLayers.getLayerId(zone.polygon); }
      });
    } else {
        this.zoneSelected = false;
        this.zonesLayers.eachLayer(layer => this.zonesLayers.removeLayer(layer));
    }
  }
  displayJobs() {
    if (this.selectedZone && this.jobs && !this.jobsSelected) {
      this.jobsSelected = true;
      this.jobs.forEach(job => {
        const marker = job.jobToMarker();
        if (marker) { marker.addTo(this.jobsLayers); }
        if (job.marker) { job.layer_id = this.jobsLayers.getLayerId(job.marker); }
      });
    } else {
        this.jobsSelected = false;
        this.jobsLayers.clearLayers();
    }
  }
  displayEnforcers() {
    if (this.selectedZone && this.selectedSite && this.enforcers && !this.enforcersSelected) {
      this.enforcersSelected = true;
      this.enforcers.forEach(user => {
        const marker = Agent.agentToMarker(user);
        if (marker) { marker.addTo(this.enforcersLayers); }
        if (user.marker) { user.layer_id = this.enforcersLayers.getLayerId(user.marker); }
      });
    } else {
        this.enforcersSelected = false;
        this.enforcersLayers.clearLayers();
    }
  }
  displayDrivers() {
    if (this.selectedZone && this.selectedSite && this.drivers && !this.driversSelected) {
      this.driversSelected = true;
      this.drivers.forEach(user => {
        const marker = Agent.agentToMarker(user);
        if (marker) { marker.addTo(this.driversLayers); }
        if (user.marker) { user.layer_id = this.driversLayers.getLayerId(user.marker); }
      });
    } else {
      this.driversSelected = false;
        this.driversLayers.clearLayers();
    }
  }
  onChangeSelectedSite() {
    console.log(this.selectedSite);
    if (this.selectedSite && this.zones) {
      this.zonesLayers.clearLayers();
      // this.zones = this.zones.filter(zone => zone.site_id === this.selectedSite.id);
    }
  }
  onChangeSelectedZone() {
    if (this.selectedZone.id && this.jobs) {
      this.zonesLayers.clearLayers();
      this.jobsLayers.clearLayers();
      const marker = this.selectedZone.zoneToMarker();
      if (marker) { this.zonesLayers.addLayer(marker); }
      this.jobs = this.jobs.filter(job => job.zone_id === this.selectedZone.id);
    }
  }
}
