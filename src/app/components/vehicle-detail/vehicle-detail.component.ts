import {Component, Input, OnInit} from '@angular/core';
import { Vehicle} from '../../classes/vehicle';
import {VehicleService} from '../../services/vehicle.service';
import {Brand} from '../../classes/brand';
import {Color} from '../../classes/color';
import {BrandService} from '../../services/brand.service';
import {ColorService} from '../../services/color.service';
import {VehicleType} from '../../classes/vehicleType';
import {VehicleTypeService} from '../../services/vehicleType.service';
import {DatePipe} from '@angular/common';
import {AccessRightsService} from "../../services/accessRights.service";


@Component({
  selector: 'app-vehicle-detail',
  templateUrl: './vehicle-detail.component.html',
  styleUrls: ['./vehicle-detail.component.css']
})
export class VehicleDetailComponent implements OnInit {

  @Input() vehicle: Vehicle;
  brands: Array<Brand>;
  colors: Array<Color>;
  vehicletypes: Array<VehicleType>;

  constructor(private vehicleService: VehicleService,
              private brandService: BrandService,
              private colorService: ColorService,
              private vehicleTypeService: VehicleTypeService,
              private datePipe: DatePipe,
              private accessRightsService: AccessRightsService
  ) { }

  ngOnInit() {
    this.brandService.getBrands().subscribe(brands => this.brands = brands);
    this.colorService.getColors().subscribe(colors => this.colors = colors);
    this.vehicleTypeService.getVehicleTypes().subscribe(vehicletypes => this.vehicletypes = vehicletypes);
  }

  save(): void {
    if (window.confirm('Are sure you want to update this item ?')) {
      this.vehicle.issuedate = this.datePipe.transform(this.vehicle.issuedate, 'yyyy-MM-dd');
      console.log(this.vehicle.issuedate);
      this.vehicleService.updateVehicle(this.vehicle)
        .subscribe();
    }
  }

}
