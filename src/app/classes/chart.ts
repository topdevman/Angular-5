export class Chart {
  constructor(obj?: Object) {
    this.id = "";
    this.chart_title = 
    this.chart_type = "";
    this.chart_x = this.chart_y = "";
    this.x_type = this.y_type = "";
    this.function = this.periode = "";
    this.row_num = this.row_pos = 0;
    this.username = "";
    this.width = 0;

    if (obj) {
      Object.keys(obj).forEach((key, index) => {
        this[key] = obj[key];
      });
    }
  }

  id: string;
  chart_title: string;
  chart_type: string;
  chart_x: string;
  chart_y: string;
  function: string;
  periode: string;
  row_num: number;
  row_pos: number;
  username: string;
  width: number;
  x_type: string;
  y_type: string;
}
