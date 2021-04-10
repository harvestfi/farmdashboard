import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {StrategyListComponent} from './strategy-list.component';

describe('StrategyListComponent', () => {
  let component: StrategyListComponent;
  let fixture: ComponentFixture<StrategyListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [StrategyListComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StrategyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
