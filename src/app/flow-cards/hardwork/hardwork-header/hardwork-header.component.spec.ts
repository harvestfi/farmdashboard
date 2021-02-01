import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HardworkHeaderComponent } from './hardwork-header.component';

describe('HardworkHeaderComponent', () => {
  let component: HardworkHeaderComponent;
  let fixture: ComponentFixture<HardworkHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HardworkHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HardworkHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
