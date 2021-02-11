import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LastRevisedComponent } from './last-revised.component';

describe('LastRevisedComponent', () => {
  let component: LastRevisedComponent;
  let fixture: ComponentFixture<LastRevisedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LastRevisedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LastRevisedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
