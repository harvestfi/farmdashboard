import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PsApyHistoryComponent } from './ps-apy-history.component';

describe('PsApyHistoryComponent', () => {
  let component: PsApyHistoryComponent;
  let fixture: ComponentFixture<PsApyHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PsApyHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PsApyHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
