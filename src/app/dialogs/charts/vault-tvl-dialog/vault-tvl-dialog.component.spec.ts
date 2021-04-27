import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VaultTvlDialogComponent } from './vault-tvl-dialog.component';

describe('VaultTvlDialogComponent', () => {
  let component: VaultTvlDialogComponent;
  let fixture: ComponentFixture<VaultTvlDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VaultTvlDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VaultTvlDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
