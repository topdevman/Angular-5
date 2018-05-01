import { Component, OnInit, ViewChild } from '@angular/core';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import MapOptions from './../../classes/MapOptions';

import { Address } from '../../classes/address';
import { Zone} from '../../classes/zone';
import { Site } from '../../classes/site';
import { Job } from '../../classes/job';
import { Agent } from '../../classes/agent';
import { Team } from '../../classes/team';

import { SiteService } from '../../services/site.service';
import { ProjectService } from '../../services/project.service';
import { AccessRightsService } from '../../services/accessRights.service';
import { ZoneService } from '../../services/zone.service';
import { JobService } from '../../services/job.service';
import { SocketService } from '../../services/socket.service';
import { TeamsService } from '../../services/teams.service';

import { FilterdialogComponent } from './filterdialog/filterdialog.component';

@Component({
  selector: 'app-generalview',
  templateUrl: './generalview.component.html',
  styleUrls: ['./generalview.component.css']
})
export class GeneralviewComponent implements OnInit {
  mapOptions = new MapOptions(true, false, false, false, false, {lat: 48.864716, lng: 2.349014});
  mapdata = '{"type": "FeatureCollection", "features": []}';
  features: any[] = [];

  // TODO Use agentTypes and selectedAgentTypes.
  filterData: any = {
    sites: [],
    zones: [],
    agents: [],
    jobTypes: [],
    jobStatus: [],

    selectedSites: [],
    selectedZones: [],
    selectedAgents: [],
    selectedJobTypes: [],
    selectedJobStatus: []

  };

  sites: Site[];
  zones: Zone[];
  jobs: Job[] = [];
  agents: Agent[] = [];
  teams: Team[] = [];


  constructor(private socketService: SocketService,
    private siteService: SiteService,
    private zoneService: ZoneService,
    private projectService: ProjectService,
    private jobService: JobService,
    private teamsService: TeamsService,
    public dialog: MatDialog) {}

  ngOnInit() {
    this.siteService.getSites(this.projectService.activeProject).subscribe(sites => this.sites = sites);
    this.zoneService.getZones(this.projectService.activeProject).subscribe(zones => this.zones = zones);
    this.jobService.getJobs().subscribe(jobs => { this.jobs = jobs; });
    this.teamsService.getTeams(this.projectService.activeProject).subscribe(teams => { this.teams = teams; });

    this.socketService.getMobileActiveUsers().subscribe(user => {
      const user_id = (user as Agent).id;
      if (user && (user.usertype === 'Driver' || user.usertype === 'Enforcer' || user.usertype === 'Clamper')) {
        const agent_: Agent = this.agents.find(x => x.id === user_id);
        if (!agent_) {
          this.agents.push((user as Agent));
        } else {
          this.agents.find(x => x.id === user_id).mapdata = (user as Agent).mapdata;
        }
      }
    });
  }

  onMapDataChanged(mapdata: string) {
    this.mapdata = mapdata;
  }

  // Helper function. JavaScript Array intersection.
  intersect(a, b) {
      var t;
      if (b.length > a.length) t = b, b = a, a = t; // indexOf to loop over shorter
      return a.filter(function (e) {
          return b.indexOf(e) > -1;
      });
  }

  initializeMap() {

    this.filterData.sites = this.sites;

    // By default select all sites.
    if(this.filterData.selectedSites.length == 0) {
      this.filterData.selectedSites = this.sites;
      // this.filterData.selectedZones = this.zones;
    }

    this.filterData.zones = this.zones;

    this.filterData.jobTypes = Job.getJobTypes();

    // By default select all job types.
    if(this.filterData.selectedJobTypes.length == 0) {
      this.filterData.selectedJobTypes = this.filterData.jobTypes;
      // this.filterData.selectedJobStatus = Job.getJobStatus();
    }

    this.filterData.jobStatus = Job.getJobStatus();

    this.filterData.agents = ['Driver', 'Enforcer', 'Clamper'];

  }

  updateMap() {
    this.mapdata = '{"type": "FeatureCollection", "features": []}';
    this.features = [];

    this.filterData.selectedSites.forEach(site => {
      if ((site as any).mapdata) {
        const siteMapData = JSON.parse((site as any).mapdata);
        const siteFeatures = siteMapData.features;
        siteFeatures.forEach(x => this.features.push(x));
      }
    });

    this.filterData.selectedZones.forEach(zone => {
      if ((zone as any).mapdata) {
        const zoneMapData = JSON.parse((zone as any).mapdata);
        const zoneFeatures = zoneMapData.features;
        zoneFeatures.forEach(x => this.features.push(x));
      }
    });

    let selected_zones_ids = this.filterData.selectedZones.map(zone => {
      return zone.id;
    });

    this.jobs.forEach((job: any) => {
      if (job.mapdata &&
        selected_zones_ids.indexOf(job.zone_id) != -1 &&
        this.filterData.selectedJobTypes.indexOf(job.job_type) != -1 &&
        this.filterData.selectedJobStatus.indexOf(job.status) != -1) {
        const jobMapData = JSON.parse((job as any).mapdata);
        const jobFeatures = jobMapData.features;
        jobFeatures.forEach(x => this.features.push(x));
      }
    });

    let agent_teams = [];
    let zones_ids_of_teams = [];

    this.filterData.selectedAgents.forEach(type => {
      this.agents.forEach(agent => {
        if (agent.usertype.indexOf(type) != -1) {

          // Get Teams of current agent.
          agent_teams = this.teams.filter(team => {
            // Get team members ids.
            let team_members_ids = team.members.map(member => {
              return JSON.parse(member).id;
            });

            return team_members_ids.indexOf(agent.id) != -1;
          });

          // Get zones of teams.
          zones_ids_of_teams = agent_teams
            .map(team => {
              return team.zone_id;
            })
            .filter(id => id != null);

          if ((agent as Agent).mapdata
            && this.intersect(zones_ids_of_teams, selected_zones_ids).length > 0) {
            const agentMapData = JSON.parse((agent as any).mapdata);
            const agentFeatures = agentMapData.features;
            agentFeatures.forEach(x => this.features.push(x));
          }
        }
      });
    });

    this.mapdata = JSON.stringify(JSON.parse(this.mapdata).features = this.features);
  }

  openFilterDialog() {

    this.initializeMap();

    const dialogRef = this.dialog.open(FilterdialogComponent, {
      width: '1000px',
      data: this.filterData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.filterData.selectedSites = result.selectedSites;
        this.filterData.selectedZones = result.selectedZones;
        this.filterData.selectedAgents = result.selectedAgents;
        this.filterData.selectedJobTypes = result.selectedJobTypes;
        this.filterData.selectedJobStatus = result.selectedJobStatus;

        this.updateMap();
      }

    });
  }

}





