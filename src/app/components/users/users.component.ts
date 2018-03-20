import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { User } from '../../classes/user';
import { UserService} from '../../services/user.service';
import {UserTypeService} from '../../services/userType.service';
import {Address} from '../../classes/address';
import {MatPaginator, MatSort, MatTableDataSource, MatDialog, MatDialogRef} from '@angular/material';
import {UserType} from '../../classes/userType';
import {TeamsService} from '../../services/teams.service';
import {Team} from '../../classes/team';
import {SiteService} from '../../services/site.service';
import {Site} from '../../classes/site';
import {AvatarEditorComponent} from '../modals/avatar-editor/avatar-editor.component';
import {AccessRightsService} from "../../services/accessRights.service";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  @ViewChild('table') ngTable;
  users: User[];
  newUser: User = new User(null, null, null, null, null, null, null,
    null, new Address(null, null, null, null), null );
  userTypes: Array<UserType>;
  sites: Array<Site>;
  associatedSites: Array<Site>;
  teams: Array<Team>;
  selectedUser: User;
  dialogRef: MatDialogRef<AvatarEditorComponent>;
  baseUrl: string = this.apiEndpoint + '/';
  imageUrl: string;
  errorMessage: string;

  displayedColumns = ['username',
    'first_name',
    'last_name',
    'entitle',
    'usertype',
    'zonerights',
    'street',
    'zip_code',
    'city',
    'state', 'actions'];
  dataSource: MatTableDataSource<User>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  states: any[] = [
    {
      name: 'Arkansas',
      population: '2.978M',
      // https://commons.wikimedia.org/wiki/File:Flag_of_Arkansas.svg
      flag: 'https://upload.wikimedia.org/wikipedia/commons/9/9d/Flag_of_Arkansas.svg'
    },
    {
      name: 'California',
      population: '39.14M',
      // https://commons.wikimedia.org/wiki/File:Flag_of_California.svg
      flag: 'https://upload.wikimedia.org/wikipedia/commons/0/01/Flag_of_California.svg'
    },
    {
      name: 'Florida',
      population: '20.27M',
      // https://commons.wikimedia.org/wiki/File:Flag_of_Florida.svg
      flag: 'https://upload.wikimedia.org/wikipedia/commons/f/f7/Flag_of_Florida.svg'
    },
    {
      name: 'Texas',
      population: '27.47M',
      // https://commons.wikimedia.org/wiki/File:Flag_of_Texas.svg
      flag: 'https://upload.wikimedia.org/wikipedia/commons/f/f7/Flag_of_Texas.svg'
    }
  ];

  constructor(
      private userService: UserService,
      private userTypeService: UserTypeService,
      private siteService: SiteService,
      private teamsService: TeamsService,
      private dialog: MatDialog,
      @Inject('API_ENDPOINT') private apiEndpoint: string,
      private accessRightsService: AccessRightsService
  ) {

  }

  getUsers(): void {
    this.userService.getUsers()
      .subscribe(users => {
        this.users = users;
        this.featchMatTable(this.users);
      });
  }

  onSelect(user: User): void {
    this.imageUrl = user.picture;
    this.selectedUser = user;
  }

  featchMatTable(users: User[]): void {
    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource(this.users);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.selectedUser = this.users ? this.users[0] : null;
  }


  trimObject(obj: any) {
    for (const key of Object.keys(obj)) {
      if (obj[key] && (typeof obj[key] === 'string')) {
        obj[key] = obj[key].trim();
      }
    }
  }


  add() {
    this.errorMessage = null;
    this.newUser.id = '';
    this.trimObject(this.newUser);
    this.trimObject(this.newUser.address);
    this.userService.addUser(this.newUser)
      .subscribe(user => {
        this.getUsers();
        this.newUser = new User(null, null, null, null, null, null, null,
            null, new Address(null, null, null, null), null );
        this.ngTable.select('userlist');
      }, err => {
        this.errorMessage = err.error.message;
      });
  }

  delete(user: User): void {
    if (window.confirm('Are sure you want to delete this item ?')) {
      this.userService.deleteUser(user).subscribe(result => {
        const index = this.users.map(item => item.id).indexOf(user.id);
        if (index > -1) {
          this.users.splice(index, 1);
          this.featchMatTable(this.users);
        }
      });
    }
  }


  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
  openDialog(): void {
    this.dialogRef = this.dialog.open(AvatarEditorComponent, {
      width: '40%',
      data: {
        imageUrl: this.newUser.picture
      }
    });

    this.dialogRef.afterClosed().subscribe(result => {
      this.newUser.picture = result.url || null;
    });
  }

  ngOnInit(): void {
    this.getUsers();
    this.userTypeService.getUserTypes().subscribe(userTypes => this.userTypes = userTypes);
    this.siteService.getSites().subscribe(sites => {
      this.sites = sites;
      this.associatedSites = sites;
    });
    this.teamsService.getTeamsByType().subscribe(teams => this.teams = teams);
  }
}
