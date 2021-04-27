import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TvlV2DialogComponent } from './tvl-v2-dialog.component';

describe('TvlV2DialogComponent', () => {
  let component: TvlV2DialogComponent;
  let fixture: ComponentFixture<TvlV2DialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TvlV2DialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TvlV2DialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
