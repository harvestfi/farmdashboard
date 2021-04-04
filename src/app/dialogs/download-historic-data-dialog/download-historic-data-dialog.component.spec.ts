import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {DownloadHistoricDataDialogComponent} from './download-historic-data-dialog.component';

describe('DownloadHistoricDataDialogComponent', () => {
  let component: DownloadHistoricDataDialogComponent;
  let fixture: ComponentFixture<DownloadHistoricDataDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DownloadHistoricDataDialogComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadHistoricDataDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
