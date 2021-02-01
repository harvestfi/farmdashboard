import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HardworkTxComponent } from './hardwork-tx.component';

describe('HardworkTxComponent', () => {
  let component: HardworkTxComponent;
  let fixture: ComponentFixture<HardworkTxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HardworkTxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HardworkTxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
