import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Web3chartComponent } from './web3chart.component';

describe('Web3chartComponent', () => {
  let component: Web3chartComponent;
  let fixture: ComponentFixture<Web3chartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Web3chartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Web3chartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
