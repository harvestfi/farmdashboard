import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MainPageLightComponent} from './main-page-light.component';

describe('MainPageV2Component', () => {
  let component: MainPageLightComponent;
  let fixture: ComponentFixture<MainPageLightComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MainPageLightComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainPageLightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
