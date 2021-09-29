import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadHistoricDataComponent } from './download-historic-data.component';

describe('DownloadHistoricDataComponent', () => {
  let component: DownloadHistoricDataComponent;
  let fixture: ComponentFixture<DownloadHistoricDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DownloadHistoricDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadHistoricDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
