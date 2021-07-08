import {expect} from 'chai';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AjsState, AjsTransitions, ComponentsFactory, TemplateEditorFactory, PresentationUtils } from 'src/app/ajs-upgraded-providers';
import { BroadcasterService } from 'src/app/shared/services/broadcaster.service';

import { TemplateEditorComponent } from './template-editor.component';
import { AutoSaveService } from '../../services/auto-save.service';

describe('TemplateEditorComponent', () => {
  let sandbox = sinon.sandbox.create();

  let component: TemplateEditorComponent;
  let fixture: ComponentFixture<TemplateEditorComponent>;
  let mockAjsState: any, mockAjsTransitions: any, mockBroadcasterService: any, subscribeResult: any;
  let templateEditorFactory, componentsFactory, autoSaveService, isMobileBrowser;

  beforeEach(async () => {
    mockAjsState = {
      go: sandbox.stub()
    };
    mockAjsTransitions = {
      onStart: sandbox.stub()
    };
    mockBroadcasterService = {
      subscribe: sandbox.stub().returns(subscribeResult = {
        unsubscribe: sandbox.stub()
      })
    };

    templateEditorFactory = {
      presentation: { templateAttributeData: {} },
      isUnsaved: () => {
        return templateEditorFactory.hasUnsavedChanges
      },
      save: sandbox.stub().resolves(),
      publish: sandbox.stub().resolves(),
      hasContentEditorRole: sandbox.stub().returns(true)
    };
    autoSaveService = {
      save: sandbox.stub(),
      clearSaveTimeout: sandbox.stub()
    };
    componentsFactory = {};
    let presentationUtils = {
      isMobileBrowser: () => isMobileBrowser
    };

    //override component-level provider
    TestBed.overrideComponent( TemplateEditorComponent, {
      set: {
        providers: [{provide: AutoSaveService, useValue: autoSaveService }]
      }
    });
    await TestBed.configureTestingModule({
      declarations: [ TemplateEditorComponent ],
      providers: [
        {provide: AjsState, useValue: mockAjsState},
        {provide: AjsTransitions, useValue: mockAjsTransitions},
        {provide: BroadcasterService, useValue: mockBroadcasterService},
        {provide: ComponentsFactory, useValue: componentsFactory},
        {provide: TemplateEditorFactory, useValue: templateEditorFactory},
        {provide: AutoSaveService, useValue: autoSaveService},
        {provide: PresentationUtils, useValue: presentationUtils}
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should create', () => {
    expect(component).to.be.ok;
    expect(component.componentsFactory).to.be.ok;
  });

  describe('ngDoCheck:', () => {
    it('should handle missing presentation', () => {
      templateEditorFactory.presentation = undefined;

      component.ngDoCheck();
    });

    it('should flag unsaved changes to presentation', () => {
      expect(templateEditorFactory.hasUnsavedChanges).to.be.false;
      templateEditorFactory.presentation.id = '1234';
      templateEditorFactory.presentation.name = 'New Name';

      component.ngDoCheck();

      expect(templateEditorFactory.hasUnsavedChanges).to.be.true;
      autoSaveService.save.should.have.been.called;
    });

    it('should not save presentation if user has no Content Editor role', () => {
      templateEditorFactory.hasContentEditorRole.returns(false);
      templateEditorFactory.presentation.name = 'New Name';

      component.ngDoCheck();    

      expect(templateEditorFactory.hasUnsavedChanges).to.be.false;
      autoSaveService.save.should.not.have.been.called;
    });
  });

  describe('broadcaster.subscribe:', () => {
    let subscribeHandler: any;
    beforeEach(() => {
      subscribeHandler = mockBroadcasterService.subscribe.getCall(0).args[0].next;
    });

    it('should clear unsaved changes flag after saving presentation, asyncronously', done => {
      templateEditorFactory.hasUnsavedChanges = true;

      subscribeHandler('presentationUpdated');

      expect(templateEditorFactory.hasUnsavedChanges).to.be.true;

      setTimeout(function() {
        expect(templateEditorFactory.hasUnsavedChanges).to.be.false;

        done();
      }, 10);
    });

    it('should clear unsaved changes flag after saving presentation, syncronously', () => {
      templateEditorFactory.hasUnsavedChanges = true;

      subscribeHandler('presentationDeleted');

      expect(templateEditorFactory.hasUnsavedChanges).to.be.false;
    });

    it('should set unsaved changes flag when branding is changed, asyncronously', done => {
      templateEditorFactory.hasUnsavedChanges = false;

      subscribeHandler('risevision.template-editor.brandingUnsavedChanges');

      expect(templateEditorFactory.hasUnsavedChanges).to.be.false;

      setTimeout(function() {
        expect(templateEditorFactory.hasUnsavedChanges).to.be.true;

        done();
      }, 10);
    });
    
    it('should ignore other messages', () => {
      templateEditorFactory.hasUnsavedChanges = true;

      subscribeHandler('otherEvent');

      expect(templateEditorFactory.hasUnsavedChanges).to.be.true;
    });

  });

  describe('$transitions.onStart:', () => {
    let onStartHandler: any, trans: any;
    beforeEach(() => {
      onStartHandler = mockAjsTransitions.onStart.getCall(0).args[1];
      trans = {
        abort: sandbox.stub(),
        to: sandbox.stub().returns({
          name: 'toName',
          params: 'toParams'
        })
      };
    });

    it('should ignore template edit redirects', () => {
      let onStartFilter = mockAjsTransitions.onStart.getCall(0).args[0];

      expect(onStartFilter.to).to.be.a('function');

      expect(onStartFilter.to({name: 'random.route'})).to.be.true;
      expect(onStartFilter.to({name: 'apps.editor.templates'})).to.be.false;
      expect(onStartFilter.to({name: 'apps.editor.templates.edit'})).to.be.false;
    });

    it('should not do anything if there are no unsaved changes', () => {
      templateEditorFactory.hasUnsavedChanges = false;

      onStartHandler(trans);

      autoSaveService.clearSaveTimeout.should.have.been.called;

      trans.abort.should.not.have.been.called;
      templateEditorFactory.save.should.not.have.been.called;
    });

    it('should not do anything if user is not a content editor', () => {
      templateEditorFactory.hasUnsavedChanges = true;
      templateEditorFactory.hasContentEditorRole.returns(false);

      onStartHandler(trans);

      autoSaveService.clearSaveTimeout.should.have.been.called;

      trans.abort.should.not.have.been.called;
      templateEditorFactory.save.should.not.have.been.called;
    });

    it('should abort transition and save changes', () => {
      templateEditorFactory.hasUnsavedChanges = true;

      onStartHandler(trans);

      autoSaveService.clearSaveTimeout.should.have.been.called;

      trans.abort.should.have.been.called;
      templateEditorFactory.save.should.have.been.called;      
    });

    it('should redirect after save is complete', done => {
      templateEditorFactory.hasUnsavedChanges = true;

      onStartHandler(trans);

      setTimeout(() => {
        mockAjsState.go.should.have.been.calledWith('toName', 'toParams');

        done();
      }, 10);
    });

    it('should skip subsequent transition events', done => {
      templateEditorFactory.hasUnsavedChanges = true;

      onStartHandler(trans);

      setTimeout(() => {
        onStartHandler(trans);

        autoSaveService.clearSaveTimeout.should.have.been.calledOnce;

        trans.abort.should.have.been.calledOnce;
        templateEditorFactory.save.should.have.been.calledOnce;      

        done();
      }, 10);
    });

  });

  describe('onbeforeunload:', () => {
    let beforeunloadHandler: any, e: any;
    beforeEach(() => {
      beforeunloadHandler = window.onbeforeunload;
      e = {
        preventDefault: sandbox.spy()
      }
    });

    it('should not notify unsaved changes when closing window if there are no changes', () => {
      beforeunloadHandler(e);

      e.preventDefault.should.not.have.been.called;

      expect(e.returnValue).to.not.be.ok;
    });

    it('should notify unsaved changes when closing window', () => {
      templateEditorFactory.hasUnsavedChanges = true;

      beforeunloadHandler(e);

      e.preventDefault.should.have.been.called;

      expect(e.returnValue).to.be.true;
    });

  });

  it('ngOnDestroy:', () => {
    component.ngOnDestroy();

    subscribeResult.unsubscribe.should.have.been.called;

    expect(window.onbeforeunload).to.not.be.ok;
  });

  describe('considerChromeBarHeight:', () => {
    it('should not consider chrome bar height on desktop browsers', function() {
      isMobileBrowser = false;

      expect(component.considerChromeBarHeight()).to.be.false;
    });

    // Assumes tests are running in Chrome
    it('should consider chrome bar height on mobile Chrome browsers', function() {
      isMobileBrowser = true;

      expect(component.considerChromeBarHeight()).to.be.true;
    });

  });

});
