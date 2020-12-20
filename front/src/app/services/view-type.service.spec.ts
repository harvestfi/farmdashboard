import { TestBed } from '@angular/core/testing';

import { ViewTypeService } from './view-type.service';

describe('ViewTypeService', () => {
  let service: ViewTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ViewTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
