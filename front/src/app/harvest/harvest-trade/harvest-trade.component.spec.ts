import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HarvestTradeComponent } from './harvest-trade.component';

describe('HarvestTradeComponent', () => {
  let component: HarvestTradeComponent;
  let fixture: ComponentFixture<HarvestTradeComponent>;

  beforeEach(async(() => {
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
