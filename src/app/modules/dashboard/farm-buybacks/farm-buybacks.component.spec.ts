import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FarmBuybacksComponent } from './farm-buybacks.component';

describe('FarmBuybacksComponent', () => {
  let component: FarmBuybacksComponent;
  let fixture: ComponentFixture<FarmBuybacksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FarmBuybacksComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FarmBuybacksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
