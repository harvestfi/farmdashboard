import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TvlBoxComponent} from './tvl-box.component';

describe('TvlBoxComponent', () => {
  let component: TvlBoxComponent;
  let fixture: ComponentFixture<TvlBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TvlBoxComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TvlBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
