import { TestBed } from '@angular/core/testing';

import { HarvestDataService } from './harvest-data.service';

describe('HarvestDataService', () => {
  let service: HarvestDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HarvestDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
