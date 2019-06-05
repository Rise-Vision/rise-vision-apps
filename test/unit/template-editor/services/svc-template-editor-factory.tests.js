'use strict';

describe('service: templateEditorFactory:', function() {
  var sandbox = sinon.sandbox.create();

  beforeEach(module('risevision.template-editor.services'));

  beforeEach(module(function ($provide) {
    $provide.service('$q', function() {return Q;});

    $provide.service('presentation',function () {
      return {
        add : function() {},
        update : function() {},
        get: function() {},
        delete: function () {},
        publish: function () {}
      };
    });

    $provide.service('plansFactory',function() {
      return {
        showPlansModal: sandbox.stub()
      };
    });

    $provide.service('$state',function() {
      return {
        go: sandbox.stub()
      };
    });

    $provide.service('store',function() {
      return {
        product: {
          get: function () {}
        }
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

    $provide.service('checkTemplateAccess',function(){
      return sinon.spy(function () {
        return storeAuthorize ? Q.resolve() : Q.reject();
      });
    });

    $provide.factory('templateEditorUtils', function() {
      return {
        showMessageWindow: sandbox.stub()
      };
    });

    $provide.factory('$modal', function() {
      return {
        open: function(params){
          modalOpenCalled = true;
          expect(params).to.be.ok;
          return {
            result: {
              then: function(func) {
                expect(func).to.be.a('function');
              }
            }
          };
        }
      };
    });
  }));

  var $state, $httpBackend, $modal, templateEditorFactory, templateEditorUtils, presentation, processErrorCode,
    HTML_PRESENTATION_TYPE, blueprintUrl, storeAuthorize, checkTemplateAccessSpy, store, plansFactory;

  beforeEach(function() {
    inject(function($injector, checkTemplateAccess) {
      $state = $injector.get('$state');
      $httpBackend = $injector.get('$httpBackend');
      $modal = $injector.get('$modal');
      templateEditorFactory = $injector.get('templateEditorFactory');
      checkTemplateAccessSpy = checkTemplateAccess;

      presentation = $injector.get('presentation');
      plansFactory = $injector.get('plansFactory');
      store = $injector.get('store');
      templateEditorUtils = $injector.get('templateEditorUtils');
      processErrorCode = $injector.get('processErrorCode');
      HTML_PRESENTATION_TYPE = $injector.get('HTML_PRESENTATION_TYPE');

      blueprintUrl = 'https://widgets.risevision.com/stable/templates/test-id/blueprint.json';
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

  describe('createFromProductId:', function() {
    var sampleProduct = { productCode: 'test-product-code', name: 'Test HTML Template from productId' };

    it('should create a new presentation when provided a productId', function(done) {
      storeAuthorize = true;
      sandbox.stub(store.product, 'get').returns(Q.resolve(sampleProduct));
      sandbox.stub(templateEditorFactory, 'createFromTemplate').returns(Q.resolve({}));

      templateEditorFactory.createFromProductId('test-product-id')
      .then(function () {
        expect(templateEditorFactory.createFromTemplate).to.have.been.calledWith(sampleProduct);
        expect(plansFactory.showPlansModal).to.not.have.been.called;
        expect(templateEditorUtils.showMessageWindow).to.not.have.been.called;

        done();
      });
    });

    it('should fail to create a new presentation when not subscribed', function(done) {
      storeAuthorize = false;
      sandbox.stub(store.product, 'get').returns(Q.resolve(sampleProduct));
      sandbox.stub(templateEditorFactory, 'createFromTemplate').returns(Q.resolve({}));

      templateEditorFactory.createFromProductId('test-product-id')
      .catch(function () {
        expect(templateEditorFactory.createFromTemplate).to.not.have.been.called;
        expect(plansFactory.showPlansModal).to.have.been.called;
        expect($state.go).to.have.been.calledWith('apps.editor.list');
        expect(templateEditorUtils.showMessageWindow).to.not.have.been.called;

        done();
      });
    });

    it('should fail to create a new presentation if productId does not exist', function(done) {
      storeAuthorize = true;
      sandbox.stub(store.product, 'get').returns(Q.resolve({}));
      sandbox.stub(templateEditorFactory, 'createFromTemplate').returns(Q.resolve({}));

      templateEditorFactory.createFromProductId('test-product-id')
      .catch(function (err) {
        expect(templateEditorFactory.createFromTemplate).to.not.have.been.called;
        expect(plansFactory.showPlansModal).to.not.have.been.called;
        expect(err.result.error.message).to.equal('Invalid Product Id');
        expect(templateEditorUtils.showMessageWindow).to.have.been.called;

        done();
      });
    });
  });

  describe('createFromTemplate:', function() {
    it('should create a new presentation', function(done) {
      $httpBackend.when('GET', blueprintUrl).respond(200, {
        components: [
          {
            type: 'rise-image',
            id: 'rise-image-01',
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

        expect($state.go).to.have.been.calledWith('apps.editor.templates.edit');

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
          expect(templateEditorUtils.showMessageWindow).to.not.have.been.called;
          expect(templateEditorFactory.savingPresentation).to.be.true;
          expect(templateEditorFactory.loadingPresentation).to.be.true;

          setTimeout(function(){
            expect($state.go).to.have.been.calledWith('apps.editor.templates.edit');
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
          expect(templateEditorUtils.showMessageWindow).to.have.been.called;

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

  describe('updatePresentation:',function(){
    it('should update the presentation',function(done){
      sandbox.stub(presentation, 'update').returns(Q.resolve({
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

      templateEditorFactory.updatePresentation()
        .then(function() {
          expect(templateEditorUtils.showMessageWindow).to.not.have.been.called;
          expect(templateEditorFactory.savingPresentation).to.be.true;
          expect(templateEditorFactory.loadingPresentation).to.be.true;

          setTimeout(function(){
            expect(presentation.update.getCall(0).args[1].templateAttributeData).to.equal('{}');
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

    it('should show an error if fails to update presentation',function(done){
      sandbox.stub(presentation, 'update').returns(Q.reject({ name: 'Test Presentation' }));

      templateEditorFactory.updatePresentation()
        .then(function(result) {
          done(result);
        })
        .then(null, function(e) {
          expect(e).to.be.ok;
          expect(templateEditorFactory.errorMessage).to.be.ok;
          expect(templateEditorFactory.errorMessage).to.equal('Failed to update Presentation.');

          processErrorCode.should.have.been.calledWith('Presentation', 'update', e);
          expect(templateEditorFactory.apiError).to.be.ok;
          expect(templateEditorUtils.showMessageWindow).to.have.been.called;

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
            type: 'rise-image',
            id: 'rise-image-01',
            attributes: {}
          }
        ]
      });
      setTimeout(function() {
        $httpBackend.flush();
      });

      var modalOpenStub = sinon.stub($modal, 'open', function () {
        return {
          result: {
            then: function() {}
          }
        }
      });

      storeAuthorize = true;

      templateEditorFactory.getPresentation('presentationId')
      .then(function() {
        expect(templateEditorFactory.presentation).to.be.truely;
        expect(templateEditorFactory.presentation.name).to.equal('Test Presentation');
        expect(templateEditorFactory.presentation.templateAttributeData.attribute1).to.equal('value1');
        expect(templateEditorFactory.blueprintData.components.length).to.equal(1);
        expect(checkTemplateAccessSpy).to.have.been.calledWith('test-id');
        expect(modalOpenStub).to.not.have.been.called;

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

      storeAuthorize = true;

      templateEditorFactory.getPresentation('presentationId')
      .then(function() {
        expect(templateEditorFactory.presentation).to.be.truely;
        expect(templateEditorFactory.presentation.templateAttributeData).to.be.truely;
        expect(checkTemplateAccessSpy).to.have.been.calledWith('test-id');

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
      storeAuthorize = true;

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
        expect(templateEditorUtils.showMessageWindow).to.have.been.called;

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

    it( 'should open expired/cancelled modal when not authorized', function(done) {
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
            type: 'rise-image',
            id: 'rise-image-01',
            attributes: {}
          }
        ]
      });
      setTimeout(function() {
        $httpBackend.flush();
      });

      var modalOpenStub = sinon.stub($modal, 'open', function () {
        return {
          result: {
            then: function() {}
          }
        }
      });

      storeAuthorize = false;

      templateEditorFactory.getPresentation('presentationId')
        .then(function() {
          expect(checkTemplateAccessSpy).to.have.been.calledWith('test-id');

          expect(modalOpenStub).to.have.been.called;

          setTimeout(function() {
            done();
          }, 10);
        })
        .then(null, function(err) {
          done(err);
        })
        .then(null, done);
    } );
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
          expect(templateEditorUtils.showMessageWindow).to.not.have.been.called;
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
            expect(templateEditorUtils.showMessageWindow).to.have.been.called;
            expect($state.go).to.not.have.been.called;
            expect(templateEditorFactory.apiError).to.be.ok;
            expect(templateEditorFactory.savingPresentation).to.be.false;
            expect(templateEditorFactory.loadingPresentation).to.be.false;

            done();
          }, 10);
        });
    });
  });

  describe('isRevised:', function() {
    beforeEach(function() {
      templateEditorFactory.presentation = {};
    });

    it('should default to false', function() {
      expect(templateEditorFactory.isRevised()).to.be.false;
    });

    it('should not be revised if published', function() {
      templateEditorFactory.presentation.revisionStatusName = 'Published';

      expect(templateEditorFactory.isRevised()).to.be.false;
    });

    it('should be revised with revision status Revised', function() {
      templateEditorFactory.presentation.revisionStatusName = 'Revised';

      expect(templateEditorFactory.isRevised()).to.be.true;
    });
  });

  describe('publishPresentation: ', function() {
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

    it('should publish the presentation', function(done) {
      sandbox.stub(presentation, 'publish').returns(Q.resolve());

      var timeBeforePublish = new Date();

      templateEditorFactory.getPresentation('presentationId')
        .then(function () {
          return templateEditorFactory.publishPresentation(templateEditorFactory);
        })
        .then(function() {
          expect(templateEditorUtils.showMessageWindow).to.not.have.been.called;
          expect(templateEditorFactory.savingPresentation).to.be.true;
          expect(templateEditorFactory.loadingPresentation).to.be.true;

          setTimeout(function() {
            expect(templateEditorFactory.presentation.revisionStatusName).to.equal('Published');
            expect(templateEditorFactory.presentation.changeDate).to.be.gte(timeBeforePublish);
            expect(templateEditorFactory.presentation.changedBy).to.equal("testusername");
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

    it('should show an error if fails to publish the presentation', function(done) {
      sandbox.stub(presentation, 'publish').returns(Q.reject());

      templateEditorFactory.getPresentation('presentationId')
        .then(function () {
          return templateEditorFactory.publishPresentation();
        })
        .then(null, function(e) {
          setTimeout(function() {
            expect(templateEditorFactory.savingPresentation).to.be.false;
            expect(templateEditorFactory.loadingPresentation).to.be.false;
            expect(templateEditorFactory.errorMessage).to.be.ok;
            expect(templateEditorFactory.apiError).to.be.ok;
            expect(templateEditorUtils.showMessageWindow).to.have.been.called;

            done();
          }, 10);
        });
    });
  });
});
