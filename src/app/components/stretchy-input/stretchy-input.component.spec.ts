import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StretchyInputComponent } from './stretchy-input.component';

describe('StretchyInputComponent', () => {
  let component: StretchyInputComponent;
  let fixture: ComponentFixture<StretchyInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StretchyInputComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StretchyInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
