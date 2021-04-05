import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Web3chartsComponent } from './web3charts.component';

describe('Web3chartsComponent', () => {
  let component: Web3chartsComponent;
  let fixture: ComponentFixture<Web3chartsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Web3chartsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Web3chartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
