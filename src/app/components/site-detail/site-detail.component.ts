import {Component, Input, OnInit} from '@angular/core';
import { Site } from '../../classes/site';
import {Location} from '@angular/common';
import {ActivatedRoute} from '@angular/router';
import {SiteService} from '../../services/site.service';
import {Project} from "../../classes/project";
import {AccessRightsService} from "../../services/accessRights.service";

@Component({
  selector: 'app-site-detail',
  templateUrl: './site-detail.component.html',
  styleUrls: ['./site-detail.component.css']
})
export class SiteDetailComponent implements OnInit {

  @Input() site: Site;
  @Input() projects: Project[];
  sitetypes = [
    {value: 'ON-STREET', viewValue: 'ON-STREET'},
    {value: 'OFF-STREET', viewValue: 'OFF-STREET'}
  ];

  constructor(private siteService: SiteService,
              private route: ActivatedRoute,
              private location: Location,
              private accessRightsService: AccessRightsService
  ) { }

  ngOnInit() {
  }

  goBack(): void {
    this.location.back();
  }

  save(): void {
    if (window.confirm('Are sure you want to update this item ?')) {
      console.log(this.site);
      this.siteService.updateSite(this.site)
        .subscribe();
    }
  }

}
