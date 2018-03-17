import { Injectable, Inject } from '@angular/core';
import { Project } from '../classes/project';
import { Observable} from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { HttpClient, HttpHeaders} from '@angular/common/http';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable()
export class ProjectService {

  private projectUrl = `${this.apiEndpoint}/projects`;

  /** GET zones from the server */
  getProjects(): Observable<Project[]> {
    //noinspection TypeScriptUnresolvedFunction
    return  this.http.get<Project[]>(this.projectUrl)
      .map(response => response.map(x => new Project(x.name, x.sites, x.id) ));
  }
  /** GET zones from the server */
  getAvailableSites(id: string): Observable<any[]> {
    let url = `${this.projectUrl}/availableSites`;
    if (id) {
      url += `?id=${id}`;
    }
    return  this.http.get<any[]>(url)
      .map(response => response.map(x => {
        return {
          id: x.id,
          name: x.name
        };
      } ));
  }
  /** PUT: update the Project on the server */
  updateProject (project: Project): Observable<any> {
    //noinspection TypeScriptUnresolvedFunction
    return this.http.put(this.projectUrl, project, httpOptions);
  }

  /** POST: add a new Project to the server */
  addProject (project: Project): Observable<Project> {
    //noinspection TypeScriptUnresolvedFunction
    return this.http.post<Project>(this.projectUrl, project, httpOptions);
  }

  /** DELETE: delete the Project from the server */
  deleteProject (project: Project | string): Observable<Project> {
    const id = typeof project === 'string' ? project : project.id;
    const url = `${this.projectUrl}?id=${id}`;

    return this.http.delete<Project>(url, httpOptions);
  }

  constructor(
    private http: HttpClient,
    @Inject('API_ENDPOINT') private apiEndpoint: string
  ) { }
}
