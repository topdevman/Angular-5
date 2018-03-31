import {Component, OnInit, ViewChild} from '@angular/core';
import { ZoneService} from '../../services/zone.service';
import { Zone} from '../../classes/zone';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {Site} from '../../classes/site';
import {SiteService} from '../../services/site.service';
import {User} from '../../classes/user';
import {AccessRightsService} from "../../services/accessRights.service";


@Component({
  selector: 'app-zones',
  templateUrl: './zones.component.html',
  styleUrls: ['./zones.component.css']
})

export class ZonesComponent implements OnInit {

  zones: Zone[];
  newZone: Zone = new Zone(null, null, null, null, null, null);
  sites: Array<Site>;
  selectedZone: Zone;

  displayedColumns = ['name',
    'site_name', 'actions'];
  dataSource: MatTableDataSource<Zone>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('table') ngTable;

  getZones(): void {

    this.zoneService.getZones()
      .subscribe(zones => {
        this.zones = zones;
        // Assign the data to the data source for the table to render
        this.featchMatTable(this.zones);
      });
  }

  onSelect(zone: Zone): void {
    this.selectedZone = zone;
  }
  trimObject(obj: any) {
    for (const key of Object.keys(obj)) {
      if (obj[key] && (typeof obj[key] === 'string')) {
        obj[key] = obj[key].trim();
      }
    }
  }
  featchMatTable(zones: Zone[]): void {
    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource(this.zones);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.selectedZone = this.zones ? this.zones[0] : null;
  }
  add(newZone: Zone ): void {
    newZone.id = '';
    this.trimObject(newZone);
    this.zoneService.addZone(newZone)
      .subscribe(user => {
        this.getZones();
        this.newZone = new Zone(null, null, null, null, null, null);
      });
  }

  delete(zone: Zone): void {
    if (window.confirm('Are sure you want to delete this item ?')) {
      this.zoneService.deleteZone(zone).subscribe(result => {
        const index = this.zones.map(item => item.id).indexOf(zone.id);
        if (index > -1) {
          this.zones.splice(index, 1);
          this.featchMatTable(this.zones);
          this.ngTable.select('zonelist');
        }
      });
    }
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }


  constructor(private zoneService: ZoneService,
              private siteService: SiteService,
              private accessRightsService: AccessRightsService
              ) { }

  ngOnInit(): void {
    this.getZones();
    this.siteService.getSites().subscribe(sites => this.sites = sites);

  }


}
