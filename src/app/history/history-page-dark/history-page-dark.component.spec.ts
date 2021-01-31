import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryPageDarkComponent } from './history-page-dark.component';

describe('HistoryPageDarkComponent', () => {
  let component: HistoryPageDarkComponent;
  let fixture: ComponentFixture<HistoryPageDarkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoryPageDarkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryPageDarkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
