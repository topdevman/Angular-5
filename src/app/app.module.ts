import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';

import { BaseRequestOptions, HttpModule } from '@angular/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NvD3Module } from 'ng2-nvd3';
import { DndModule } from 'ng2-dnd';

import 'd3';
import 'nvd3';


import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import {AuthService} from './services/auth.service';
import {AuthGuard} from './guards/auth.guard';
import {StatusGuard} from './guards/status.guard';
import {ValidateService} from './services/validate.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FlashMessagesModule, FlashMessagesService} from 'angular2-flash-messages';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {RoutingModule} from './routing/routing.module';
import {AuthInterceptor} from './interceptors/authInterceptor';
import { UsersComponent } from './components/users/users.component';
import {UserService} from './services/user.service';
import { VehiclesComponent } from './components/vehicles/vehicles.component';
import {VehicleService} from './services/vehicle.service';
import { SitesComponent } from './components/sites/sites.component';
import {SiteService} from './services/site.service';
import {StatService} from './services/stat.service';
import { ZonesComponent } from './components/zones/zones.component';
import {ZoneService} from './services/zone.service';
import { TeamsComponent } from './components/teams/teams.component';
import { ProductsComponent } from './components/products/products.component';
import { JobsComponent } from './components/jobs/jobs.component';
import {JobService} from './services/job.service';
import {
    MatTabsModule, MatTableModule, MatInputModule, MatFormFieldModule, MatPaginatorModule, MatSortModule, MatExpansionModule,
    MatToolbarModule, MatIconModule, MatCardModule, MatSelectModule, MatButtonModule, MatAutocompleteModule,
    MatListModule, MatDialogModule, MatDatepickerModule, MatNativeDateModule, MatGridListModule, MatCheckboxModule
} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { UserDetailComponent } from './components/user-detail/user-detail.component';
import { VehicleDetailComponent } from './components/vehicle-detail/vehicle-detail.component';
import { SiteDetailComponent } from './components/site-detail/site-detail.component';
import { ZoneDetailComponent } from './components/zone-detail/zone-detail.component';
import { JobDetailComponent } from './components/job-detail/job-detail.component';
import { ChartComponent } from './components/chart/chart.component';
import { StatisticsChartComponent } from './components/statistics-chart/statistics-chart.component'; // this is needed!
import { ChartListViewComponent, ChartDialog } from './components/statistics-chart/listview/listview.component';
import { EditChartDlgComponent } from './components/edit-chart-dlg/edit-chart-dlg.component';
import {UserTypeService} from './services/userType.service';
import {UploadService} from './services/upload.service';
import { SearchPipe } from './pipes/search.pipe';
import {TeamsService} from './services/teams.service';
import {VehicleTypeService} from './services/vehicleType.service';
import { Ng2FileInputModule } from 'ng2-file-input';
import { Ng2ImgMaxModule } from 'ng2-img-max';
import { AvatarEditorComponent } from './components/modals/avatar-editor/avatar-editor.component';
import {ImageCropperComponent} from 'ng2-img-cropper';
import {BrandService} from './services/brand.service';
import {ColorService} from './services/color.service';
import {JobTypeService} from './services/jobType.service';
import {SocketService} from './services/socket.service';
import {ProjectsComponent} from './components/projects/projects.component';
import {ProjectService} from './services/project.service';
import {SitesSelectorComponent} from './components/modals/sites-selector/sites-selector.component';
import { MapviewComponent } from './components/mapview/mapview.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import {MapService} from './services/map.service';
import {RightsComponent} from './components/rights/rights.component';
import {AccessRightsService} from "./services/accessRights.service";
import {AccessGuard} from "./guards/access.guard";
import { NewZoneComponent } from './components/modals/new-zone/new-zone.component';
import { GeneralviewComponent } from './components/generalview/generalview.component';


const apiEndpoint = 'http://217.182.89.217:8000';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    SidebarComponent,
    HomeComponent,
    LoginComponent,
    ProfileComponent,
    SidebarComponent,
    UsersComponent,
    VehiclesComponent,
    SitesComponent,
    ZonesComponent,
    TeamsComponent,
    ProductsComponent,
    JobsComponent,
    UserDetailComponent,
    VehicleDetailComponent,
    SiteDetailComponent,
    ZoneDetailComponent,
    JobDetailComponent,
    SearchPipe,
    ChartComponent,
    StatisticsChartComponent,
    SearchPipe,
    AvatarEditorComponent,
    ImageCropperComponent,
    ChartListViewComponent,
    ChartDialog,
    EditChartDlgComponent,
    ProjectsComponent,
    SitesSelectorComponent,
    MapviewComponent,
    ToolbarComponent,
    RightsComponent,
    NewZoneComponent,
    GeneralviewComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RoutingModule,
    FlashMessagesModule,
    MatTabsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTableModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatInputModule,
    MatSortModule,
    MatButtonModule,
    MatCardModule,
    MatSelectModule,
    MatListModule,
    MatIconModule,
    MatToolbarModule,
    MatExpansionModule,
    MatTableModule,
    MatDialogModule,
    MatGridListModule,
    MatCheckboxModule,
    MatAutocompleteModule,
    NvD3Module,
    BrowserAnimationsModule,
    HttpClientModule,
    NgbModule.forRoot(),
    DndModule.forRoot(),
    Ng2FileInputModule.forRoot(),
    Ng2ImgMaxModule
  ],
  providers: [AuthService, AuthGuard, StatusGuard, ValidateService, FlashMessagesService, AccessGuard,
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    {provide: 'API_ENDPOINT', useValue: apiEndpoint},
    UserService, VehicleService, SiteService, StatService, ZoneService, JobService, VehicleTypeService, UserTypeService,
    TeamsService, UploadService, BrandService, ColorService, JobTypeService, ProjectService, DatePipe,  SocketService, MapService,
    AccessRightsService],
  entryComponents: [
    AvatarEditorComponent, ChartComponent, ChartDialog, EditChartDlgComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
