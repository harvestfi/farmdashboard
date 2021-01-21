import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApyWindowComponent } from './apy-window.component';

describe('ApyWindowComponent', () => {
  let component: ApyWindowComponent;
  let fixture: ComponentFixture<ApyWindowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApyWindowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApyWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
