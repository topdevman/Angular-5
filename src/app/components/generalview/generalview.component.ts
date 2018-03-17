import {Component, OnInit, ViewChild} from '@angular/core';
import {OptionsMap} from '../mapview/MapOptions';
import {ToolbarComponent} from '../toolbar/toolbar.component';
import {MapviewComponent} from '../mapview/mapview.component';
import {MapService} from '../../services/map.service';

@Component({
  selector: 'app-generalview',
  templateUrl: './generalview.component.html',
  styleUrls: ['./generalview.component.css']
})
export class GeneralviewComponent implements OnInit {
  private mapOptions = new OptionsMap(true, true, true, true, {lat: 48.864716, lng: 2.349014});

  @ViewChild(ToolbarComponent) toolbarComponent: ToolbarComponent;
  @ViewChild(MapviewComponent) mapViewComponent: MapviewComponent;

  constructor(private mapService: MapService) { }

  ngOnInit() {
    const map = this.mapService.getMap();
    this.toolbarComponent.Initialize();
  }

}
