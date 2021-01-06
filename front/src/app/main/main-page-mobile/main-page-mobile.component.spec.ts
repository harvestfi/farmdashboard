import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MainPageMobileComponent} from './main-page-mobile.component';

describe('MainPageMobileComponent', () => {
  let component: MainPageMobileComponent;
  let fixture: ComponentFixture<MainPageMobileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MainPageMobileComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainPageMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
