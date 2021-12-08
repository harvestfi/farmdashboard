import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavedGasFeesComponent } from './saved-gas-fees.component';

describe('SavedGasFeesComponent', () => {
  let component: SavedGasFeesComponent;
  let fixture: ComponentFixture<SavedGasFeesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SavedGasFeesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SavedGasFeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
