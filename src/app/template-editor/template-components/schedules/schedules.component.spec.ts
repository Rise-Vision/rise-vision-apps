import {expect} from 'chai';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchedulesComponent } from './schedules.component';

xdescribe('SchedulesComponent', () => {
  let component: SchedulesComponent;
  let fixture: ComponentFixture<SchedulesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SchedulesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SchedulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).to.be.ok;
  });
});
