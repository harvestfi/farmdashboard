import {TestBed} from '@angular/core/testing';

import {HardworkSubscriberService} from './hardwork-subscriber.service';

describe('HardworkSubscriberService', () => {
  let service: HardworkSubscriberService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HardworkSubscriberService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
