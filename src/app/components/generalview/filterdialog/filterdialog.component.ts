import { Component, OnInit, Inject } from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';

import * as _ from 'underscore';

import { Site } from './../../../classes/site';
import { Zone } from './../../../classes/zone';
import { Agent } from './../../../classes/agent';
import { Job } from './../../../classes/job';

@Component({
  selector: 'app-filterdialog',
  templateUrl: './filterdialog.component.html',
  styleUrls: ['./filterdialog.component.css']
})
export class FilterdialogComponent implements OnInit {

  siteDisplayedColumns = ['selectSite', 'nameSite'];
  siteDataSource:any ;
  siteSelection:any ;

  zoneDisplayedColumns = ['selectZone', 'nameZone'];
  zoneDataSource:any ;
  zoneSelection:any ;

  agentDisplayedColumns = ['selectAgent', 'nameAgent'];
  agentDataSource:any ;
  agentSelection:any ;

  jobTypesDisplayedColumns = ['selectJobType', 'nameJobType'];
  jobTypesDataSource:any ;
  jobTypesSelection:any ;

  jobStatusDisplayedColumns = ['selectJobStatus', 'nameJobStatus'];
  jobStatusDataSource:any ;
  jobStatusSelection:any ;

  constructor(
    public dialogRef: MatDialogRef<FilterdialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    }

  ngOnInit() {
    this.siteDataSource = new MatTableDataSource<Site>(this.data.sites);
    this.siteSelection = new SelectionModel<Site>(true, this.data.selectedSites);

    this.zoneDataSource = new MatTableDataSource<Zone>(this.data.zones);
    this.zoneSelection = new SelectionModel<Zone>(true, this.data.selectedZones);

    this.agentDataSource = new MatTableDataSource<string>(this.data.agents);
    this.agentSelection = new SelectionModel<string>(true, this.data.selectedAgents);

    this.jobTypesDataSource = new MatTableDataSource<string>(this.data.jobTypes);
    this.jobTypesSelection = new SelectionModel<string>(true, this.data.selectedJobTypes);

    this.jobStatusDataSource = new MatTableDataSource<string>(this.data.jobStatus);
    this.jobStatusSelection = new SelectionModel<string>(true, this.data.selectedJobStatus);

    this.crossFilterZoneCalculation();
    this.crossFilterJobStatusCalculation();
  }

  crossFilterZoneCalculation() {
    let selected_sites_ids = this.siteSelection.selected.map((s) => {
      return s.id;
    });

    let dataZones = this.data.zones.filter((z) => {
      return selected_sites_ids.indexOf(z.site_id) !== -1;
    });

    let filtered_zones_ids = dataZones.map((z) => {
      return z.id;
    });

    let dataSelectedZones = this.zoneSelection.selected.filter((z) => {
      return filtered_zones_ids.indexOf(z.id) !== -1;
    });

    this.zoneDataSource = new MatTableDataSource<Zone>(dataZones);
    this.zoneSelection = new SelectionModel<Zone>(true, dataSelectedZones);

  }

  crossFilterJobStatusCalculation() {

    let dataJobStatus = [];

    this.jobTypesSelection.selected.map(jobType => {
      dataJobStatus = dataJobStatus.concat(Job.getJobStatusByJobType(jobType));
    });

    dataJobStatus = _.sortBy(_.uniq(dataJobStatus), function (name) {return name});


    let dataSelectedJobStatus = [];

    dataSelectedJobStatus = this.data.selectedJobStatus.filter((js) => {
      return dataJobStatus.indexOf(js) !== -1;
    });

    this.jobStatusDataSource = new MatTableDataSource<string>(dataJobStatus);
    this.jobStatusSelection = new SelectionModel<string>(true, dataSelectedJobStatus);

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSave() {
    this.dialogRef.close({
      selectedSites: this.siteSelection.selected,
      selectedZones: this.zoneSelection.selected,
      selectedAgents: this.agentSelection.selected,
      selectedJobTypes: this.jobTypesSelection.selected,
      selectedJobStatus: this.jobStatusSelection.selected
    });
  }

  /** Whether the number of selected sites matches the total number of rows. */
  isAllSitesSelected() {
    const numSelected = this.siteSelection.selected.length;
    const numRows = this.siteDataSource.data.length;
    return numSelected === numRows;
  }

  isAllZonesSelected() {
    const numSelected = this.zoneSelection.selected.length;
    const numRows = this.zoneDataSource.data.length;
    return numSelected === numRows;
  }

  isAllAgentsSelected() {
    const numSelected = this.agentSelection.selected.length;
    const numRows = this.agentDataSource.data.length;
    return numSelected === numRows;
  }

  isAllJobTypesSelected() {
    const numSelected = this.jobTypesSelection.selected.length;
    const numRows = this.jobTypesDataSource.data.length;
    return numSelected === numRows;
  }

  isAllJobStatusSelected() {
    const numSelected = this.jobStatusSelection.selected.length;
    const numRows = this.jobStatusDataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggleSite() {
    this.isAllSitesSelected() ?
        this.siteSelection.clear() :
        this.siteDataSource.data.forEach(row => this.siteSelection.select(row));

    this.crossFilterZoneCalculation();
  }

  masterToggleZone() {
    this.isAllZonesSelected() ?
        this.zoneSelection.clear() :
        this.zoneDataSource.data.forEach(row => this.zoneSelection.select(row));
  }

  masterToggleAgent() {
    this.isAllAgentsSelected() ?
        this.agentSelection.clear() :
        this.agentDataSource.data.forEach(row => this.agentSelection.select(row));
  }

  masterToggleJobType() {
    this.isAllJobTypesSelected() ?
        this.jobTypesSelection.clear() :
        this.jobTypesDataSource.data.forEach(row => this.jobTypesSelection.select(row));

    this.crossFilterJobStatusCalculation();
  }

  masterToggleJobStatus() {
    this.isAllJobStatusSelected() ?
        this.jobStatusSelection.clear() :
        this.jobStatusDataSource.data.forEach(row => this.jobStatusSelection.select(row));
  }

  siteSelectionToggle(row) {
    this.siteSelection.toggle(row);
    this.crossFilterZoneCalculation();
  }

  jobTypesSelectionToggle(row) {
    this.jobTypesSelection.toggle(row);
    this.crossFilterJobStatusCalculation();
  }

}





