import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { StatisticBoardPageComponent } from './statistic-board-page.component';

describe('StatisticBoardPageComponent', () => {
  let component: StatisticBoardPageComponent;
  let fixture: ComponentFixture<StatisticBoardPageComponent>;

  beforeEach(waitForAsync(() => {
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
