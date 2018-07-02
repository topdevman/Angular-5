import {Component, Inject, OnInit} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {SiteService} from '../../../services/site.service';
import {Site} from '../../../classes/site';
import {ProjectService} from '../../../services/project.service';

@Component({
  selector: 'app-sites-selector',
  templateUrl: './sites-selector.component.html',
  styleUrls: ['./sites-selector.component.css']
})
export class SitesSelectorComponent implements OnInit {
  sites: any[] = [];
  selectedSites: Site[];

  constructor(
    public dialogRef: MatDialogRef<SitesSelectorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private siteService: SiteService,
    private projectService: ProjectService
  ) { }

  ngOnInit() {
    this.selectedSites = this.data.sites;
    this.projectService.getAvailableSites(this.data.projectId).subscribe(sites => {
      this.sites = sites;
      this.sites.forEach(site => {
        if (this.data.sites.map(item => item.id).indexOf(site.id) > -1) site.selected = true;
      });
    });
  }

  cancelDialog(): void {
    this.dialogRef.close();
  }
  saveSelectedSites(): void {
    this.selectedSites = this.sites.filter(site => site.selected).map(site => {
      return new Site(site.id, site.name, site.address, site.type, site.project_uid, site.mapdata);
    });
    this.dialogRef.close(this.selectedSites);
  }

  toggleSelection(index): void {
    if (this.sites[index]) {
      this.sites[index].selected = !this.sites[index].selected;
    }
  }

}
