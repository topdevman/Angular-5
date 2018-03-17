import { Injectable, Inject } from '@angular/core';
import { Observable} from 'rxjs/Observable';
import { HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';

import 'rxjs/add/operator/map';
import {Job} from '../classes/job';
import {AuthService} from "./auth.service";



const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable()
export class AccessRightsService {

  private accessRightsUrl = `${this.apiEndpoint}/accessRights`;
  public userAccessRights: string[];
  public ACCESS_RIGHTS: any[] = [
        {name: 'Employee', id: 'users', viewName: 'view_users', editName: 'edit_users'},
        {name: 'Zones', id: 'zones', viewName: 'view_zones', editName: 'edit_zones'},
        {name: 'Teams', id: 'teams', viewName: 'view_teams', editName: 'edit_teams'},
        {name: 'Projects', id: 'projects', viewName: 'view_projects', editName: 'edit_projects'},
        {name: 'Sites', id: 'sites', viewName: 'view_sites', editName: 'edit_sites'},
        {name: 'Vehicles', id: 'vehicles', viewName: 'view_vehicles', editName: 'edit_vehicles'},
        {name: 'Access Rights', id: 'accessRights', viewName: 'view_access_rights', editName: 'edit_access_rights'},
        {name: 'Hardware', id: 'hardware', viewName: 'view_hardware', editName: 'edit_hardware'},
        {name: 'Product', id: 'product', viewName: 'view_product', editName: 'edit_product'},
        {name: 'Dashboards', id: 'dashboards', viewName: 'view_dashboards', editName: 'edit_dashboards'},
        {name: 'Low Level Alert ', id: 'lowLevelAlert', viewName: 'view_lowLevelAlert', editName: 'edit_lowLevelAlert'},
        {name: 'High Level Alert', id: 'highLevelAlert', viewName: 'view_highLevelAlert', editName: 'edit_highLevelAlert'},
        {name: 'Monitoring', id: 'monitoring', viewName: 'view_monitoring', editName: 'edit_monitoring'},
        {name: 'Shift Management', id: 'shift', viewName: 'view_shift', editName: 'edit_shift'},
        {name: 'Administration', id: 'administration', viewName: 'view_administration', editName: 'edit_administration'},
        {name: 'Membership', id: 'membership', viewName: 'view_membership', editName: 'edit_membership'},
        {name: 'Payment systems', id: 'payment', viewName: 'view_payment', editName: 'edit_payment'},
      ];

  constructor(
    private http: HttpClient,
    private auth: AuthService,
    @Inject('API_ENDPOINT') private apiEndpoint: string
  ) {
  }


  getAccessRights(sites: string[], users: string[]): Observable<any[]> {
    return  this.http.post<any[]>(`${this.accessRightsUrl}/getBySites`, {sites: sites, users: users}, httpOptions);
  }

  setAccessRights(sites: string[], users: string[], rights: string[]): Observable<any[]> {
    return  this.http.post<any[]>(`${this.accessRightsUrl}/setBySites`, {sites: sites, users: users, rights: rights}, httpOptions);
  }

  getRightsBySiteIdAndUserId(site: string, user: string): Observable<any[]> {
    return  this.http.post<any[]>(`${this.accessRightsUrl}/getBySiteIdAndUserId`, {site: site, user: user}, httpOptions);
  }

  private getAccessRight(rightName: string, actionId: string): boolean {
    let actionName : string;
    let hasRight : boolean = false;
    this.ACCESS_RIGHTS.forEach(item => {
      if (item.id === rightName) {
        actionName = item[actionId];
      }
    });
    if (this.userAccessRights) {
      hasRight = this.userAccessRights.indexOf(actionName) > -1;
    }
    return hasRight;
  }

  canView(rightName: string): boolean {
    return this.getAccessRight(rightName, 'viewName');
  }

  canEdit(rightName: string): boolean {
    return this.getAccessRight(rightName, 'editName');
  }
}
