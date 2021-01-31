import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryPageViewComponent } from './history-page-view.component';

describe('HistoryPageViewComponent', () => {
  let component: HistoryPageViewComponent;
  let fixture: ComponentFixture<HistoryPageViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoryPageViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryPageViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
