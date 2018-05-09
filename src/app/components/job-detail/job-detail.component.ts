import { Component, Input, OnInit, Inject, OnChanges } from '@angular/core';

import { FormControl } from '@angular/forms';

import { Observable } from 'rxjs/Observable';
import { startWith } from 'rxjs/operators/startWith';
import { map } from 'rxjs/operators/map';

import * as moment from 'moment';

import { Job } from '../../classes/job';
import { Brand } from '../../classes/brand';
import { Color } from '../../classes/color';
import { Zone } from '../../classes/zone';
import { User } from '../../classes/user';

import MapOptions from '../../classes/MapOptions';

import { JobService } from '../../services/job.service';
import { BrandService } from '../../services/brand.service';
import { ColorService } from '../../services/color.service';
import { ZoneService } from '../../services/zone.service';
import { UserService } from '../../services/user.service';
import { ProjectService } from '../../services/project.service';

@Component({
  selector: 'app-job-detail',
  templateUrl: './job-detail.component.html',
  styleUrls: ['./job-detail.component.css']
})
export class JobDetailComponent implements OnInit, OnChanges {

  @Input() job: Job;

  brands: Array<Brand>;
  colors: Array<Color>;
  zones: Array<Zone>;
  mapOptions = new MapOptions(true, false, false, { icon: Job.getJobTypeDefaultIcon() }, true, {lat: 48.864716, lng: 2.349014});
  jobTypeImagePath: string;

  takerCtrl: FormControl;
  filteredTakers: Observable<any[]>;
  takers: Array<User> = [];
  selectedTaker: User;

  baseUrl: string = this.apiEndpoint + '/';

  isSimplifiedAddress = false;

  n_number: string = '';
  n_street: string = '';
  n_city: string = '';
  n_zip: string = '';

  s_street: string = '';
  s_intersection: string = '';

  jobStatusOptions: string[];

  jobTypeOptions: string[];

  jobCreation: string = '';
  jobStart: string = '';
  jobEnd: string = '';


  jobPictures: string[] = [
    'https://www.toyota.com/imgix/responsive/images/mlp/colorizer/2018/sienna/1D6/1.png?q=85&fm=jpg&w=1024&fit=max&cs=strip&bg=fff',
    'https://www.toyota.com/imgix/responsive/images/mlp/colorizer/2018/sienna/1D6/3.png?q=85&fm=jpg&w=1024&fit=max&cs=strip&bg=fff',
    'https://www.toyota.com/imgix/responsive/images/mlp/colorizer/2018/sienna/1D6/4.png?q=85&fm=jpg&w=1024&fit=max&cs=strip&bg=fff'
  ];

  constructor(private jobService: JobService,
              private brandService: BrandService,
              private colorService: ColorService,
              private zoneService: ZoneService,
              private userService: UserService,
              private projectService: ProjectService,
              @Inject('API_ENDPOINT') private apiEndpoint: string
            ) {

    this.jobTypeImagePath = '/assets/job-icons/';
    this.jobTypeOptions = Job.getJobTypes();
    this.jobStatusOptions = Job.getJobStatus();

    this.takerCtrl = new FormControl();

    this.filteredTakers = this.takerCtrl.valueChanges
    .pipe(
      startWith(''),
      map((username) => this.filterTakers(username))
    );
  }

  ngOnInit() {
    this.brandService.getBrands().subscribe(brands => this.brands = brands);
    this.colorService.getColors().subscribe(colors => this.colors = colors);
    this.zoneService.getZones().subscribe(zones => this.zones = zones );

    this.userService.getUsersByType('Driver', this.projectService.activeProject).subscribe(users => {
      this.takers = this.takers.concat(users);
    });

    this.userService.getUsersByType('Enforcer', this.projectService.activeProject).subscribe(users => {
      this.takers = this.takers.concat(users);
    });

  }

  ngOnChanges() {
    if (this.job && this.job.address_simplified) {
      this.isSimplifiedAddress = true;
      let address_simplified = JSON.parse(this.job.address_simplified);

      if(address_simplified) {
        this.s_street = address_simplified.street;
        this.s_intersection = address_simplified.intersection;
      }
    }

    if (this.job && this.job.address) {
      this.isSimplifiedAddress = false;
      let address = JSON.parse(this.job.address);

      if(address) {
        this.n_number = address.number;
        this.n_street = address.street;
        this.n_city = address.city;
        this.n_zip = address.zip;
      }
    }

    if (this.job) {
      this.jobCreation = moment(this.job.creation).format('MMMM Do YYYY, h:mm:ss a');
      this.jobStart = this.job.start;
      this.jobEnd = this.job.end;
    }

    this.onJobTypeChanged();
  }

  filterTakers(username: string) {
    if (username === '') return [];

    let condition = 'Driver';

    if (this.job.job_type === 'CLAMP JOB' || this.job.job_type === 'DE-CLAMP JOB') {
      condition = 'Enforcer';
    }
    return this.takers.filter(taker => {
      return  taker.usertype === condition &&
              taker.username.toLowerCase().indexOf(username.toLowerCase()) === 0;
    });
  }

  selectTaker($event) {
    this.selectedTaker = this.takers.find(taker => {
      return taker.username === $event.option.value;
    });
  }

  displayUsername(username) {
    if (username) {
      return username;
    } else {
      return this.job.taker_username ? this.job.taker_username: '';
    }
  }

  save(): void {

    if (this.selectedTaker) {

      this.job.taker_username = this.selectedTaker.username;
    }

    if(this.isSimplifiedAddress) {
      this.job.address = null;
      this.job.address_simplified = JSON.stringify({
        street: this.s_street,
        intersection: this.s_intersection
      });

    } else {
      this.job.address_simplified = null;
      this.job.address = JSON.stringify({

        number: this.n_number,
        street: this.n_street,
        city: this.n_city,
        zip: this.n_zip
      });
    }

    if(this.job.zone_name) {
      let zone = this.zones.find(zone => {
        return zone.name == this.job.zone_name;
      });
      this.job.zone_id = zone.id;
    }

    if (window.confirm('Are sure you want to update this item ?')) {
      this.jobService.updateJob(this.job)
        .subscribe();
    }
  }

  onJobMapDataChanged(mapdata: string) {
    this.job.mapdata = mapdata;
  }

  onJobStartDatetimeChanged(datetime: string) {
    this.job.start = datetime;
  }

  onJobEndDatetimeChanged(datetime: string) {
    this.job.end = datetime;
  }

  onJobTypeChanged() {
    if(this.job && this.job.job_type) {
      this.jobStatusOptions = Job.getJobStatusByJobType(this.job.job_type);
    }

  }
}

