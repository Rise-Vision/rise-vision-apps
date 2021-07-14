import {expect} from 'chai';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandingColorsComponent } from './branding-colors.component';

xdescribe('BrandingColorsComponent', () => {
  let component: BrandingColorsComponent;
  let fixture: ComponentFixture<BrandingColorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BrandingColorsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BrandingColorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).to.be.ok;
  });
});
