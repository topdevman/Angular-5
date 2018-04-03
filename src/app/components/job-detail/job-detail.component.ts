import {Component, Input, OnInit} from '@angular/core';
import { Job } from '../../classes/job';
import {JobService} from '../../services/job.service';
import {Brand} from '../../classes/brand';
import {Color} from '../../classes/color';
import {Zone} from '../../classes/zone';
import {BrandService} from '../../services/brand.service';
import {ColorService} from '../../services/color.service';
import {ZoneService} from '../../services/zone.service';
import {Jobtype} from '../../classes/jobtype';
import {JobTypeService} from '../../services/jobType.service';

@Component({
  selector: 'app-job-detail',
  templateUrl: './job-detail.component.html',
  styleUrls: ['./job-detail.component.css']
})
export class JobDetailComponent implements OnInit {

  @Input() job: Job;
  brands: Array<Brand>;
  colors: Array<Color>;
  zones: Array<Zone>;
  jobtypes: Array<Jobtype>;
  constructor(private jobService: JobService,
              private brandService: BrandService,
              private colorService: ColorService,
              private zoneService: ZoneService,
              private jobTypeService: JobTypeService,
              ) { }

  ngOnInit() {
    this.brandService.getBrands().subscribe(brands => this.brands = brands);
    this.colorService.getColors().subscribe(colors => this.colors = colors);
    this.zoneService.getZones().subscribe(zones => this.zones = zones );
    this.jobTypeService.getJobTypes().subscribe(jobtypes => this.jobtypes = jobtypes );
  }

  save(): void {
    if (window.confirm('Are sure you want to update this item ?')) {
      this.jobService.updateJob(this.job)
        .subscribe();
    }
  }

}
