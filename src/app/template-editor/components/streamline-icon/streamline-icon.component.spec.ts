import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StreamlineIconComponent } from './streamline-icon.component';

describe('StreamlineIconComponent', () => {
  let component: StreamlineIconComponent;
  let fixture: ComponentFixture<StreamlineIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StreamlineIconComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StreamlineIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
