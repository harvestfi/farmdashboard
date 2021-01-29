import { TestBed } from '@angular/core/testing';

import { PriceSubscriberService } from './price-subscriber.service';

describe('PriceSubscriberService', () => {
  let service: PriceSubscriberService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PriceSubscriberService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
