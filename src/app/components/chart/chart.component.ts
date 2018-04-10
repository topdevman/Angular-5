import { Component, ElementRef, EventEmitter, Input, Output, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { StatService } from '../../services/stat.service';
import { MatDialog } from '@angular/material/dialog';
import { EditChartDlgComponent } from '../edit-chart-dlg/edit-chart-dlg.component';

@Component({
  selector: 'stat-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit {

  @Input() showTitle: boolean;
  @Input() showGroupBy: boolean;
  @Input() showExpand: boolean;
  @Input() showUpdate: boolean;
  @Input() data: any;
  @Input() filters: object;
  @Input() dateFrom: string;
  @Input() dateUntil: string;
  @Input() compareFrom: string;
  @Input() compareUntil: string;
  @Output() expandClicked: EventEmitter<any> = new EventEmitter<any>();
  @Output() updateClicked: EventEmitter<any> = new EventEmitter<any>();
  @Output() dataChanged: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('chartWindow') chartWindow:ElementRef;

  chartOptions: any;
  chartData: any[];
  compareData: any[];
  isRetrieving: boolean;
  adjustedEndDate: any;

  groupby_periode = [
    { title: '1D', value: 'day' },
    { title: '1W', value: 'week' },
    { title: '1M', value: 'month' },
    { title: '1Y', value: 'year' },
  ];

  constructor(private statService: StatService, private dialog: MatDialog) {
    this.showTitle = false;
    this.showGroupBy = true;
    this.showExpand = false;
    this.showUpdate = true;

    this.chartOptions = {
      chart: {
        type: 'multiBarChart',
        barColor: d3.scale.category20().range(),
        margin: { left: 70, top: 20, right: 20, bottom: 20 },
        height: 200,
        // showValues: true,
        // valueFormat: function(d){ return d; },
        duration: 500,
        clipEdge : false,
        xAxis: { axisLabel: '' },
        yAxis: { axisLabel: '' },
        reduceXTicks: false,
        showLabels: false,
        showLegend: false,
        showControls: false,
        useInteractiveGuideline: true,
        showXAxis: true,
      }
    };
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.onChartWindowResize();
  }

  public onChartWindowResize(event?) {
    let chartHeight = this.chartWindow.nativeElement.clientHeight;
    this.chartOptions.chart.height = chartHeight;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.data) {
      this.updateChart(changes.data.currentValue);
    }
  }

  private updateChart(chart_data) {
    // Update chart type
    let type = chart_data.chart_type;
    if (type == "Histogram")
      this.chartOptions.chart.type = "multiBarChart";
    else if (type == "Pie")
      this.chartOptions.chart.type = "pieChart";
    else //if (type == "Line")
      this.chartOptions.chart.type = "lineChart";

    this.adjustedEndDate = undefined;

    // Retrieve data
    if (chart_data.chart_x && chart_data.chart_y) {
      // Update axis label
      // this.chartOptions.chart.xAxis.axisLabel = this.data.chart_x;
      // this.chartOptions.chart.yAxis.axisLabel = this.data.chart_y;

      this.chartData = [];
      var parent = this;
      this.statService.getChartData(this.data, this.filters, this.dateFrom, this.dateUntil).subscribe(response => {
        parent.isRetrieving = false;

        // Update margin according to chart type
        if (parent.chartOptions.chart.type == "pieChart") {
          parent.chartOptions.chart.margin.left = 20;
        } else {
          parent.chartOptions.chart.margin.left = 50;
          parent.chartOptions.chart.margin.right = 40;
          parent.chartOptions.chart.margin.bottom = 30;
        }

        // Update label
        // parent.chartOptions.chart.xAxis.axisLabel = response.x_label;
        // parent.chartOptions.chart.yAxis.axisLabel = response.y_label;
        response = response.values;

        // Set chart data
        if (parent.chartOptions.chart.type == "pieChart") {
          for (let i in response) {
            response[i].x = response[i].label;
          }

          parent.chartData = response ? response : [];

          // Display comparison view
          if (this.compareFrom || this.compareUntil) {
            this.statService.getChartData(this.data, this.filters, this.compareFrom, this.compareUntil).subscribe(response => {
              // Display common areas only
              let values1 = parent.chartData;
              let values2 = response.values;
              let length = Math.min(values1.length, values2.length);
              values1 = values1.slice(0, length);
              values2 = values2.slice(0, length);

              // Update X axis label for date to series format
              if (parent.data.chart_x == 'date_transaction') {
                let prefix = parent.getCompareLabelPrefix();

                for (let i = 0; i < length; i++) {
                  values1[i].x = values2[i].x = prefix + ' ' + (i + 1);
                }
              }

              parent.compareData = values2;
              parent.chartData = values1;
            });
          }
        }
        else //(parent.chartOptions.chart.type == "lineChart" || parent.chartOptions.chart.type == "multiBarChart")
        {
          parent.chartData = [ { values: (response ? response : []) } ];

          // Display comparison view
          if (this.compareFrom || this.compareUntil) {
            this.statService.getChartData(this.data, this.filters, this.compareFrom, this.compareUntil).subscribe(response => {
              let values1 = parent.chartData[0].values;
              let values2 = response.values;

              let display_separately = false;
              if (parent.data.x_type == 'Date' && parent.data.periode == 'day' && Math.abs(values1.length - values2.length) <= 3)
                display_separately = true;

              // Display common areas only
              let length = Math.min(values1.length, values2.length);
              if (display_separately)
                length = Math.max(values1.length, values2.length);

              if (parent.data.x_type == 'Date' && values1.length != values2.length && !display_separately) {
                let k = Math.min(length, values1.length) - 1;
                if (k >= 0) {
                  let endDate = new Date(values1.length > values2.length ? values1[k].label : values2[k].label);
                  if (parent.data.periode == 'week') {
                    endDate.setDate(endDate.getDate() + 6); // set to end of the week
                  } else if (parent.data.periode == 'month') {
                    endDate.setMonth(endDate.getMonth() + 1);
                    endDate.setDate(endDate.getDate() - 1); // set to end of the month
                  } else if (parent.data.periode == 'year') {
                    endDate.setFullYear(endDate.getFullYear() + 1);
                    endDate.setDate(endDate.getDate() - 1); // set to end of the year
                  }
                  this.adjustedEndDate = endDate.getTime();
                }
              }

              values1 = values1.slice(0, length);
              values2 = values2.slice(0, length);

              // Update X axis label for date to series format
              if (parent.data.x_type == 'Date') {
                let prefix = parent.getCompareLabelPrefix();

                for (let i = 0; i < values1.length; i++) {
                  values1[i].label = prefix + ' ' + (i + 1);
                }
                let delta = values1.length > 0 && values2.length ? values2[0].x - values1[0].x : 0;
                for (let i = 0; i < values2.length; i++) {
                  values2[i].x -= delta;
                  values2[i].label = prefix + ' ' + (i + 1);
                }
                // If filter period is less than compare period, append 0 to fix nvd3 library error
                for (let i = values1.length; i < values2.length; i++) {
                  values1.push({
                    x: values2[i].x,
                    y: 0,
                    label: values2[i].label
                  });
                }
              }

              let newData = [
                { values: values1, key: 'Original Data' },
                { values: values2, color: '#ff7f0e', key: 'Compare Data' },
              ];
              parent.chartData = newData;
              parent.updateChartLabels(values1, values2);
            });
          }

          parent.updateChartLabels(response);
        }
      });
      this.isRetrieving = true;
    }
    else {
      this.chartData = [];
    }
  }

  private updateChartLabels(values: any[], values2: any[] = null) {
    this.chartOptions.chart.xAxis.Labels = {};
    this.chartOptions.chart.xAxis.tickValues = [];

    values = Object.assign([], values);
    values = Object.assign(values, values2);
    if (values.length == 0)
      return;

    // Calculate pixel step to display x-axis label
    let step = 1;
    if (this.data.chart_x == 'date_transaction') {
      let width = this.chartWindow.nativeElement.clientWidth - 90;  // Remove margin size for left and right
      let count = Math.floor(width / 80) + 1;   // Add ticks every 80 pixels
      step = (values.length - 1) / count;
      if (step < 1) step = 1;

      this.chartOptions.chart.xAxis.rotateLabels = 0;
    }
    else {
      // Display all the employee names
      this.chartOptions.chart.margin.bottom = 90;
      this.chartOptions.chart.xAxis.rotateLabels = -35;
    }

    // Set label for each values
    let labels = {};
    let tickValues = [];

    for (let v of values) {
      labels[parseInt(v.x)] = v.label;
    }
    // Replace last tick with latest element of chart
    for (let i = 0; i < values.length; i++) {
      let k = Math.round(i * step);
      if (k >= values.length)
        break;

      tickValues.push(parseInt(values[k].x));
    }

    this.chartOptions.chart.x = function(d) { return d.x; }
    this.chartOptions.chart.xAxis.Labels = labels;
    this.chartOptions.chart.xAxis.tickValues = tickValues;

    let parent = this;
    this.chartOptions.chart.xAxis.tickFormat = (function(d) {
      return parent.chartOptions.chart.xAxis.Labels[d];
    });
  }

  private getCompareLabelPrefix() {
    switch (this.data.periode) {
      case 'week':
        return 'Week';
      case 'month':
        return 'Month';
      case 'year':
        return 'Year';
      default:
        return 'Day';
    }
  }

  public onExpandClicked() {
    if (this.expandClicked)
      this.expandClicked.emit(this.data);
  }

  public onUpdateClicked() {
    let dialogRef = this.dialog.open(EditChartDlgComponent, {
      width: '60vw',
      height: '50vw',
      maxHeight: '80%',
      data: {
        chart: this.data,
        dateFrom: this.dateFrom,
        dateUntil: this.dateUntil
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result)
        this.dataChanged.emit(result);
    });

    if (this.updateClicked)
      this.updateClicked.emit(this.data);
  }

  public groupDateBy(periode) {
    let newData = Object.assign({}, this.data);
    newData.periode = periode;

    let parent = this;
    this.statService.updateChart(newData).subscribe(result => {
      parent.data = newData;
      parent.updateChart(newData);
      parent.dataChanged.emit(newData);
    });
  }
}
