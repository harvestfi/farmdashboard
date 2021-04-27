import { TestBed } from '@angular/core/testing';

import { HardworkDataService } from './hardwork-data.service';

describe('HardworkDataService', () => {
  let service: HardworkDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HardworkDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
