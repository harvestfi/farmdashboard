import {TestBed} from '@angular/core/testing';

import {UniswapSubscriberService} from './uniswap-subscriber.service';

describe('UniswapSubscriberService', () => {
  let service: UniswapSubscriberService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UniswapSubscriberService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
