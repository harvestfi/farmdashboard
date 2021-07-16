import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {OhlcBarComponent} from './ohlc-bar.component';

describe('OhlcBarComponent', () => {
  let component: OhlcBarComponent;
  let fixture: ComponentFixture<OhlcBarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [OhlcBarComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OhlcBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
