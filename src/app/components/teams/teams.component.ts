import {Component, OnInit} from '@angular/core';
import {UserTypeService} from '../../services/userType.service';
import {UserType} from '../../classes/userType';
import {TeamsService} from '../../services/teams.service';
import {Team} from '../../classes/team';
import {UserService} from '../../services/user.service';
import {User} from '../../classes/user';
import {AccessRightsService} from "../../services/accessRights.service";


@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.css']
})
export class TeamsComponent implements OnInit {

  users: Array<string> = [];
  _users: Array<User> = [];

  teams: Array<Team> = [];
  _teams: Array<Team> = [];
  ALLOWED_USER_TYPES = ['driver', 'enforcer', 'clamper'];

  selectedTeam: Team;

  searchKey: string;
  teamMode = 'select';
  teamName: string;
  userTypes: UserType[];
  selectedUserType: UserType;

  constructor(private userTypeService: UserTypeService,
              private teamsService: TeamsService,
              private userService: UserService,
              private accessRightsService: AccessRightsService
  ) { }


  toTeamSection() {
    if (this.selectedUserType && this.selectedUserType.nametype !== '') {
      this.teams = this._teams.filter(team => team.typeteam === this.selectedUserType.nametype);
      this.teamMode = 'select';
      this.selectedTeam = null;
      this.userService.getUsersByType(this.selectedUserType.nametype).subscribe(users => {
        this._users = users;
      });
    }
  }

  toTeamAdd() {
    this.teamMode = 'add';
  }

  showTeamInfo(team: any) {
    this.selectedTeam = team;
    this.users = this.getFilteredUsers();
  }

  getFilteredUsers(): Array<string> {
    return this._users.map(item => `${item.first_name} ${item.last_name}`).filter(item => {
      let alreadyAffected;
      alreadyAffected = this.teams.some(teamItem => {
        return teamItem && teamItem.members && teamItem.members.indexOf(item) > -1;
      });
      return !alreadyAffected;
    });
  }

  SaveNewTeam(teamName: string) {
    const newTeam: Team = {id: teamName, typeteam: this.selectedUserType.nametype, members: []};
    this._teams.push(newTeam);
    this.teamName = '';
    this.toTeamSection();
    this.selectedTeam = newTeam;
    this.showTeamInfo(this.selectedTeam);
  }

  doUsersSearch(searchKey: string) {
    this.users = this.getFilteredUsers().filter((item) => {
      if (searchKey) {
        const regExp = new RegExp('\\b' + searchKey, 'gi');
        return regExp.test(item);
      } else {
        return true;
      }
    });
  }

  submitChanges () {
    this.teamsService.updateTeams(this.teams).subscribe(result => console.log(result));
  }

  deleteSelectedTeam(){
    if(window.confirm('Are sure you want to delete this item ?')){
     this.teamsService.deleteTeam(this.selectedTeam.id).subscribe(result => {
       var index = this.teams.map(team => team.id).indexOf(this.selectedTeam.id);
       if (index > -1) {
         this.teams.splice(index, 1);
       }
       var _index = this._teams.map(team => team.id).indexOf(this.selectedTeam.id);
       if (_index > -1) {
         this._teams.splice(_index, 1);
       }
       this.showTeamInfo(null);
     })
    }
  }

  ngOnInit() {
    this.selectedUserType = new UserType('', [], []);
    this.userTypeService.getUserTypes().subscribe(userTypes => this.userTypes = userTypes.filter(item => this.ALLOWED_USER_TYPES.indexOf(item.nametype ? item.nametype.toLowerCase():'')>-1));
    this.teamsService.getTeamsByType().subscribe(teams => {
      teams = teams || [];
      this._teams = teams.map((item: Team) => {
        if (item) {
          item.members = item.members || [];
        }
        return item;
      });
    });
  }

}
