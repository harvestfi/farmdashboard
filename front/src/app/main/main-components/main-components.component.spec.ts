import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainComponentsComponent } from './main-components.component';

describe('MainComponentsComponent', () => {
  let component: MainComponentsComponent;
  let fixture: ComponentFixture<MainComponentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainComponentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainComponentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
