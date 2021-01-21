import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkWindowComponent } from './link-window.component';

describe('LinkWindowComponent', () => {
  let component: LinkWindowComponent;
  let fixture: ComponentFixture<LinkWindowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LinkWindowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
