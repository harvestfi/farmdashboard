import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {HarvestTxComponent} from './harvest-tx.component';

describe('HarvestTxComponent', () => {
  let component: HarvestTxComponent;
  let fixture: ComponentFixture<HarvestTxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HarvestTxComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HarvestTxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
