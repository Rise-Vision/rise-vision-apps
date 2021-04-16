import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CanvaButtonComponent } from './canva-button.component';

describe('CanvaButtonComponent', () => {
  let component: CanvaButtonComponent;
  let fixture: ComponentFixture<CanvaButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CanvaButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CanvaButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
