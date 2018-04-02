import {Component, Input, OnInit} from '@angular/core';
import { Zone } from '../../classes/zone';
import {Location} from '@angular/common';
import {ActivatedRoute} from '@angular/router';
import {ZoneService} from '../../services/zone.service';
import {SiteService} from '../../services/site.service';
import {Site} from '../../classes/site';
import {AccessRightsService} from "../../services/accessRights.service";

@Component({
  selector: 'app-zone-detail',
  templateUrl: './zone-detail.component.html',
  styleUrls: ['./zone-detail.component.css']
})
export class ZoneDetailComponent implements OnInit {

  @Input() zone: Zone;
  sites: Array<Site>;

  constructor(private zoneService: ZoneService,
              private siteService: SiteService,
              private accessRightsService: AccessRightsService
              ) { }

  ngOnInit() {
    this.siteService.getSites().subscribe(sites => this.sites = sites);
  }

  save(): void {
    if (window.confirm('Are sure you want to update this item ?')) {
      this.zoneService.updateZone(this.zone)
        .subscribe();
    }
  }

}
