import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LastPricesListComponent } from './last-prices-list.component';

describe('LastPricesListComponent', () => {
  let component: LastPricesListComponent;
  let fixture: ComponentFixture<LastPricesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LastPricesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LastPricesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
