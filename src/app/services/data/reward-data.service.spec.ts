import { TestBed } from '@angular/core/testing';

import { RewardDataService } from './reward-data.service';

describe('RewardDataService', () => {
  let service: RewardDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RewardDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
