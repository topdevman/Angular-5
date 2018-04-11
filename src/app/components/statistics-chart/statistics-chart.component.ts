import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgbInputDatepicker } from '@ng-bootstrap/ng-bootstrap';
import { VehicleService } from '../../services/vehicle.service';
import { SiteService } from '../../services/site.service';
import { ProjectService } from '../../services/project.service';
import { ChartListViewComponent } from './listview/listview.component';
import { MatDialog } from '@angular/material/dialog';
import { EditChartDlgComponent } from '../edit-chart-dlg/edit-chart-dlg.component';

@Component({
  selector: 'app-statistics-chart',
  templateUrl: './statistics-chart.component.html',
  styleUrls: ['./statistics-chart.component.css'],
  host: {
    '(document:click)': 'onClick($event)'
  }
})
export class StatisticsChartComponent implements OnInit {

  @ViewChild('chartView') chartView: ChartListViewComponent;
  @ViewChild('sd') startDatePicker: NgbInputDatepicker;
  @ViewChild('ed') endDatePicker: NgbInputDatepicker;
  @ViewChild('csd') compareFromPicker: NgbInputDatepicker;
  @ViewChild('ced') compareToPicker: NgbInputDatepicker;

  projects: any[];
  sites: any[];
  types: any[];
  vehicles: any[];

  project_id: string;
  site_id: string;
  vehicle_type: string;
  searchFrom: object;
  searchTo: object;
  compareFrom: object;
  compareTo: object;
  displayCompare: boolean;

  dateFrom: string;
  dateUntil: string;
  compareDateFrom: string;
  compareDateUntil: string;
  filters: object;

  PageViewMode = { ListView: 0, CreateView: 1 };
  pageView: number;

  constructor(private projectService: ProjectService, private siteService: SiteService, private vehicleService: VehicleService, private dialog: MatDialog) {
    this.pageView = this.PageViewMode.ListView;
  }

  ngOnInit() {
    this.projectService.getProjects().subscribe(response => {
      this.projects = response;
    });
    this.siteService.getSites().subscribe(response => {
      this.sites = response;
    });
    this.siteService.getSiteTypes().subscribe(response => {
      this.types = response;
    });
    this.vehicleService.getVehicleTypes().subscribe(response => {
      this.vehicles = response;
    });
  }

  onClick(event) {
    if (!!event.target.offsetParent) {
      let offsetParent = event.target.offsetParent;
      if (offsetParent.tagName == "NGB-DATEPICKER")
        return;
      let offsetParentIsCalendarForm = offsetParent.classList.contains('calendarform');

      // Close modal if outside of datepicker is clicked
      if (this.startDatePicker.isOpen() && (!offsetParentIsCalendarForm || document.getElementById("StartDateForm") != offsetParent)) {
        this.startDatePicker.close();
      }
      if (this.endDatePicker.isOpen() && (!offsetParentIsCalendarForm || document.getElementById("EndDateForm") != offsetParent)) {
        this.endDatePicker.close();
      }
      if (this.compareFromPicker.isOpen() && (!offsetParentIsCalendarForm || document.getElementById("CompareFromForm") != offsetParent)) {
        this.compareFromPicker.close();
      }
      if (this.compareToPicker.isOpen() && (!offsetParentIsCalendarForm || document.getElementById("CompareToForm") != offsetParent)) {
        this.compareToPicker.close();
      }
    }
  }

  onFilterChanged(event) {
    this.filters = {
      project: this.project_id,
      site: this.site_id,
      vehicle_type: this.vehicle_type
    };
  }

  dateFilterChanged(obj, event) {
    let date = new Date(event.year, event.month - 1, event.day).toISOString().substring(0, 10);

    if (obj == "searchFrom")
      this.dateFrom = date;
    else if (obj == "searchTo")
      this.dateUntil = date;
    else if (obj == "compareFrom")
      this.compareDateFrom = date;
    else if (obj == "compareTo")
      this.compareDateUntil = date;
  }

  CompareEvent(event) {
    this.displayCompare = !this.displayCompare;

    if (!this.displayCompare) {
      this.compareDateFrom = this.compareDateUntil = undefined;
    }
  }

  public changeView(viewMode: number) {
    this.pageView = viewMode;
  }

  public publishChart() {
    let dialogRef = this.dialog.open(EditChartDlgComponent, {
      width: '60vw',
      height: '50vw',
      maxHeight: '80%',
      data: {
        chart: null,
        dateFrom: this.dateFrom,
        dateUntil: this.dateUntil
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.chartView.paginationChanged();
      }
    });
  }
}
