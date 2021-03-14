import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatisticBoardPageComponent } from './statistic-board-page.component';

describe('StatisticBoardPageComponent', () => {
  let component: StatisticBoardPageComponent;
  let fixture: ComponentFixture<StatisticBoardPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatisticBoardPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatisticBoardPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
