import {expect} from 'chai';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateEditorService } from '../../services/template-editor.service';

import { TemplateEditorFooterComponent } from './template-editor-footer.component';

describe('TemplateEditorFooterComponent', () => {
  let component: TemplateEditorFooterComponent;
  let fixture: ComponentFixture<TemplateEditorFooterComponent>;
  let templateEditorFactory;

  beforeEach(async () => {
    templateEditorFactory = {
      presentation: {},
      hasContentEditorRole: sinon.spy(),
      isPublishDisabled: sinon.spy(),
    };

    await TestBed.configureTestingModule({
      providers: [
        {provide: TemplateEditorService, useValue: templateEditorFactory},
      ],
      declarations: [ TemplateEditorFooterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateEditorFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).to.be.ok;
  });
});
