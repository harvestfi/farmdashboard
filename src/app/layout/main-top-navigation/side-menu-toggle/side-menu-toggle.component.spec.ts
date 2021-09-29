import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SideMenuToggleComponent } from './side-menu-toggle.component';

describe('SideMenuToggleComponent', () => {
  let component: SideMenuToggleComponent;
  let fixture: ComponentFixture<SideMenuToggleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SideMenuToggleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SideMenuToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
