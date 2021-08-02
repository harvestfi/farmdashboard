import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VaultStatsTotalComponent } from './vault-stats-total.component';

describe('VaultStatsTotalComponent', () => {
  let component: VaultStatsTotalComponent;
  let fixture: ComponentFixture<VaultStatsTotalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VaultStatsTotalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VaultStatsTotalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
