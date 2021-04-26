import { TestBed } from '@angular/core/testing';

import { ProfitDataService } from './profit-data.service';

describe('ProfitDataService', () => {
  let service: ProfitDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProfitDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
