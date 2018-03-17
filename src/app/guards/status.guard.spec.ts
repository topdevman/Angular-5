import { TestBed, async, inject } from '@angular/core/testing';

import { StatusGuard } from './status.guard';

describe('StatusGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StatusGuard]
    });
  });

  it('should ...', inject([StatusGuard], (guard: StatusGuard) => {
    expect(guard).toBeTruthy();
  }));
});
