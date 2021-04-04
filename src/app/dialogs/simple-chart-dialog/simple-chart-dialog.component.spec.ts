import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SimpleChartDialogComponent } from './simple-chart-dialog.component';

describe('AddressHistoryChartByNameDialogComponent', () => {
  let component: SimpleChartDialogComponent;
  let fixture: ComponentFixture<SimpleChartDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SimpleChartDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleChartDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
