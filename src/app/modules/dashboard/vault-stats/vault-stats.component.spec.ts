import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VaultStatsComponent } from './vault-stats.component';

describe('VaultStatsComponent', () => {
  let component: VaultStatsComponent;
  let fixture: ComponentFixture<VaultStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VaultStatsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VaultStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
