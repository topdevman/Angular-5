import { Component, OnInit, ViewChild } from '@angular/core';
import { JobService } from '../../services/job.service';
import {Job} from '../../classes/job';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {Zone} from '../../classes/zone';
import {ZoneService} from '../../services/zone.service';
import {Brand} from '../../classes/brand';
import {Color} from '../../classes/color';
import {BrandService} from '../../services/brand.service';
import {ColorService} from '../../services/color.service';
import {Jobtype} from '../../classes/jobtype';
import {JobTypeService} from '../../services/jobType.service';




@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.css']
})
export class JobsComponent implements OnInit {

  jobs: Job[];
  zones: Array<Zone>;
  brands: Array<Brand>;
  colors: Array<Color>;
  jobtypes: Array<Jobtype>;
  selectedJob: Job;
  newJob: Job = new Job (null, null, null, null, null, null, null, null, null, null, null, null, null, null);
  displayedColumns = ['car_licence_plate',
    'car_brand',
    'car_color',
    'custom_job_description',
    'job_type',
    'creation',
    'start',
    'end',
    'taker_first_name',
    'zone_name',
    'latitude',
    'longitude',
    'actions'
    ];
  dataSource: MatTableDataSource<Job>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

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
    this.dataSource = new MatTableDataSource(this.jobs);
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

  add(newJob: Job) {
    newJob.id = '';
    this.trimObject(newJob);
    this.jobService.addJob(newJob)
      .subscribe(user => {
        this.getJobs();
      });
    this.newJob = null;
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

  constructor(private jobService: JobService,
              private zoneService: ZoneService,
              private brandService: BrandService,
              private colorService: ColorService,
              private jobTypeService: JobTypeService,
              ) { }

  ngOnInit() {
    this.getJobs();
    this.brandService.getBrands().subscribe(brands => this.brands = brands);
    this.colorService.getColors().subscribe(colors => this.colors = colors);
    this.zoneService.getZones().subscribe(zones => this.zones = zones);
    this.jobTypeService.getJobTypes().subscribe(jobtypes => this.jobtypes = jobtypes);
  }

}
