import {expect} from 'chai';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlidesComponent } from './slides.component';

xdescribe('SlidesComponent', () => {
  let component: SlidesComponent;
  let fixture: ComponentFixture<SlidesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SlidesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SlidesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).to.be.ok;
  });
});
