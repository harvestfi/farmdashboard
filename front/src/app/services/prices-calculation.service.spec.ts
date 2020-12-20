import {TestBed} from '@angular/core/testing';

import {PricesCalculationService} from './prices-calculation.service';

describe('PricesCalculationService', () => {
  let service: PricesCalculationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PricesCalculationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
