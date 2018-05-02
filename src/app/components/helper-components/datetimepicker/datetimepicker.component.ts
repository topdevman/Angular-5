import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';

import * as moment from 'moment';

/*
  if(moment.default) {
    moment = moment.default;
  }
*/

@Component({
  selector: 'app-datetimepicker',
  templateUrl: './datetimepicker.component.html',
  styleUrls: ['./datetimepicker.component.css']
})
export class DatetimepickerComponent implements OnInit {

  @Input() label: any;
  @Input() datetime: any;

  @Output() datetimeChangedEmitter: EventEmitter<string> = new EventEmitter<string>();

  dt: any;
  time: any;
  date: any;

  constructor() {
  }

  ngOnInit() {
  }

  ngOnChanges() {

    this.time = {
      hour: 0,
      minute: 0,
      second: 0
    };

    this.date = {
      year: 0,
      month: 0,
      day: 0
    };

    this.dt = new Date();

    if (this.datetime) {
      this.dt = moment(this.datetime).toDate();

      this.time = {
        hour: this.dt.getHours(),
        minute: this.dt.getMinutes(),
        second: this.dt.getSeconds()
      };

      this.date = {
        year: this.dt.getFullYear(),
        month: this.dt.getMonth() + 1,
        day: this.dt.getDate()
      };
    }
  }

  dateChanged($event) {

    if(this.date) {
      this.dt.setFullYear(this.date.year);
      this.dt.setMonth(this.date.month - 1);
      this.dt.setDate(this.date.day);
    }

    this.updateDatetime(this.dt.toISOString());
  }

  timeChanged($event) {

    if(this.time) {
      this.dt.setHours(this.time.hour);
      this.dt.setMinutes(this.time.minute);
      this.dt.setSeconds(this.time.second);
    }

    this.updateDatetime(this.dt.toISOString());
  }

  updateDatetime(datetime) {
    this.datetimeChangedEmitter.emit(datetime);
  }
}

