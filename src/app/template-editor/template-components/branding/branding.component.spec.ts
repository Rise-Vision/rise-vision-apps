import {expect} from 'chai';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandingComponent } from './branding.component';

xdescribe('BrandingComponent', () => {
  let component: BrandingComponent;
  let fixture: ComponentFixture<BrandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BrandingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BrandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).to.be.ok;
  });
});
