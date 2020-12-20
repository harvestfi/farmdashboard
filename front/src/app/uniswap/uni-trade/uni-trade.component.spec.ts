import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UniTradeComponent } from './uni-trade.component';

describe('UniTradeComponent', () => {
  let component: UniTradeComponent;
  let fixture: ComponentFixture<UniTradeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UniTradeComponent ]
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
