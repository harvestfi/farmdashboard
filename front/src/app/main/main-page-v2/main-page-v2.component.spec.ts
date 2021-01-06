import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MainPageV2Component} from './main-page-v2.component';

describe('MainPageV2Component', () => {
  let component: MainPageV2Component;
  let fixture: ComponentFixture<MainPageV2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MainPageV2Component]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainPageV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
