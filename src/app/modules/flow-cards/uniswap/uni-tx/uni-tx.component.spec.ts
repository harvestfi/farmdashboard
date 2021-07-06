import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {UniTxComponent} from './uni-tx.component';

describe('UniTxComponent', () => {
  let component: UniTxComponent;
  let fixture: ComponentFixture<UniTxComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [UniTxComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UniTxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
