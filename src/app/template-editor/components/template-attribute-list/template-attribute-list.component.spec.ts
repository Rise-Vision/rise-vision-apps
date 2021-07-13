import {expect} from 'chai';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateAttributeListComponent } from './template-attribute-list.component';

xdescribe('TemplateAttributeListComponent', () => {
  let component: TemplateAttributeListComponent;
  let fixture: ComponentFixture<TemplateAttributeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TemplateAttributeListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateAttributeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).to.be.ok;
  });
});
