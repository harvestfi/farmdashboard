import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {UniTradeComponent} from './uni-trade.component';

describe('UniTradeComponent', () => {
  let component: UniTradeComponent;
  let fixture: ComponentFixture<UniTradeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [UniTradeComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UniTradeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
