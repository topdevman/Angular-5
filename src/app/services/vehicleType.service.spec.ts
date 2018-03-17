import { TestBed, inject } from '@angular/core/testing';

import { VehicleTypeService } from './vehicleType.service';

describe('VehicleTypeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VehicleTypeService]
    });
  });

  it('should be created', inject([VehicleTypeService], (service: VehicleTypeService) => {
    expect(service).toBeTruthy();
  }));
});
