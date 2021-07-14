import {expect} from 'chai';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentsService } from '../../services/components.service';

import { TemplateAttributeEditorComponent } from './template-attribute-editor.component';

describe('TemplateAttributeEditorComponent', () => {
  let sandbox = sinon.sandbox.create();

  let component: TemplateAttributeEditorComponent;
  let fixture: ComponentFixture<TemplateAttributeEditorComponent>;
  let componentsFactory;

  beforeEach(async () => {
    componentsFactory = {
      reset: sinon.spy(),
      editHighlightedComponent: sinon.spy()
    };

    sandbox.spy(window, 'addEventListener');
    sandbox.spy(window, 'removeEventListener');

    await TestBed.configureTestingModule({
      providers: [
        {provide: ComponentsService, useValue: componentsFactory}
      ],
      declarations: [ TemplateAttributeEditorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateAttributeEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  afterEach(function () {
    sandbox.restore();
  });

  it('should exist', function() {
    expect(component).to.be.ok;
    expect(component.componentsFactory).to.be.ok;
    
    componentsFactory.reset.should.have.been.called;
  });

  it('Handles message from templates', function() {
    window.addEventListener.should.have.been.calledWith('message');
  });

  it('Clears window event listener when element is destroyed', function() {
    component.ngOnDestroy();

    window.removeEventListener.should.have.been.calledWith('message');
  });

  describe('_handleMessageFromTemplate', () => {
    it('should highlight component', function() {
      component._handleMessageFromTemplate({
        data: {
          type: 'editComponent',
          value: 'componentid'
        }
      });

      componentsFactory.editHighlightedComponent.should.have.been.calledWith('componentid');
    });

    it('should parse json string', function() {
      component._handleMessageFromTemplate({
        data: JSON.stringify({
          type: 'editComponent',
          value: 'componentid'
        })
      });

      componentsFactory.editHighlightedComponent.should.have.been.calledWith('componentid');
    });

    it('should ignore other messages', function() {
      component._handleMessageFromTemplate({
        data: {
          type: 'otherMessage',
          value: 'componentid'
        }
      });

      componentsFactory.editHighlightedComponent.should.not.have.been.called;
    });

    it('should handle invalid json', function() {
      component._handleMessageFromTemplate({
        data: 'invalid json'
      });

      componentsFactory.editHighlightedComponent.should.not.have.been.called;
    });

  });

});
