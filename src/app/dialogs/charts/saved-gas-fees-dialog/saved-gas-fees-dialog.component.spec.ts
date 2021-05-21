import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {SavedGasFeesDialogComponent} from './saved-gas-fees-dialog.component';

describe('SavedFeesDialogComponent', () => {
  let component: SavedGasFeesDialogComponent;
  let fixture: ComponentFixture<SavedGasFeesDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SavedGasFeesDialogComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SavedGasFeesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
