import { Component, OnInit, OnChanges, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

import * as moment from 'moment';

import { Brand } from '../../classes/brand';
import { Color } from '../../classes/color';
import { Job } from '../../classes/job';
import { Zone } from '../../classes/zone';

import MapOptions from '../../classes/MapOptions';

import { BrandService } from '../../services/brand.service';
import { ColorService } from '../../services/color.service';
import { JobService } from '../../services/job.service';
import { ZoneService } from '../../services/zone.service';
import { ProjectService } from '../../services/project.service';

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.css']
})
export class JobsComponent implements OnInit, OnChanges {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  jobs: Job[];
  zones: Array<Zone>;
  brands: Array<Brand>;
  colors: Array<Color>;
  selectedJob: Job;
  newJob: Job;
  mapOptions = new MapOptions(true, false, false, { icon: Job.getJobTypeDefaultIcon() },true, {lat: 48.864716, lng: 2.349014});
  jobTypeImagePath: string;

  displayedColumns = [
    'car_licence_plate',
    'car_brand',
    'car_color',
    'custom_job_description',
    'job_type',
    'zone_name',
    'creation',
    'start',
    'end',
    'actions'
  ];
  dataSource: MatTableDataSource<Job>;

  isSimplifiedAddress: boolean = false;

  n_number: string = '';
  n_street: string = '';
  n_city: string = '';
  n_zip: string = '';

  s_street: string = '';
  s_intersection: string = '';


  jobStatusOptions: string[];

  jobTypeOptions: string[];

  constructor(private jobService: JobService,
              private zoneService: ZoneService,
              private brandService: BrandService,
              private colorService: ColorService,
              private projectService: ProjectService) {
  this.jobTypeImagePath = "/assets/job-icons/";
  this.newJob = new Job();
  this.jobTypeOptions = Job.getJobTypes();
  this.jobStatusOptions = Job.getJobStatus();
}

  ngOnInit() {
    this.getJobs();
    this.brandService.getBrands().subscribe(brands => this.brands = brands);
    this.colorService.getColors().subscribe(colors => this.colors = colors);
    this.zoneService.getZones(this.projectService.activeProject).subscribe(zones => this.zones = zones);
  }

  ngOnChanges() {
    this.onJobTypeChanged();
  }

  getJobs(): void {

    this.jobService.getJobs()
      .subscribe(jobs => {
        this.jobs = jobs;
        // Assign the data to the data source for the table to render
        this.featchMatTable(this.jobs);
      });
  }

  onSelect(job: Job): void {
    this.selectedJob = job;
  }

  featchMatTable(jobs: Job[]): void {

    // Assign the data to the data source for the table to render
    let jobsToDisplay = this.jobs.map(job => {

      let cjob = Object.assign({}, job);

      if(cjob.creation) cjob.creation = moment(job.creation).format('MMMM Do YYYY, h:mm:ss a');
      if(cjob.start) cjob.start = moment(job.start).format('MMMM Do YYYY, h:mm:ss a');
      if(cjob.end) cjob.end = moment(job.end).format('MMMM Do YYYY, h:mm:ss a');

      return cjob;
    });

    this.dataSource = new MatTableDataSource(jobsToDisplay);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.selectedJob = this.jobs ? this.jobs[0] : null;
  }

  trimObject(obj: any) {
    for (const key of Object.keys(obj)) {
      if (obj[key] && (typeof obj[key] === 'string')) {
        obj[key] = obj[key].trim();
      }
    }
  }

  add() {
    if(this.isSimplifiedAddress) {
      this.newJob.address = null;
      this.newJob.address_simplified = JSON.stringify({
        street: this.s_street,
        intersection: this.s_intersection
      });

    } else {
      this.newJob.address_simplified = null;
      this.newJob.address = JSON.stringify({
        number: this.n_number,
        street: this.n_street,
        city: this.n_city,
        zip: this.n_zip
      });
    }

    if(this.newJob.zone_name) {
      let zone = this.zones.find(zone => {
        return zone.name == this.newJob.zone_name;
      });
      this.newJob.zone_id = zone.id;
    }

    this.jobService.addJob(this.newJob)
    .subscribe(user => {
      this.getJobs();
    });

    this.newJob = new Job();

    this.n_number = '';
    this.n_street = '';
    this.n_city = '';
    this.n_zip = '';

    this.s_street = '';
    this.s_intersection = '';
  }

  delete(job: Job): void {
    if (window.confirm('Are sure you want to delete this item ?')) {
      this.jobService.deleteJob(job).subscribe(result => {
        const index = this.jobs.map(item => item.id).indexOf(job.id);
        if (index > -1) {
          this.jobs.splice(index, 1);
          this.featchMatTable(this.jobs);
        }
      });
    }
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }


  onJobMapDataChanged(mapdata: string) {
    this.newJob.mapdata = mapdata;
  }


  onJobTypeChanged() {
    if(this.newJob && this.newJob.job_type) {
      this.jobStatusOptions = Job.getJobStatusByJobType(this.newJob.job_type);
    }
  }
}

