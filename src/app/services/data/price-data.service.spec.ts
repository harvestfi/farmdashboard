import { TestBed } from '@angular/core/testing';

import { PriceDataService } from './price-data.service';

describe('PriceDataService', () => {
  let service: PriceDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PriceDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
