import {Component, OnInit, ViewChild} from '@angular/core';
import { VehicleService } from '../../services/vehicle.service';
import { Vehicle } from '../../classes/vehicle';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {Brand} from '../../classes/brand';
import {Color} from '../../classes/color';
import {BrandService} from '../../services/brand.service';
import {ColorService} from '../../services/color.service';
import {VehicleType} from '../../classes/vehicleType';
import {VehicleTypeService} from '../../services/vehicleType.service';
import {DatePipe} from '@angular/common';
import {AccessRightsService} from "../../services/accessRights.service";


@Component({
  selector: 'app-vehicles',
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.css'],
})
export class VehiclesComponent implements OnInit {


  vehicles: Vehicle[];
  newVehicle: Vehicle = new Vehicle(null, null, null, null, null, null, null);
  brands: Array<Brand>;
  colors: Array<Color>;
  vehicletypes: Array<VehicleType>;
  selectedVehicle: Vehicle;

  displayedColumns = ['licence_plate',
    'issuedate',
    'type',
    'brand',
    'model',
    'color',
    'actions'];
  dataSource: MatTableDataSource<Vehicle>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('table') ngTable;

  getVehicles(): void {

    this.vehicleService.getVehicles()
      .subscribe(vehicles => {
        this.vehicles = vehicles;
        // Assign the data to the data source for the table to render
        this.featchMatTable(this.vehicles);
      });
  }

  onSelect(vehicle: Vehicle): void {
    this.selectedVehicle = vehicle;
  }

  featchMatTable(vehicles: Vehicle[]): void {
    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource(this.vehicles);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.selectedVehicle = this.vehicles ? this.vehicles[0] : null;
  }

  trimObject(obj: any) {
    for (const key of Object.keys(obj)) {
      if (obj[key] && (typeof obj[key] === 'string')) {
        obj[key] = obj[key].trim();
      }
    }
  }
  add(newVehicle: Vehicle): void {
    newVehicle.id = '';
    newVehicle.issuedate = this.datePipe.transform(newVehicle.issuedate, 'yyyy-MM-dd');
    this.trimObject(newVehicle);
    this.vehicleService.addVehicle(newVehicle)
      .subscribe(vehicle => {
        this.getVehicles();
        this.newVehicle = new Vehicle(null, null, null, null, null, null, null);
        this.ngTable.select('vehiclelist');
      });
  }

  delete(vehicle: Vehicle): void {
    if (window.confirm('Are sure you want to delete this item ?')) {
      this.vehicleService.deleteVehicle(vehicle).subscribe(result => {
        const index = this.vehicles.map(item => item.id).indexOf(vehicle.id);
        if (index > -1) {
          this.vehicles.splice(index, 1);
          this.featchMatTable(this.vehicles);
        }
      });
    }
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }


  constructor(
    private vehicleService: VehicleService,
    private brandService: BrandService,
    private colorService: ColorService,
    private vehicleTypeService: VehicleTypeService,
    private datePipe: DatePipe,
    private accessRightsService: AccessRightsService
  ) {
  }

  ngOnInit(): void {
    this.getVehicles();
    this.brandService.getBrands().subscribe(brands => this.brands = brands);
    this.colorService.getColors().subscribe(colors => this.colors = colors);
    this.vehicleTypeService.getVehicleTypes().subscribe(vehicletypes => this.vehicletypes = vehicletypes );
  }
}
