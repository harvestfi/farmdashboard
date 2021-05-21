import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {MainPageLightComponent} from './main-page-light.component';

describe('MainPageV2Component', () => {
  let component: MainPageLightComponent;
  let fixture: ComponentFixture<MainPageLightComponent>;

  beforeEach(waitForAsync(() => {
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
