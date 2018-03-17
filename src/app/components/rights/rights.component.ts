import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import {ProjectService} from '../../services/project.service';
import {Project} from '../../classes/project';
import {Site} from '../../classes/site';
import {FormControl} from '@angular/forms';
import {UserTypeService} from "../../services/userType.service";
import {UserType} from "../../classes/userType";
import {UserService} from "../../services/user.service";
import {User} from "../../classes/user";
import {AccessRightsService} from "../../services/accessRights.service";
import {Observable} from 'rxjs/Observable';
import {startWith} from 'rxjs/operators/startWith';
import {map} from 'rxjs/operators/map';

@Component({
  selector: 'app-rights',
  templateUrl: './rights.component.html',
  styleUrls: ['./rights.component.css']
})
export class RightsComponent implements OnInit {

  projects: Project[];
  selectedProject: Project;
  selectedRightsProject: Project;
  sites: any[];
  siteRights: any[];
  selectedSite: any;
  selectedRightsSite: any;
  userTypes: UserType[];
  selectedUserType: UserType;
  users: User[];
  allUsers: User[];
  AllSitesSelected: boolean;
  AllRightsSitesSelected: boolean;
  AllUsersSelected: boolean;
  toggleAllViewRights: boolean;
  toggleAllEditRights: boolean;
  rights: any;
  selectedRights: any = {};
  usersCtrl: FormControl;
  filteredUsers: User[] = [];

  accessRights: any[];
  baseUrl: string = this.apiEndpoint + '/';

  constructor(
      private projectService: ProjectService,
      private userTypeService: UserTypeService,
      private userService: UserService,
      private accessRightsService: AccessRightsService,
      @Inject('API_ENDPOINT') private apiEndpoint: string
  ) {}

  selectProject(): void {
    this.AllSitesSelected = false;
    if (this.selectedProject) {
      this.selectedProject.sites.map(item => item.selected = false);
      this.sites = this.selectedProject.sites || [];
    }
  }

  selectRightsProject(): void {
    if (this.selectedRightsProject) {
      this.siteRights = this.selectedRightsProject.sites || [];
    }
  }

  isSitesAvailable = () => (this.selectedProject && this.selectedProject.sites && this.selectedProject.sites.length);
  isRightsSitesAvailable = () => (this.selectedRightsProject && this.selectedRightsProject.sites && this.selectedRightsProject.sites.length);
  areUsersSelected = () => {
    if (this.users && this.users.length) {
      const selectedUsers = this.users.filter(item => item.selected).map(item => item.id);
      return selectedUsers && selectedUsers.length;
    }
    return false;
  };
  areRightsSitesSelected = () => {
    if (this.siteRights && this.siteRights.length) {
      const selectedSites = this.siteRights.filter(item => item.selected).map(item => item.id);
      return selectedSites && selectedSites.length;
    }
    return false;
  };

  selectSite(site: Site): void {
    this.clearRightsManagement();
    this.selectedSite = site;
  }

  selectUserType(userType: UserType): void {
    this.selectedUserType = userType;
    this.clearRightsManagement();
    if (this.allUsers && this.allUsers.length) {
      this.users = this.allUsers.filter(item => this.selectedUserType.nametype === item.usertype);
    }
  }

  toggleSelection(index): void {
    this.clearRightsManagement();
    if (this.sites[index]) {
      this.sites[index].selected = !this.sites[index].selected;
    }
    this.getUsersBySelectedSites();
  }

  toggleRightsSelection(index): void {
    if (this.siteRights[index]) {
      this.siteRights[index].selected = !this.siteRights[index].selected;
    }
    this.selectRightsSite();
  }

  toggleAll(): void {
    this.AllSitesSelected = !this.AllSitesSelected;
    this.sites.map(item => {
      item.selected = this.AllSitesSelected;
    });
    this.getUsersBySelectedSites();
  }

  toggleAllRightsSite(): void {
    this.AllRightsSitesSelected = !this.AllRightsSitesSelected;
    this.siteRights.map(item => {
      item.selected = this.AllRightsSitesSelected;
    });
    this.selectRightsSite();
  }

  toggleSelectionUsers(index): void {
    this.clearRightsManagement();
    if (this.users[index]) {
      this.users[index].selected = !this.users[index].selected;
    }
  }

  toggleAllUsers(): void {
    this.clearRightsManagement();
    this.AllUsersSelected = !this.AllUsersSelected;
    this.users.map(item => {
      item.selected = this.AllUsersSelected;
    });
  }

  clearRightsManagement = () => {
    this.selectedRights = {};
    this.selectedRightsSite = null;
    this.selectedRightsProject = null;
  };

  getUsersBySelectedSites() {
    this.selectedUserType = null;
    const selectedSites = this.sites.filter(item => item.selected).map(item => item.id);
    this.userService.getUsersBySites(selectedSites).subscribe(users => {
      this.allUsers = users;
      this.users = [];
    });
  }

  selectRightsSite() {
    const selectedUsers = this.users.filter(item => item.selected).map(item => item.id);
    const selectedSites = this.siteRights.filter(item => item.selected).map(item => item.id);
    this.selectedRights = {};
    this.accessRightsService.getAccessRights(selectedSites, selectedUsers)
        .subscribe(rights => {
          rights = rights || [];
          rights.forEach(item => {
            if (item && item.rights && item.rights.length) {
              item.rights.forEach(right => this.selectedRights[right] = true);
            }
          });
        });
  }

  saveRights() {
    if (window.confirm('Are sure you want to save updated Access rights ?')) {
      const selectedUsers = this.users.filter(item => item.selected).map(item => item.id);
      const selectedSites = this.siteRights.filter(item => item.selected).map(item => item.id);
      const selectedRights = [];
      Object.keys(this.selectedRights).forEach(key => {
        if (this.selectedRights[key]) {
          selectedRights.push(key);
        }
      });
      this.accessRightsService.setAccessRights(selectedSites, selectedUsers, selectedRights)
        .subscribe(() => {
        });
    }
  }

  onRightsChange(rightName: string, isChecked: boolean): void {
    this.selectedRights[rightName] = isChecked;
  }

  toggleEditRight(accessRight: any, isChecked: boolean): void {
    if (!isChecked) {
      this.selectedRights[accessRight.viewName] = true;
    }
  }

  toggleAllRights(accessRightName: string, isChecked: boolean): void {
    if (accessRightName === 'view') {
      this.accessRights.forEach(right => {
        this.selectedRights[right.viewName] = !isChecked;
      });
    } else if (accessRightName === 'edit') {
      this.accessRights.forEach(right => {
        this.selectedRights[right.editName] = !isChecked;
        if (!isChecked) {
          this.selectedRights[right.viewName] = true;
          this.toggleAllViewRights = true;
        }
      });
    }
  }

  selectSpecificUser(user: User) {
    this.users = [];
    user.selected = true;
    this.users.push(user);
  }

  ngOnInit(): void {
    this.accessRights = this.accessRightsService.ACCESS_RIGHTS;
    this.usersCtrl = new FormControl();
    this.usersCtrl.valueChanges.subscribe(name => {
      this.userService.searchByUsername(name).subscribe(data => {
        this.filteredUsers = data || [];
      });
    });
    this.projectService.getProjects()
        .subscribe(projects => {
          this.projects = projects;
        });
    this.userTypeService.getUserTypes().subscribe(userTypes => {
      this.userTypes = userTypes;
    });
  }
}
