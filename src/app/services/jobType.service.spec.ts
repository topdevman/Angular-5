import { TestBed, inject } from '@angular/core/testing';

import { JobTypeService } from './jobType.service';

describe('JobTypeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [JobTypeService]
    });
  });

  it('should be created', inject([JobTypeService], (service: JobTypeService) => {
    expect(service).toBeTruthy();
  }));
});
