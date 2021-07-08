import {expect} from 'chai';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateEditorPreviewHolderComponent } from './template-editor-preview-holder.component';

xdescribe('TemplateEditorPreviewHolderComponent', () => {
  let component: TemplateEditorPreviewHolderComponent;
  let fixture: ComponentFixture<TemplateEditorPreviewHolderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TemplateEditorPreviewHolderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateEditorPreviewHolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).to.be.ok;
  });
});
