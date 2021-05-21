import {TestBed} from '@angular/core/testing';

import {UniswapDataService} from './uniswap-data.service';

describe('UniswapDataService', () => {
  let service: UniswapDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UniswapDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
