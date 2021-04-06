import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HarvestTradeComponent } from './harvest-trade.component';

describe('HarvestTradeComponent', () => {
  let component: HarvestTradeComponent;
  let fixture: ComponentFixture<HarvestTradeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ HarvestTradeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HarvestTradeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
