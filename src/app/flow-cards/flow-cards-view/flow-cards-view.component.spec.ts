import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlowCardsViewComponent } from './flow-cards-view.component';

describe('FlowCardsViewComponent', () => {
  let component: FlowCardsViewComponent;
  let fixture: ComponentFixture<FlowCardsViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlowCardsViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlowCardsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
