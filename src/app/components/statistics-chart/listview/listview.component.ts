import { Component, Input, Inject, Output, OnInit, SimpleChanges, ViewChild, ViewEncapsulation, ElementRef, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgbDateStruct, NgbDatepicker, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { StatService } from '../../../services/stat.service';
import { ChartComponent } from '../../chart/chart.component';

@Component({
  selector: 'charts-listview',
  templateUrl: './listview.component.html',
  styleUrls: ['../statistics-chart.component.css', './listview.component.css']
})

export class ChartListViewComponent implements OnInit {

  @ViewChild('chartContainer') chartContainer:ElementRef;
  @Input('filters') filters: object;
  @Input('dateFrom') dateFrom: string;
  @Input('dateUntil') dateUntil: string;
  @Input('compareFrom') compareFrom: string;
  @Input('compareUntil') compareUntil: string;

  searchFrom: any;
  searchTo: any;

  chartResults: any[];

  currentPage: number;
  pageSize: number;
  chartCount: number;

  @Output() onCreateChart: EventEmitter<any> = new EventEmitter<any>();

  constructor(private statService: StatService, private dialog: MatDialog) {
    this.chartResults = [];

    this.currentPage = 1;
    this.pageSize = 1;
    this.chartCount = 1;
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.filters || changes.dateFrom || changes.dateUntil || changes.compareFrom || changes.compareUntil) {
      this.paginationChanged();
    }
  }

  ngAfterViewInit() {
    this.onRelayout();
  }

  public onRelayout() {
    var thumbnail_width = 500, thumbnail_height = 300,
        thumbnail_margin_x = 10, thumbnail_margin_y = 30;

    var cols = Math.floor((this.chartContainer.nativeElement.clientWidth) / (thumbnail_width + thumbnail_margin_x * 2));
    var rows = 2;

    if (this.pageSize != cols * rows) {
      setTimeout(() => {
        let newPageSize = cols * rows;
        this.currentPage = Math.floor(((this.currentPage - 1) * this.pageSize) / newPageSize) + 1;
        this.pageSize = newPageSize;
        this.paginationChanged()
      }, 0);
    }
  }

  public paginationChanged() {
    this.statService.getCharts().subscribe(response => {
      let from = (this.currentPage - 1) * this.pageSize, to = from + this.pageSize;

      this.chartCount = response.length;
      this.chartResults = response.slice(from, to);
    });
  }

  public createChart() {
    this.onCreateChart.emit();
  }

  public showChartModal(chart) {
    if (!chart)
      return;

    let dialogRef = this.dialog.open(ChartDialog, {
      width: '60vw',
      height: '50vw',
      maxHeight: '80%',
      data: {
        chart: chart,
        filters: this.filters,
        dateFrom: this.dateFrom,
        dateUntil: this.dateUntil
      },
      panelClass: 'chart-dlg-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (dialogRef.componentInstance.newChartData)
        this.updateChart(dialogRef.componentInstance.newChartData);
    });
  }

  public updateChart(chart) {
    let index = this.chartResults.findIndex(c => c.id == chart.id);
    if (index >= 0)
      this.chartResults[index] = chart;
  }
}

@Component({
  selector: 'chart-dialog',
  template: `<stat-chart [showTitle]="true" [showExpand]="false" (updateClicked)="updateClicked()" (dataChanged)="dataChanged($event)"
  [data]="param.chart" [filters]="param.filters" [dateFrom]="param.dateFrom" [dateUntil]="param.dateUntil" ></stat-chart>`,
  styleUrls: ['../../../app.component.css', '../statistics-chart.component.css', './listview.component.css', '../../chart/chart.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ChartDialog {
  public newChartData: any;

  constructor(
    public dialogRef: MatDialogRef<ChartDialog>,
    @Inject(MAT_DIALOG_DATA) public param: any)
  {
  }

  private updateClicked() {
    this.dialogRef.close();
  }

  private dataChanged(newData) {
    this.newChartData = newData;
  }
}