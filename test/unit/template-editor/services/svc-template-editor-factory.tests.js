'use strict';

describe('service: templateEditorFactory:', function() {
  var sandbox = sinon.sandbox.create();

  beforeEach(module('risevision.template-editor.services'));

  beforeEach(module(function ($provide) {
    $provide.service('$q', function() {return Q;});

    $provide.service('presentation',function () {
      return {
        add : function(){},
        get: function() {}
      };
    });

    $provide.service('$state',function() {
      return {
        go: sandbox.stub()
      };
    });

    $provide.service('userState', function() {
      return {
        getUsername: function() {
          return 'testusername';
        },
        _restoreState: function() {}
      };
    });

    $provide.service('processErrorCode', function() {
      return sandbox.spy(function() { return 'error'; });
    });

    $provide.factory('messageBox', function() {
      return sandbox.stub();
    });
  }));

  var $state, templateEditorFactory, messageBox, presentation, processErrorCode, HTML_PRESENTATION_TYPE;

  beforeEach(function() {
    inject(function($injector) {
      $state = $injector.get('$state');
      templateEditorFactory = $injector.get('templateEditorFactory');

      presentation = $injector.get('presentation');
      messageBox = $injector.get('messageBox');
      processErrorCode = $injector.get('processErrorCode');
      HTML_PRESENTATION_TYPE = $injector.get('HTML_PRESENTATION_TYPE');
    });
  });

  afterEach(function() {
    sandbox.restore();
  });

  it('should initialize', function() {
    expect(templateEditorFactory).to.be.truely;

    expect(templateEditorFactory.presentation).to.be.truely;
    expect(templateEditorFactory.loadingPresentation).to.be.false;
    expect(templateEditorFactory.savingPresentation).to.be.false;
    expect(templateEditorFactory.apiError).to.not.be.truely;

    expect(templateEditorFactory.getPresentation).to.be.a('function');
    expect(templateEditorFactory.addPresentation).to.be.a('function');
  });

  describe('createFromTemplate:', function() {
    it('should create a new presentation', function(done) {
      templateEditorFactory.createFromTemplate({ productId: 'test-id', name: 'Test HTML Template' });

      expect(templateEditorFactory.presentation.id).to.be.undefined;
      expect(templateEditorFactory.presentation.productId).to.equal('test-id');
      expect(templateEditorFactory.presentation.name).to.equal('Copy of Test HTML Template');
      expect(templateEditorFactory.presentation.presentationType).to.equal(HTML_PRESENTATION_TYPE);

      expect($state.go).to.have.been.calledWith('apps.editor.templates.add');

      done();
    });
  });

  describe('addPresentation:',function(){
    it('should add the presentation',function(done){
      sandbox.stub(presentation, 'add').returns(Q.resolve({
        item: {
          name: 'Test Presentation',
          id: "presentationId",
        }
      }));

      templateEditorFactory.createFromTemplate({ productId: 'test-id', name: 'Test HTML Template' });
      expect(templateEditorFactory.presentation.id).to.be.undefined;
      expect(templateEditorFactory.presentation.productId).to.equal('test-id');
      expect(templateEditorFactory.presentation.templateAttributeData).to.deep.equal({});

      templateEditorFactory.addPresentation()
        .then(function() {
          expect(messageBox).to.not.have.been.called;
          expect(templateEditorFactory.savingPresentation).to.be.true;
          expect(templateEditorFactory.loadingPresentation).to.be.true;

          setTimeout(function(){
            expect($state.go).to.have.been.calledWith('apps.editor.templates.add');
            expect(presentation.add.getCall(0).args[0].templateAttributeData).to.equal('{}');
            expect(templateEditorFactory.presentation.templateAttributeData).to.deep.equal({});
            expect(templateEditorFactory.savingPresentation).to.be.false;
            expect(templateEditorFactory.loadingPresentation).to.be.false;
            expect(templateEditorFactory.errorMessage).to.not.be.ok;
            expect(templateEditorFactory.apiError).to.not.be.ok;

            done();
          },10);
        })
        .then(null, function(err) {
          done(err);
        })
        .then(null, done);
    });

    it('should show an error if fails to add presentation',function(done){
      sandbox.stub(presentation, 'add').returns(Q.reject({ name: 'Test Presentation' }));

      templateEditorFactory.addPresentation()
        .then(function(result) {
          done(result);
        })
        .then(null, function(e) {
          expect(e).to.be.ok;
          expect(templateEditorFactory.errorMessage).to.be.ok;
          expect(templateEditorFactory.errorMessage).to.equal('Failed to add Presentation.');

          processErrorCode.should.have.been.calledWith('Presentation', 'add', e);
          expect(templateEditorFactory.apiError).to.be.ok;
          expect(messageBox).to.have.been.called;

          setTimeout(function() {
            expect(templateEditorFactory.loadingPresentation).to.be.false;
            expect(templateEditorFactory.savingPresentation).to.be.false;
            expect($state.go).to.not.have.been.called;

            done();
          }, 10);
        })
        .then(null, done);
    });
  });

  describe('getPresentation:', function() {
    it('should get the presentation', function(done) {
      sandbox.stub(presentation, 'get').returns(Q.resolve({
        item: {
          name: 'Test Presentation',
          templateAttributeData: '{ "attribute1": "value1" }'
        }
      }));

      templateEditorFactory.getPresentation('presentationId')
      .then(function() {
        expect(templateEditorFactory.presentation).to.be.truely;
        expect(templateEditorFactory.presentation.name).to.equal('Test Presentation');
        expect(templateEditorFactory.presentation.templateAttributeData.attribute1).to.equal('value1');

        setTimeout(function() {
          expect(templateEditorFactory.loadingPresentation).to.be.false;
          expect($state.go).to.not.have.been.called;

          done();
        }, 10);
      })
      .then(null, function(err) {
        done(err);
      })
      .then(null, done);
    });

    it('should get the presentation with invalid JSON data', function(done) {
      sandbox.stub(presentation, 'get').returns(Q.resolve({
        item: {
          templateAttributeData: '\\'
        }
      }));

      templateEditorFactory.getPresentation('presentationId')
      .then(function() {
        expect(templateEditorFactory.presentation).to.be.truely;
        expect(templateEditorFactory.presentation.templateAttributeData).to.be.truely;

        setTimeout(function() {
          done();
        }, 10);
      })
      .then(null, function(err) {
        done(err);
      })
      .then(null, done);
    });

    it('should handle failure to get presentation correctly', function(done) {
      sandbox.stub(presentation, 'get').returns(Q.reject({ name: 'Test Presentation' }));

      templateEditorFactory.getPresentation()
      .then(function(result) {
        done(result);
      })
      .then(null, function(e) {
        expect(e).to.be.ok;
        expect(templateEditorFactory.errorMessage).to.be.ok;
        expect(templateEditorFactory.errorMessage).to.equal('Failed to get Presentation.');

        processErrorCode.should.have.been.calledWith('Presentation', 'get', e);
        expect(templateEditorFactory.apiError).to.be.ok;
        expect(messageBox).to.have.been.called;

        setTimeout(function() {
          expect(templateEditorFactory.loadingPresentation).to.be.false;
          expect($state.go).to.not.have.been.called;

          done();
        }, 10);
      })
      .then(null, done);
    });
  });
});
