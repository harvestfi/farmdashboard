import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HardworkLinkWindowComponent } from './hardwork-link-window.component';

describe('HardworkLinkWindowComponent', () => {
  let component: HardworkLinkWindowComponent;
  let fixture: ComponentFixture<HardworkLinkWindowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HardworkLinkWindowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HardworkLinkWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
