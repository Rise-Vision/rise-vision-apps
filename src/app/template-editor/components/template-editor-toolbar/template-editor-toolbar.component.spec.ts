import {expect} from 'chai';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalService } from 'src/app/components/modals/modal.service';

import { TemplateEditorService } from '../../services/template-editor.service';

import { TemplateEditorToolbarComponent } from './template-editor-toolbar.component';

describe('TemplateEditorToolbarComponent', () => {
  let component: TemplateEditorToolbarComponent;
  let fixture: ComponentFixture<TemplateEditorToolbarComponent>;
  let modalService, templateEditorFactory;

  beforeEach(async () => {
    modalService = {
      confirmDanger : sinon.stub().resolves()
    };

    templateEditorFactory = {
      presentation: {},
      hasContentEditorRole: sinon.spy(),
      isPublishDisabled: sinon.spy(),
      deletePresentation: sinon.spy()
    };

    await TestBed.configureTestingModule({
      providers: [
        {provide: ModalService, useValue: modalService},
        {provide: TemplateEditorService, useValue: templateEditorFactory},
      ],
      declarations: [ TemplateEditorToolbarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateEditorToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).to.be.ok;
  });

  describe('confirmDelete:', function() {
    it('should open modal to confirm',function(){
      component.confirmDelete();

      modalService.confirmDanger.should.have.been.calledWith(
        'Are you sure you want to delete this Presentation?',
        null,
        'Delete Forever'
      );
    });

    it('should delete on confirm',function(done){
      component.confirmDelete();

      setTimeout(function() {
        templateEditorFactory.deletePresentation.should.have.been.called;

        done();
      }, 10);
    });

  });

});
