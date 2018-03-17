import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ProfileComponent} from '../components/profile/profile.component';
import {LoginComponent} from '../components/login/login.component';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from '../components/home/home.component';
import {JobsComponent} from '../components/jobs/jobs.component';
import {SitesComponent} from '../components/sites/sites.component';
import {TeamsComponent} from '../components/teams/teams.component';
import {UsersComponent} from '../components/users/users.component';
import {VehiclesComponent} from '../components/vehicles/vehicles.component';
import {ZonesComponent} from '../components/zones/zones.component';
import {StatisticsChartComponent} from '../components/statistics-chart/statistics-chart.component';
import {ProductsComponent} from '../components/products/products.component';
import {ProjectsComponent} from '../components/projects/projects.component';
import {RightsComponent} from '../components/rights/rights.component';
import {MapviewComponent} from '../components/mapview/mapview.component';
import {AuthGuard} from "../guards/auth.guard";
import {AccessGuard} from "../guards/access.guard";
import {GeneralviewComponent} from '../components/generalview/generalview.component';


const appRoutes: Routes = <Routes> [
  {path: 'home', component: HomeComponent, canActivate: [AccessGuard]},
  {path: 'login', component: LoginComponent, canActivate: [AccessGuard]},
  {path: 'profile', component: ProfileComponent, canActivate: [AuthGuard, AccessGuard]},
  {path: 'job', component: JobsComponent, canActivate: [AuthGuard, AccessGuard]},
  {path: 'site', component: SitesComponent, canActivate: [AuthGuard, AccessGuard]},
  {path: 'team', component: TeamsComponent, canActivate: [AuthGuard, AccessGuard]},
  {path: 'user', component: UsersComponent, canActivate: [AuthGuard, AccessGuard]},
  {path: 'vehicle', component: VehiclesComponent, canActivate: [AuthGuard, AccessGuard]},
  {path: 'zone', component: ZonesComponent, canActivate: [AuthGuard, AccessGuard]},
  {path: 'chart', component: StatisticsChartComponent, canActivate: [AuthGuard, AccessGuard]},
  {path: 'product', component: HomeComponent, canActivate: [AuthGuard, AccessGuard]},
  {path: 'membership', component: HomeComponent, canActivate: [AuthGuard, AccessGuard]},
  {path: 'map', component: GeneralviewComponent, canActivate: [AuthGuard, AccessGuard]},
  {path: 'product', component: ProductsComponent, canActivate: [AuthGuard, AccessGuard]},
  {path: 'membership', component: HomeComponent, canActivate: [AuthGuard, AccessGuard]},
  {path: 'project', component: ProjectsComponent, canActivate: [AuthGuard, AccessGuard]},
  {path: 'rights', component: RightsComponent, canActivate: [AuthGuard, AccessGuard]},
  {path: '', component: HomeComponent, canActivate: [AccessGuard]},
  {path: '*', component: HomeComponent, canActivate: [AccessGuard]},
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(appRoutes)
  ],
  exports: [
    RouterModule
  ],
  declarations: []
})
export class RoutingModule { }
