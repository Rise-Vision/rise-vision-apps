import {expect} from 'chai';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PresentationSelectorComponent } from './presentation-selector.component';

xdescribe('PresentationSelectorComponent', () => {
  let component: PresentationSelectorComponent;
  let fixture: ComponentFixture<PresentationSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PresentationSelectorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PresentationSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).to.be.ok;
  });
});
