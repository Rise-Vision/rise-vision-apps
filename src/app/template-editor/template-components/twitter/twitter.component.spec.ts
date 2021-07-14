import {expect} from 'chai';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TwitterComponent } from './twitter.component';

xdescribe('TwitterComponent', () => {
  let component: TwitterComponent;
  let fixture: ComponentFixture<TwitterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TwitterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TwitterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).to.be.ok;
  });
});
