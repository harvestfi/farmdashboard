import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {TradeBoxComponent} from './trade-box.component';

describe('TradeBoxComponent', () => {
  let component: TradeBoxComponent;
  let fixture: ComponentFixture<TradeBoxComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TradeBoxComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TradeBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
