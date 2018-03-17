import { Injectable, Inject } from '@angular/core';
import{Jobtype} from '../classes/jobtype';
import { Observable} from 'rxjs/Observable';
import { HttpClient, HttpHeaders} from '@angular/common/http';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable()
export class JobTypeService {
  private jobTypeUrl = `${this.apiEndpoint}/jobtypes`;

  getJobTypes(): Observable<Jobtype[]> {
    return  this.http.get<Jobtype[]>(this.jobTypeUrl)
      .map(response => response.map(x => new Jobtype(x.id, x.type_name) ));
  }

  constructor(
    private http: HttpClient,
    @Inject('API_ENDPOINT') private apiEndpoint: string
  ) { }
}
