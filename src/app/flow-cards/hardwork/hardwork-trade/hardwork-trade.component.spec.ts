import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HardworkTradeComponent } from './hardwork-trade.component';

describe('HardworkTradeComponent', () => {
  let component: HardworkTradeComponent;
  let fixture: ComponentFixture<HardworkTradeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HardworkTradeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HardworkTradeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
