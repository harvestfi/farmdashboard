import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MainPageDescktopComponent} from './main-page-descktop.component';

describe('MainPageDescktopComponent', () => {
  let component: MainPageDescktopComponent;
  let fixture: ComponentFixture<MainPageDescktopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MainPageDescktopComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainPageDescktopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
