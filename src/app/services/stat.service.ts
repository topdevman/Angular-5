import { Injectable, Inject } from '@angular/core';
import { Site} from '../classes/site';
import { Observable} from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { URLSearchParams } from '@angular/http';
import { Chart } from '../classes/chart';



const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable()
export class StatService {

  private statsUrl = `${this.apiEndpoint}/stats`;

  constructor(
    private http: HttpClient,
    @Inject('API_ENDPOINT') private apiEndpoint: string
  ) { }

  /** GET s from the server */
  getCharts(): Observable<Chart[]> {
    return this.http.get<Chart[]>(this.statsUrl);
  }

  /** PUT: update the stat on the server */
  updateChart(chart: Chart): Observable<any> {
    return this.http.put(this.statsUrl, chart, httpOptions);
  }

  /** POST: add a new chart to the server */
  addChart (chart: Chart): Observable<Chart> {
    return this.http.post<Chart>(this.statsUrl, chart, httpOptions);
  }

  /** DELETE: delete a chart from the server */
  deleteChart(chart: Chart | string): Observable<Chart> {
    const id = typeof chart === 'string' ? chart : chart.id;
    const url = `${this.statsUrl}?id=${id}`;

    return this.http.delete<Chart>(url, httpOptions);
  }

  // /** DELETE: delete the chart from the server */
  // deleteSite (chart: Site | string): Observable<Site> {
  //   const id = typeof chart === 'string' ? chart : chart.id;
  //   const url = `${this.statsUrl}?id=${id}`;

  //   return this.http.delete<Site>(url, httpOptions);
  // }

  /** */
  getChartColumns(): Observable<any[]> {
    return this.http.get<any[]>(this.statsUrl + "/axis");
  }

  getChartData(chart: Chart, filters?: object, from?: string, to?: string): Observable<any> {
    let params = new URLSearchParams();
    if (chart && chart.chart_x && chart.chart_y) {
      params.append("chart_x", chart.chart_x);
      params.append("chart_y", chart.chart_y);

      if (chart.periode) {
        params.append("periode", chart.periode);
        if (chart.function)
          params.append("function", chart.function);
      }

      if (filters) {
        for (let key in filters) {
          if (!!filters[key])
            params.append(key, filters[key]);
        }
      }

      if (from) params.append("from", from);
      if (to) params.append("to", to);
  
      return this.http.get<any>(this.statsUrl + "/data?" + params.toString()); 
    }

    return new Observable(observer => {
      setTimeout(() => {
        observer.next(null);
      }, 0);
    });

  }

}
