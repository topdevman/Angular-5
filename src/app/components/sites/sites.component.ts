import {Component, OnInit, ViewChild} from '@angular/core';
import { SiteService} from '../../services/site.service';
import { Site } from '../../classes/site';
import {Address} from '../../classes/address';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {ProjectService} from "../../services/project.service";
import {Project} from "../../classes/project";
import {AccessRightsService} from "../../services/accessRights.service";
import {OptionsMap} from '../mapview/MapOptions';



@Component({
  selector: 'app-sites',
  templateUrl: './sites.component.html',
  styleUrls: ['./sites.component.css']
})
export class SitesComponent implements OnInit {

  sites: Site[];
  projects: Project[];
  selectedSite: Site;
  newSite: Site = new Site(null, null, new Address(null, null, null, null), null, null);
  mapOptions = new OptionsMap(true, true, true, false, {lat: 48.864716, lng: 2.349014});
  displayedColumns = ['name',
    'street',
    'zip_code',
    'city',
    'state',
    'type',
    'actions'];
  sitetypes = [
    {value: 'ON-STREET', viewValue: 'ON-STREET'},
    {value: 'OFF-STREET', viewValue: 'OFF-STREET'}
  ];
  dataSource: MatTableDataSource<Site>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('table') ngTable;
  getSites(): void {

    this.siteService.getSites()
      .subscribe(sites => {
        this.sites = sites;
        // Assign the data to the data source for the table to render
        this.featchMatTable(this.sites);
      });
  }

  onSelect(site: Site): void {
    this.selectedSite = site;
  }

  featchMatTable(sites: Site[]): void {
    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource(this.sites);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.selectedSite = this.sites ? this.sites[0] : null;
  }

  trimObject(obj: any) {
    for (const key of Object.keys(obj)) {
      if (obj[key] && (typeof obj[key] === 'string')) {
        obj[key] = obj[key].trim();
      }
    }
  }

  add(newSite: Site): void {
    newSite.id = '';
    this.trimObject(newSite);
    this.trimObject(newSite.address);
    console.log(newSite);
    this.siteService.addSite(newSite)
      .subscribe(site => {
        this.getSites();
        this.newSite = new Site(null, null, new Address(null, null, null, null), null, null);
        this.ngTable.select('sitelist');
      });
  }

  delete(site: Site): void {
    if (window.confirm('Are sure you want to delete this item ? ' + site.name)) {
      this.siteService.deleteSite(site).subscribe(result => {
        const index = this.sites.map(item => item.id).indexOf(site.id);
        if (index > -1) {
          this.sites.splice(index, 1);
          this.featchMatTable(this.sites);
        }
      });
    }
  }


  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
  constructor(
      private siteService: SiteService,
      private projectService: ProjectService,
      private accessRightsService: AccessRightsService
  ) { }

  ngOnInit() {
    this.getSites();
    this.projectService.getProjects()
        .subscribe(projects => {
          this.projects = projects;
        });
  }

}
