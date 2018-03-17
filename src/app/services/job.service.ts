import { Injectable, Inject } from '@angular/core';
import { Observable} from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { Job } from '../classes/job';
import { HttpClient, HttpHeaders} from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class JobService {

  private jobsUrl = `${this.apiEndpoint}/jobs`;

  /** GET jobs from the server */
  getJobs(): Observable<Job[]> {
    return  this.http.get<Job[]>(this.jobsUrl)
      .map(response => response.map(x => new Job(x.id, x.car_licence_plate, x.car_brand, x.car_color, x.custom_job_description, x.job_type, x.creation, x.start, x.end, x.taker_first_name, x.zone_name, x.latitude, x.longitude, x.zone_id) ));
  }

  getJobsByZone(zone_id): Observable<Job[]> {
    const url = `${this.jobsUrl}?zone_id=${zone_id}`;
    return  this.http.get<Job[]>(url)
      .map(response => response.map(x => new Job(x.id, x.car_licence_plate, x.car_brand, x.car_color, x.custom_job_description, x.job_type, x.creation, x.start, x.end, x.taker_first_name, x.zone_name, x.latitude, x.longitude, x.zone_id) ));
  }
  /** PUT: update the job on the server */
  updateJob (job: Job): Observable<any> {
    return this.http.put(this.jobsUrl, job, httpOptions);
  }

  /** POST: add a new job to the server */
  addJob (job: Job): Observable<Job> {
    return this.http.post<Job>(this.jobsUrl, job, httpOptions);
  }

  /** DELETE: delete the job from the server */
  deleteJob (job: Job | string): Observable<Job> {
    const id = typeof job === 'string' ? job : job.id;
    const url = `${this.jobsUrl}?id=${id}`;

    return this.http.delete<Job>(url, httpOptions);
  }
  
  constructor(
    private http: HttpClient,
    @Inject('API_ENDPOINT') private apiEndpoint: string
  ) { }

}
