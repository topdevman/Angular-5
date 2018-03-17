import { TestBed, inject } from '@angular/core/testing';

import { ZoneService } from './zone.service';

describe('ZoneService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ZoneService]
    });
  });

  it('should be created', inject([ZoneService], (service: ZoneService) => {
    expect(service).toBeTruthy();
  }));
});
