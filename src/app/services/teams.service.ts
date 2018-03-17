import { Injectable, Inject } from '@angular/core';
import { Team} from '../classes/team';
import { Observable} from 'rxjs/Observable';
import { HttpClient, HttpHeaders} from '@angular/common/http';

import 'rxjs/add/operator/map';



const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable()
export class TeamsService {

  private teamsUrl = `${this.apiEndpoint}/teams`;

  constructor(
    private http: HttpClient,
    @Inject('API_ENDPOINT') private apiEndpoint: string
  ) { }

  /** GET teams List */
  getTeamsByType(): Observable<Team[]> {
    return  this.http.get<Team[]>(`${this.teamsUrl}`)
      .map(response => response.map(item => new Team(item.id, item.typeteam, item.members)));
  }

  /** PUT: update the user on the server */
  updateTeams (teams: Team[]): Observable<any> {
    return this.http.put(`${this.teamsUrl}/bulk`, teams, httpOptions);
  }

  /** DELETE: delete team from db */
  deleteTeam (id: string): Observable<any> {
    return this.http.delete(`${this.teamsUrl}?id=${id}`, httpOptions);
  }

}
