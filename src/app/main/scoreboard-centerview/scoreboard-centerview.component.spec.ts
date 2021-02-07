import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoreboardCenterviewComponent } from './scoreboard-centerview.component';

describe('ScoreboardCenterviewComponent', () => {
  let component: ScoreboardCenterviewComponent;
  let fixture: ComponentFixture<ScoreboardCenterviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScoreboardCenterviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScoreboardCenterviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
