'use strict';

describe('service: templateEditorFactory:', function() {
  var sandbox = sinon.sandbox.create();

  beforeEach(module('risevision.template-editor.services'));

  beforeEach(module(function ($provide) {
    $provide.service('$q', function() {return Q;});

    $provide.service('presentation',function () {
      return {
        add : function() {},
        get: function() {},
        delete: function () {}
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

  var $state, $httpBackend, templateEditorFactory, messageBox, presentation, processErrorCode, HTML_PRESENTATION_TYPE, blueprintUrl;

  beforeEach(function() {
    inject(function($injector) {
      $state = $injector.get('$state');
      $httpBackend = $injector.get('$httpBackend');
      templateEditorFactory = $injector.get('templateEditorFactory');

      presentation = $injector.get('presentation');
      messageBox = $injector.get('messageBox');
      processErrorCode = $injector.get('processErrorCode');
      HTML_PRESENTATION_TYPE = $injector.get('HTML_PRESENTATION_TYPE');

      blueprintUrl = 'https://widgets.risevision.com/beta/templates/test-id/blueprint.json';
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
      $httpBackend.when('GET', blueprintUrl).respond(200, {
        components: [
          {
            type: 'rise-data-image',
            id: 'rise-data-image-01',
            attributes: {}
          }
        ]
      });

      setTimeout(function() {
        $httpBackend.flush();
      });

      templateEditorFactory.createFromTemplate({ productCode: 'test-id', name: 'Test HTML Template' }).then(function () {
        expect(templateEditorFactory.presentation.id).to.be.undefined;
        expect(templateEditorFactory.presentation.productCode).to.equal('test-id');
        expect(templateEditorFactory.presentation.name).to.equal('Copy of Test HTML Template');
        expect(templateEditorFactory.presentation.presentationType).to.equal(HTML_PRESENTATION_TYPE);
        expect(templateEditorFactory.blueprintData.components.length).to.equal(1);

        expect($state.go).to.have.been.calledWith('apps.editor.templates.add');

        done();
      });
    });
  });

  describe('addPresentation:',function(){
    it('should add the presentation',function(done){
      sandbox.stub(presentation, 'add').returns(Q.resolve({
        item: {
          name: 'Test Presentation',
          id: 'presentationId'
        }
      }));

      $httpBackend.when('GET', blueprintUrl).respond(200, {});
      setTimeout(function() {
        $httpBackend.flush();
      });

      templateEditorFactory.createFromTemplate({ productCode: 'test-id', name: 'Test HTML Template' });
      expect(templateEditorFactory.presentation.id).to.be.undefined;
      expect(templateEditorFactory.presentation.productCode).to.equal('test-id');
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
          productCode: 'test-id',
          templateAttributeData: '{ "attribute1": "value1" }'
        }
      }));

      $httpBackend.when('GET', blueprintUrl).respond(200, {
        components: [
          {
            type: 'rise-data-image',
            id: 'rise-data-image-01',
            attributes: {}
          }
        ]
      });
      setTimeout(function() {
        $httpBackend.flush();
      });

      templateEditorFactory.getPresentation('presentationId')
      .then(function() {
        expect(templateEditorFactory.presentation).to.be.truely;
        expect(templateEditorFactory.presentation.name).to.equal('Test Presentation');
        expect(templateEditorFactory.presentation.templateAttributeData.attribute1).to.equal('value1');
        expect(templateEditorFactory.blueprintData.components.length).to.equal(1);

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
          templateAttributeData: '\\',
          productCode: 'test-id'
        }
      }));

      $httpBackend.when('GET', blueprintUrl).respond(200, {});
      setTimeout(function() {
        $httpBackend.flush();
      });

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

    it('should handle failure to load blueprint.json correctly', function(done) {
      sandbox.stub(presentation, 'get').returns(Q.resolve({
        item: {
          name: 'Test Presentation',
          productCode: 'test-id',
          templateAttributeData: '{ "attribute1": "value1" }'
        }
      }));

      $httpBackend.when('GET', blueprintUrl).respond(500, {});
      setTimeout(function() {
        $httpBackend.flush();
      });

      templateEditorFactory.getPresentation('presentationId')
      .then(function() {
        done('Should not succeed');
      })
      .then(null, function(err) {
        setTimeout(function() {
          expect(templateEditorFactory.presentation).to.be.falsey;
          expect(templateEditorFactory.blueprintData).to.be.falsey;

          done();
        });
      });
    });
  });

  describe('deletePresentation:', function() {
    beforeEach(function () {
      sandbox.stub(presentation, 'get').returns(Q.resolve({
        item: {
          id: 'presentationId',
          name: 'Test Presentation',
          productCode: 'test-id'
        }
      }));
      $httpBackend.when('GET', blueprintUrl).respond(200, {});
      setTimeout(function() {
        $httpBackend.flush();
      });
    });

    it('should delete the presentation', function(done) {
      sandbox.stub(presentation, 'delete').returns(Q.resolve());

      templateEditorFactory.getPresentation('presentationId')
        .then(templateEditorFactory.deletePresentation.bind(templateEditorFactory))
        .then(function() {
          expect(messageBox).to.not.have.been.called;
          expect(templateEditorFactory.savingPresentation).to.be.true;
          expect(templateEditorFactory.loadingPresentation).to.be.true;

          setTimeout(function() {
            expect($state.go).to.have.been.calledWith('apps.editor.list');
            expect(presentation.delete.getCall(0).args[0]).to.equal('presentationId');
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

    it('should fail to delete the presentation', function(done) {
      sandbox.stub(presentation, 'delete').returns(Q.reject());

      templateEditorFactory.getPresentation('presentationId')
        .then(function () {
          return templateEditorFactory.deletePresentation();
        })
        .then(null, function(e) {
          setTimeout(function() {
            expect(presentation.delete.getCall(0).args[0]).to.equal('presentationId');
            expect(processErrorCode).to.have.been.calledWith('Presentation', 'delete', e);
            expect(messageBox).to.have.been.called;
            expect($state.go).to.not.have.been.called;
            expect(templateEditorFactory.apiError).to.be.ok;
            expect(templateEditorFactory.savingPresentation).to.be.false;
            expect(templateEditorFactory.loadingPresentation).to.be.false;

            done();
          }, 10);
        });
    });
  });
});
