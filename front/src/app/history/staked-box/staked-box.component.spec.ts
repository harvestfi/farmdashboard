import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StakedBoxComponent } from './staked-box.component';

describe('StakedBoxComponent', () => {
  let component: StakedBoxComponent;
  let fixture: ComponentFixture<StakedBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StakedBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StakedBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
