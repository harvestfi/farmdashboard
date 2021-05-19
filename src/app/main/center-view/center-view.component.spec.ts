import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {CenterViewComponent} from './center-view.component';

describe('CenterViewComponent', () => {
  let component: CenterViewComponent;
  let fixture: ComponentFixture<CenterViewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CenterViewComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CenterViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
