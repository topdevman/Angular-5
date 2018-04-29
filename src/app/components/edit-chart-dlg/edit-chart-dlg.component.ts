import { Component, Inject, OnInit, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { StatService } from '../../services/stat.service';
import { Chart } from '../../classes/chart';
import { Axis } from '../../classes/axis';

@Component({
  selector: 'edit-chart-dlg',
  templateUrl: './edit-chart-dlg.component.html',
  styleUrls: ['../../app.component.css', './edit-chart-dlg.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class EditChartDlgComponent implements OnInit {

  private chartNameOld: string;
  private axisList: Axis[];
  private chartTypes: string[];
  private dateGroups: any[];
  private functionGroups: any[];
  private chartData: any;

  private filters: object;
  private dateFrom: string;
  private dateUntil: string;

  constructor(private dialogRef: MatDialogRef<EditChartDlgComponent>,
    @Inject(MAT_DIALOG_DATA) private param: any,
    private statService : StatService,
    private fb: FormBuilder
  ) {
    this.chartTypes = ['Histogram', 'Pie', 'Line'];
    this.dateGroups = [
      { label: "Day", value: "day"},
      { label: "Week", value: "week"},
      { label: "Month", value: "month"},
      { label: "Year", value: "year"},
    ];
    this.functionGroups = [
      { label: "Sum", value: "sum"},
      { label: "Mean", value: "mean"},
    ];

    this.filters = param.filters;
    this.dateFrom = param.dateFrom;
    this.dateUntil = param.dateUntil;

    let data = new Chart(param.chart);
    this.chartNameOld = data.chart_title;

    if (!data.periode) data.periode = "day";
    if (!data.function) data.function = "sum";
    if (!data.chart_type) data.chart_type = this.chartTypes[0];

    this.chartData = fb.group(data);
  }

  ngOnInit() {
    this.statService.getChartColumns().subscribe(response => {
      this.axisList = response;
    });
  }

  private delete() {
    if (window.confirm('Are sure you want to delete this item ?')) {
      this.statService.deleteChart(this.chartData.value).subscribe(result => {
        this.dialogRef.close(true);
      });
    }
  }

  private update() {
    if (!this.chartData.valid)
      return;

      let data = new Chart(this.chartData.value);
      data.x_type = this.axisList.find(a => a.name == data.chart_x).type;
      data.y_type = this.axisList.find(a => a.name == data.chart_y).type;

    if (data.id) {
      this.statService.updateChart(data).subscribe(result => {
        this.dialogRef.close(data);
      });
    }
    else {
      this.statService.addChart(data).subscribe(result => {
        this.dialogRef.close(true);
      });
    }
  }

  private close() {
    this.dialogRef.close();
  }
}
