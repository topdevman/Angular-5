import { Component,Inject, OnInit, Input } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { User} from '../../classes/user';
import { UserService} from '../../services/user.service';
import {UserType} from '../../classes/userType';
import {UserTypeService} from '../../services/userType.service';
import {Team} from '../../classes/team';
import {TeamsService} from '../../services/teams.service';
import {SiteService} from '../../services/site.service';
import {Site} from '../../classes/site';
import { Ng2FileInputService, Ng2FileInputAction } from 'ng2-file-input';
import { Ng2ImgMaxService } from 'ng2-img-max';
import {UploadService} from '../../services/upload.service';
import {AvatarEditorComponent} from '../modals/avatar-editor/avatar-editor.component';
import {MatDialog, MatDialogRef} from '@angular/material';
import {AccessRightsService} from "../../services/accessRights.service";

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})



export class UserDetailComponent implements OnInit {

  @Input() user: User;
  @Input() imageUrl: string;
  userTypes: Array<UserType>;
  sites: Array<Site>;
  associatedSites: Array<Site>;
  teams: Array<Team>;
  baseUrl: string = this.apiEndpoint + '/';
  dialogRef: MatDialogRef<AvatarEditorComponent>;

  constructor(private userService: UserService,
              private userTypeService: UserTypeService,
              private siteService: SiteService,
              private teamsService: TeamsService,
              private dialog: MatDialog,
              private accessRightsService: AccessRightsService,
              @Inject('API_ENDPOINT') private apiEndpoint: string
  ) { }

  ngOnInit() {
   this.userTypeService.getUserTypes().subscribe(userTypes => {
     this.userTypes = userTypes;
   });
    this.siteService.getSites().subscribe(sites => {
      this.sites = sites;
      this.associatedSites = sites;
    });
    this.teamsService.getTeamsByType().subscribe(teams => this.teams = teams);
  }

  save(): void {
    if (window.confirm('Are sure you want to update this item ?')) {
      if (this.imageUrl) {
        this.user.picture = this.imageUrl;
      }
      this.userService.updateUser(this.user)
        .subscribe();
    }
  }

  openDialog(): void {
    this.dialogRef = this.dialog.open(AvatarEditorComponent, {
      width: '40%',
      data: {
        imageUrl: this.user.picture
      }
    });

    this.dialogRef.afterClosed().subscribe(result => {
      this.imageUrl = result.url || null;
    });
  }

}
