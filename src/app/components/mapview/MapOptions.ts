export class OptionsMap {
  search_bar: boolean;
  polygon: boolean;
  circle: boolean;
  marker: boolean;
  location: {lat: number, lng: number};


  constructor(search_bar: boolean, polygon: boolean, circle: boolean, marker: boolean, location: { lat: number; lng: number }) {
    this.search_bar = search_bar;
    this.polygon = polygon;
    this.circle = circle;
    this.marker = marker;
    this.location = location;
  }
}
