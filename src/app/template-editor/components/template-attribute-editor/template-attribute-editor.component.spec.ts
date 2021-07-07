import {expect} from 'chai';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateAttributeEditorComponent } from './template-attribute-editor.component';

describe('TemplateAttributeEditorComponent', () => {
  let component: TemplateAttributeEditorComponent;
  let fixture: ComponentFixture<TemplateAttributeEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TemplateAttributeEditorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateAttributeEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).to.be.ok;
  });
});
