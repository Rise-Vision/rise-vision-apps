'use strict';
describe('service: editorFactory:', function() {
  var sandbox = sinon.sandbox.create();
  var messageBoxStub = sinon.stub();

  beforeEach(module('risevision.editor.services'));
  beforeEach(module(function ($provide) {
    $provide.service('$q', function() {return Q;});

    $provide.service('presentation',function () {
      return {
        _presentation: {
          id: "presentationId",
          name: "some presentation"
        },
        _restored_presentation: {
          id: "presentationId",
          name: "restored presentation"
        },
        add : function(){
          var deferred = Q.defer();
          if(updatePresentation){
            deferred.resolve({item: this._presentation});
          }else{
            deferred.reject({result: {error: { message: 'ERROR; could not create presentation'}}});
          }
          return deferred.promise;
        },
        update : function(presentation){
          var deferred = Q.defer();
          if(updatePresentation){
            deferred.resolve({item: this._presentation});
          }else{
            deferred.reject({result: {error: { message: 'ERROR; could not update presentation'}}});
          }
          return deferred.promise;
        },
        get: function(presentationId) {
          var deferred = Q.defer();
          if(updatePresentation){
            deferred.resolve({item: this._presentation});
          }else{
            deferred.reject({status: 403, result: {error: { message: 'ERROR; could not get presentation'}}});
          }
          return deferred.promise;
        },
        delete: function(presentationId) {
          var deferred = Q.defer();
          if(updatePresentation){
            deferred.resolve(presentationId);
          }else{
            deferred.reject({result: {error: { message: 'ERROR; could not delete presentation'}}});
          }
          return deferred.promise;
        },
        publish: function(presentationId) {
          var deferred = Q.defer();
          if(updatePresentation){
            deferred.resolve({item: this._presentation});
          }else{
            deferred.reject({result: {error: { message: 'ERROR; could not publish presentation'}}});
          }
          return deferred.promise;
        },
        restore: function(presentationId) {
          var deferred = Q.defer();
          if(updatePresentation){
            deferred.resolve({item: this._restored_presentation});
          }else{
            deferred.reject({result: {error: { message: 'ERROR; could not restore presentation'}}});
          }
          return deferred.promise;
        }
      };
    });
    $provide.service('presentationParser', function() {
      return {
        validatePresentation: function(presentation) {
          return true;
        },
        parsePresentation: sinon.spy(),
        updatePresentation: sinon.spy()
      };
    });
    $provide.service('distributionParser', function() {
      return {
        parseDistribution: sinon.spy(),
        updateDistribution: sinon.spy()
      };
    });
    $provide.service('presentationTracker', function() {
      return sinon.stub();
    });
    $provide.service('storeProduct', function() {
      return storeProduct = {
        list: function() {
          return Q.resolve({items:[{productCode: 'test'}]});
        },
        get: function () {}
      };
    });
    $provide.service('showLegacyWarning',function(){
      return sinon.spy();
    });
    $provide.service('$state',function(){
      return {
        go : sinon.spy(function(state, params){
          if (state){
            currentState = state;
            stateParams = params;
          }
          return Q.resolve();
        }),
        is: function(state) {
          return state === currentState;
        }
      };
    });
    $provide.service('userState', function() {
      return {
        getUsername : function() {
          return 'testusername';
        },
        _restoreState : function() {}
      };
    });
    $provide.service('userAuthFactory', function() {
      return {
        addEventListenerVisibilityAPI : function() {},
        removeEventListenerVisibilityAPI : function() {}
      };
    });
    $provide.service('$modal',function(){
      return {
        open: function() {
          return {
            result: Q.resolve({rvaEntityId: 'id1'})
          }
        }
      };
    });
    $provide.service('processErrorCode', function() {
      return processErrorCode = sinon.spy(function() { return 'error'; });
    });
    $provide.service('createFirstSchedule', function() {
      return sinon.stub();
    });
    $provide.service('$window', function() {
      return {
        open: function(url, target) {
        },
        location: {
          reload: sinon.stub()
        }
      };
    });
    $provide.value('VIEWER_URL', 'http://rvaviewer-test.appspot.com');
    $provide.value('TEMPLATES_TYPE', 'Templates');
    $provide.factory('messageBox', function() {
      return messageBoxStub;
    });
  }));
  var editorFactory, presentationTracker, updatePresentation, currentState, $state, stateParams,
    presentationParser, distributionParser, $window, $modal, processErrorCode, createFirstSchedule, userAuthFactory,
    $rootScope, storeProduct, showLegacyWarning;
  beforeEach(function(){
    currentState = undefined;
    updatePresentation = true;

    inject(function($injector){
      editorFactory = $injector.get('editorFactory');
      presentationParser = $injector.get('presentationParser');
      distributionParser = $injector.get('distributionParser')
      $window = $injector.get('$window');
      $modal = $injector.get('$modal');
      $state = $injector.get('$state');
      showLegacyWarning = $injector.get('showLegacyWarning');
      createFirstSchedule = $injector.get('createFirstSchedule');
      userAuthFactory = $injector.get('userAuthFactory');
      $rootScope = $injector.get('$rootScope');
      presentationTracker = $injector.get('presentationTracker');
    });
  });

  afterEach(function() {
    sandbox.restore();
    messageBoxStub.reset();
  });

  it('should exist',function(){
    expect(editorFactory).to.be.truely;

    expect(editorFactory.presentation).to.be.truely;
    expect(editorFactory.loadingPresentation).to.be.false;
    expect(editorFactory.savingPresentation).to.be.false;
    expect(editorFactory.apiError).to.not.be.truely;

    expect(editorFactory.newPresentation).to.be.a('function');
    expect(editorFactory.getPresentation).to.be.a('function');
    expect(editorFactory.addPresentation).to.be.a('function');
    expect(editorFactory.updatePresentation).to.be.a('function');
    expect(editorFactory.deletePresentationByObject).to.be.a('function');
    expect(editorFactory.deletePresentation).to.be.a('function');
    expect(editorFactory.isRevised).to.be.a('function');
    expect(editorFactory.copyPresentation).to.be.a('function');
    expect(editorFactory.addPresentationModal).to.be.a('function');
    expect(editorFactory.saveAndPreview).to.be.a('function');
    expect(editorFactory.preview).to.be.a('function');
    expect(editorFactory.addFromSharedTemplateModal).to.be.a('function');
  });

  it('should initialize',function(){
    expect(editorFactory.presentation.layout).to.be.ok;
    presentationParser.parsePresentation.should.have.been.called;
    expect(editorFactory.presentationId).to.not.be.ok;
  });


  it('newPresentation: should reset the presentation',function(){
    editorFactory.presentation.id = 'presentationId';

    editorFactory.newPresentation();

    expect(presentationTracker).to.have.been.calledWith('New Presentation');

    expect(editorFactory.presentation.layout).to.be.ok;
    presentationParser.parsePresentation.should.have.been.called;
    expect(editorFactory.presentationId).to.not.be.ok;
  });

  describe('getPresentation:',function(){
    it("should get the presentation",function(done){
      editorFactory.getPresentation("presentationId")
      .then(function() {
        expect(editorFactory.presentation).to.be.truely;
        expect(editorFactory.presentation.name).to.equal("some presentation");
        presentationParser.parsePresentation.should.have.been.called;
        distributionParser.parseDistribution.should.have.been.called;

        setTimeout(function() {
          expect(editorFactory.loadingPresentation).to.be.false;

          done();
        }, 10);
      })
      .then(null, function() {
        done("error");
      })
      .then(null,done);
    });

    it("should handle failure to get presentation correctly",function(done){
      updatePresentation = false;

      editorFactory.getPresentation()
      .then(function(result) {
        done(result);
      })
      .then(null, function(e) {
        expect(e).to.be.ok;
        expect(editorFactory.errorMessage).to.be.ok;
        expect(editorFactory.errorMessage).to.equal("Failed to get Presentation.");

        processErrorCode.should.have.been.calledWith('Presentation', 'get', e);
        expect(editorFactory.apiError).to.be.ok;
        expect(messageBoxStub).to.have.been.called;

        setTimeout(function() {
          expect(editorFactory.loadingPresentation).to.be.false;

          done();
        }, 10);
      })
      .then(null,done);
    });

    it('should flag legacy items',function(done){
      presentationParser.hasLegacyItems = true;
      editorFactory.getPresentation("presentationId")
      .then(function() {
        expect(editorFactory.presentation).to.be.ok;
        showLegacyWarning.should.have.been.calledWith(editorFactory.presentation);

        setTimeout(function() {
          expect(editorFactory.loadingPresentation).to.be.false;
          done();
        }, 10);
      })
      .then(null, function() {
        done("error");
      })
      .then(null,done);
    })
  });

  describe('addPresentation:',function(){
    it('should add the presentation',function(done){
      updatePresentation = true;

      editorFactory.addPresentation()
        .then(function() {
          expect(messageBoxStub).to.not.have.been.called;
          presentationParser.updatePresentation.should.have.been.called;
          distributionParser.updateDistribution.should.have.been.called;
          expect(editorFactory.savingPresentation).to.be.true;
          expect(editorFactory.loadingPresentation).to.be.true;

          setTimeout(function(){
            expect(currentState).to.equal('apps.editor.workspace.artboard');
            expect(presentationTracker).to.have.been.calledTwice;
            expect(presentationTracker).to.have.been.calledWith('Presentation Created',
              'presentationId', 'some presentation', {
                presentationType: 'Presentation',
                sharedTemplate: 'blank'
            });
            expect(presentationTracker).to.have.been.calledWith('Presentation Published',
              'presentationId', 'some presentation', {
                presentationType: 'Presentation',
                sharedTemplate: 'blank'
            });
            expect(editorFactory.savingPresentation).to.be.false;
            expect(editorFactory.loadingPresentation).to.be.false;
            expect(editorFactory.errorMessage).to.not.be.ok;
            expect(editorFactory.apiError).to.not.be.ok;

            done();
          },10);
        });
    });

    it('should fail to add the presentation because of validation errors',function(done){
      currentState = 'apps.editor.workspace.htmleditor';

      sandbox.stub(presentationParser, "validatePresentation").returns(false);

      editorFactory.addPresentation()
        .catch(function() {
          expect(messageBoxStub).to.have.been.called;
          done();
        });
    });

    it('should create first Schedule when adding first presentation',function(done){
      updatePresentation = true;

      var $modalOpenSpy = sinon.spy($modal, 'open');

      editorFactory.addPresentation();

      setTimeout(function(){
        createFirstSchedule.should.have.been.calledWith(sinon.match.object);

        done();
      },100);
    });

    it('should parse and add the presentation when $state is html-editor',function(done){
      updatePresentation = true;
      currentState = 'apps.editor.workspace.htmleditor';

      editorFactory.addPresentation()
        .then(function() {
          presentationParser.parsePresentation.should.have.been.called;
          presentationParser.updatePresentation.should.not.have.been.called;
          distributionParser.updateDistribution.should.not.have.been.called;

          expect(editorFactory.savingPresentation).to.be.true;
          expect(editorFactory.loadingPresentation).to.be.true;

          setTimeout(function(){
            expect(currentState).to.equal('apps.editor.workspace.artboard');
            expect(presentationTracker).to.have.been.calledTwice;
            expect(presentationTracker).to.have.been.calledWith('Presentation Created',
              'presentationId', 'some presentation', {
                presentationType: 'Presentation',
                sharedTemplate: 'blank'
            });
            expect(presentationTracker).to.have.been.calledWith('Presentation Published',
              'presentationId', 'some presentation', {
                presentationType: 'Presentation',
                sharedTemplate: 'blank'
            });
            expect(editorFactory.savingPresentation).to.be.false;
            expect(editorFactory.loadingPresentation).to.be.false;
            expect(editorFactory.errorMessage).to.not.be.ok;
            expect(editorFactory.apiError).to.not.be.ok;

            done();
          },10);

        }, done);

    });

    it('should show an error if fails to create presentation',function(done){
      updatePresentation = false;

      editorFactory.addPresentation();

      expect(editorFactory.savingPresentation).to.be.true;
      expect(editorFactory.loadingPresentation).to.be.true;

      setTimeout(function(){
        expect(currentState).to.be.empty;
        expect(presentationTracker).to.not.have.been.called;
        expect(editorFactory.savingPresentation).to.be.false;
        expect(editorFactory.loadingPresentation).to.be.false;

        expect(editorFactory.errorMessage).to.be.ok;
        expect(editorFactory.apiError).to.be.ok;
        expect(messageBoxStub).to.have.been.called;

        done();
      },10);
    });

    it('should update embedded ids',function(){
      editorFactory.presentation.placeholders = [
        {
          items: [
            {
              type: 'presentation',
              objectData: 'presentation1'
            }
          ]
        },
        {
          items: [
            {
              type: 'presentation',
              objectData: 'presentation2'
            },
            {
              type: 'presentation',
              objectData: 'presentation2'
            }
          ]
        }
      ];

      editorFactory.addPresentation()
        .then(function() {
          expect(editorFactory.presentation.embeddedIds).to.deep.equal(['presentation2', 'presentation1']);
        });
    });
  });

  describe('updatePresentation: ',function(){
    it('should update the presentation',function(done){
      updatePresentation = true;
      currentState = 'apps.editor.workspace.artboard';

      editorFactory.updatePresentation()
        .then(function() {
          expect(messageBoxStub).to.not.have.been.called;

          presentationParser.updatePresentation.should.have.been.called;
          distributionParser.updateDistribution.should.have.been.called;

          expect(editorFactory.savingPresentation).to.be.true;
          expect(editorFactory.loadingPresentation).to.be.true;

          setTimeout(function(){
            expect(presentationTracker).to.have.been.calledWith('Presentation Updated');

            expect(editorFactory.savingPresentation).to.be.false;
            expect(editorFactory.loadingPresentation).to.be.false;
            expect(editorFactory.errorMessage).to.not.be.ok;
            expect(editorFactory.apiError).to.not.be.ok;
            done();
          },10);

        });
    });

    it('should fail to update the presentation because of validation errors',function(done){
      currentState = 'apps.editor.workspace.htmleditor';

      sandbox.stub(presentationParser, "validatePresentation").returns(false);

      editorFactory.updatePresentation().
        catch(function() {
          expect(messageBoxStub).to.have.been.called;
          done();
        });
    });

    it('should parse and update the presentation when $state is html-editor',function(done){
      updatePresentation = true;
      currentState = 'apps.editor.workspace.htmleditor';

      editorFactory.updatePresentation()
        .then(function() {
          presentationParser.parsePresentation.should.have.been.called;
          presentationParser.updatePresentation.should.not.have.been.called;
          distributionParser.updateDistribution.should.not.have.been.called;

          expect(editorFactory.savingPresentation).to.be.true;
          expect(editorFactory.loadingPresentation).to.be.true;

          setTimeout(function(){
            expect(presentationTracker).to.have.been.calledWith('Presentation Updated');
            expect(editorFactory.savingPresentation).to.be.false;
            expect(editorFactory.loadingPresentation).to.be.false;
            expect(editorFactory.errorMessage).to.not.be.ok;
            expect(editorFactory.apiError).to.not.be.ok;
            done();
          },10);
        });

    });

    it('should show an error if fails to update the presentation',function(done){
      updatePresentation = false;

      editorFactory.updatePresentation();

      expect(editorFactory.savingPresentation).to.be.true;
      expect(editorFactory.loadingPresentation).to.be.true;

      setTimeout(function(){
        expect(presentationTracker).to.not.have.been.called;
        expect(editorFactory.savingPresentation).to.be.false;
        expect(editorFactory.loadingPresentation).to.be.false;

        expect(editorFactory.errorMessage).to.be.ok;
        expect(editorFactory.apiError).to.be.ok;
        expect(messageBoxStub).to.have.been.called;

        done();
      },10);
    });
  });

  describe('isRevised: ', function() {
    beforeEach(function() {
      editorFactory.newPresentation();
    });

    it('should default to false', function() {
      expect(editorFactory.isRevised()).to.be.false;
    });

    it('should not be revised if published', function() {
      editorFactory.presentation.revisionStatusName = 'Published';

      expect(editorFactory.isRevised()).to.be.false;
    });

    it('should be revised with revision status Revised', function() {
      editorFactory.presentation.revisionStatusName = 'Revised';

      expect(editorFactory.isRevised()).to.be.true;
    });

  });

  describe('deletePresentationByObject: ',function(){
    it('should delete the presentation and unassign its license',function(done){
      updatePresentation = true;

      editorFactory.deletePresentationByObject({
        id: 'presentationId',
      }).then(function(){
        expect(presentationTracker).to.have.been.calledWith('Presentation Deleted');

        done();
      }, function() {
        done('error');
      });
    });
    
    it('should show an error if fails to delete the presentation',function(done){
      updatePresentation = false;
      
      editorFactory.deletePresentationByObject({
        id: 'presentationId'
      }).then(function(){
        done('error');
      }, function() {
        done();
      });
    });
  });

  describe('deletePresentation: ',function(){
    beforeEach(function() {
      sandbox.stub(editorFactory, 'deletePresentationByObject').returns(Q.resolve());
    });

    it('should delete the presentation',function(done){
      var broadcastSpy = sinon.spy($rootScope,'$broadcast');

      editorFactory.deletePresentation();

      expect(editorFactory.loadingPresentation).to.be.true;

      setTimeout(function(){
        expect(editorFactory.loadingPresentation).to.be.false;
        expect(editorFactory.errorMessage).to.not.be.ok;
        expect(editorFactory.apiError).to.not.be.ok;
        expect(currentState).to.equal('apps.editor.list');
        broadcastSpy.should.have.been.calledWith('presentationDeleted');
        done();
      },10);
    });

    it('should show an error if fails to delete the presentation',function(done){
      editorFactory.deletePresentationByObject.returns(Q.reject());

      editorFactory.deletePresentation();

      expect(editorFactory.loadingPresentation).to.be.true;

      setTimeout(function(){
        expect(currentState).to.be.empty;
        expect(presentationTracker).to.not.have.been.called;
        expect(editorFactory.loadingPresentation).to.be.false;

        expect(editorFactory.errorMessage).to.be.ok;
        expect(editorFactory.apiError).to.be.ok;
        expect(messageBoxStub).to.have.been.called;

        done();
      },10);
    });
  });

  describe('copyPresentation: ', function() {
    it('should copy the presentation',function(){
      editorFactory.presentation = {
        id: 'someId',
        name: 'New Presentation',
        revisionStatusname: 'revised'
      };

      editorFactory.copyPresentation();

      expect(editorFactory.presentation.id).to.not.be.ok;
      expect(editorFactory.presentation.name).to.equal('Copy of New Presentation');

      expect(presentationTracker).to.have.been.calledWith('Presentation Copied');
      expect(currentState).to.equal('apps.editor.workspace.artboard');
      expect(stateParams).to.deep.equal({
        presentationId: 'new',
        copyOf: 'someId',
        isLoaded: true
      });
    });

    it('should copy a template',function(){
      editorFactory.presentation = {
        id: 'someId',
        name: 'New Presentation',
        revisionStatusname: 'revised',
        isTemplate: true
      };

      editorFactory.copyPresentation();

      expect(editorFactory.presentation.id).to.not.be.ok;
      expect(editorFactory.presentation.name).to.equal('Copy of New Presentation');
      expect(editorFactory.presentation.isTemplate).to.be.false;

      expect(presentationTracker).to.have.been.calledWith('Template Copied');
      expect(currentState).to.equal('apps.editor.workspace.artboard');
      expect(stateParams).to.deep.equal({
        presentationId: 'new',
        copyOf: 'someId',
        isLoaded: true
      });
    });
  });

  it('addPresentationModal:', function(done) {
    sinon.stub(editorFactory, 'addFromProduct');

    editorFactory.addPresentationModal();
    expect(presentationTracker).to.have.been.calledWith("Add Presentation");

    setTimeout(function() {
      editorFactory.addFromProduct.should.have.been.called;

      done();
    }, 10);
  });

  describe('addFromProductId:', function() {
    var sampleProduct = { productCode: 'test-product-code', name: 'Test HTML Template from productId' };

    it('should create a new presentation when provided a productId', function(done) {
      sandbox.stub(storeProduct, 'get').returns(Q.resolve(sampleProduct));
      sandbox.stub(editorFactory, 'addFromProduct').returns(Q.resolve({}));

      editorFactory.addFromProductId('test-product-id')
      .then(function () {
        expect(editorFactory.addFromProduct).to.have.been.calledWith(sampleProduct);
        expect(messageBoxStub).to.not.have.been.called;

        done();
      });
    });

    it('should fail to create a new presentation if productId does not exist', function(done) {
      sandbox.stub(storeProduct, 'get').returns(Q.resolve({}));
      sandbox.stub(editorFactory, 'addFromProduct').returns(Q.resolve({}));

      editorFactory.addFromProductId('test-product-id')
      .catch(function (err) {
        expect(editorFactory.addFromProduct).to.not.have.been.called;
        expect(err.result.error.message).to.equal('Invalid Product Id');
        expect(messageBoxStub).to.have.been.called;

        done();
      });
    });
  });

  describe('addFromProduct:', function() {
    it('should validate productDetails', function(done) {
      sinon.stub(editorFactory, 'copyTemplate');

      editorFactory.addFromProduct();
      editorFactory.addFromProduct({});

      setTimeout(function() {
        editorFactory.copyTemplate.should.not.have.been.called;
        expect(currentState).to.not.be.ok;

        done();
      }, 10);
    });

    it('should create a presentation using a Classic Template: ', function(done) {
      sinon.stub(editorFactory, 'copyTemplate');

      editorFactory.addFromProduct({rvaEntityId: 'id1'});

      setTimeout(function() {
        editorFactory.copyTemplate.should.have.been.calledWith('id1');

        done();
      }, 10);
    });

    it('should create a presentation using an HTML Template: ', function(done) {
      var productDetails = {
        productTag: ['HTMLTemplates'],
        productId: 'productId'
      };
      sinon.stub(editorFactory, 'copyTemplate');

      editorFactory.addFromProduct(productDetails);

      setTimeout(function() {
        editorFactory.copyTemplate.should.have.not.been.called;

        expect(currentState).to.equal('apps.editor.templates.edit');
        expect(stateParams).to.deep.equal({
          presentationId: 'new',
          productId: productDetails.productId,
          productDetails: productDetails
        });

        done();
      }, 10);
    });
  });

  describe('copyTemplate: ', function() {
    beforeEach(function() {
      sinon.stub(editorFactory, 'copyPresentation');
    });

    it('should not do anything if rvaEntityId is blank', function() {
      sinon.stub(editorFactory, 'getPresentation');

      editorFactory.copyTemplate();

      editorFactory.getPresentation.should.not.have.been.called;
    });

    it('should copy the template based on rvaEntityId', function(done) {
      editorFactory.copyTemplate('presentationId');

      setTimeout(function() {
        editorFactory.copyPresentation.should.have.been.called;

        done();
      }, 10);
    });

    it('should handle failure to copy template', function(done) {
      sinon.stub(editorFactory, 'getPresentation').returns(Q.reject());

      editorFactory.copyTemplate('presentationId')
      .catch(function (err) {
        editorFactory.copyPresentation.should.not.have.been.called;

        expect(currentState).to.equal('apps.editor.list');

        done();
      });
    });

  });

  it('addFromSharedTemplateModal: ', function(done) {
    var $modalOpenSpy = sinon.spy($modal, 'open');

    editorFactory.addFromSharedTemplateModal();
    expect(presentationTracker).to.have.been.calledWith("Add Presentation from Shared Template");

    $modalOpenSpy.should.have.been.calledWith({
      templateUrl: 'partials/editor/shared-templates-modal.html',
      size: 'md',
      controller: 'SharedTemplatesModalController'
    });

    setTimeout(function() {
      expect(editorFactory.loadingPresentation).to.be.false;

      expect(editorFactory.presentation.id).to.not.be.ok;
      expect(editorFactory.presentation.name).to.equal('Copy of some presentation');

      expect(presentationTracker).to.have.been.calledWith('Presentation Copied');
      expect(currentState).to.equal('apps.editor.workspace.artboard');
      expect(stateParams).to.deep.equal({
        presentationId: 'new',
        copyOf: 'presentationId',
        isLoaded: true
      });

      done();
    }, 10);

  });

  describe('saveAndPreview: ', function() {
    it('should add and preview new presentation', function(done) {
      var $windowOpenSpy = sinon.spy($window, 'open');
      var addEventSpy = sinon.spy(userAuthFactory, 'addEventListenerVisibilityAPI');
      var removeEventSpy = sinon.spy(userAuthFactory, 'removeEventListenerVisibilityAPI');

      editorFactory.saveAndPreview()
        .then(function() {
          expect(messageBoxStub).to.not.have.been.called;
          removeEventSpy.should.have.been.called;

          setTimeout(function() {
            $windowOpenSpy.should.have.been.called.twice;
            $windowOpenSpy.should.have.been.calledWith('http://rvaviewer-test.appspot.com/?type=presentation&id=presentationId', 'rvPresentationPreview');
            addEventSpy.should.have.been.called;

            done();
          }, 10);
        });
    });

    it('should save and preview existing presentation', function(done) {
      var $windowOpenSpy = sinon.spy($window, 'open');

      editorFactory.getPresentation("presentationId").then(function() {
        editorFactory.saveAndPreview()
          .then(function() {
            setTimeout(function() {
              $windowOpenSpy.should.have.been.called.twice;
              $windowOpenSpy.should.have.been.calledWith('http://rvaviewer-test.appspot.com/?type=presentation&id=presentationId', 'rvPresentationPreview');

              done();
            }, 10);
          });
      });
    });

    it('should fail to preview a presentation because of validation errors', function(done) {
      var removeEventSpy = sinon.spy(userAuthFactory, 'removeEventListenerVisibilityAPI');

      sandbox.stub(presentationParser, "validatePresentation").returns(false);

      editorFactory.saveAndPreview()
        .catch(function() {
          expect(messageBoxStub).to.have.been.called;
          removeEventSpy.should.not.have.been.called;
          done();
        });
    });

  });

  it('should preview a presentation (or template)', function(done) {
      var $windowOpenSpy = sinon.spy($window, 'open');

      editorFactory.preview('presentationId');

      setTimeout(function() {
        $windowOpenSpy.should.have.been.calledWith('http://rvaviewer-test.appspot.com/?type=presentation&id=presentationId', 'rvPresentationPreview');
        done();
      }, 10);
    });

  describe('publishPresentation: ',function(){
    it('should publish the presentation',function(done){
      updatePresentation = true;

      var timeBeforePublish = new Date();

      editorFactory.publishPresentation();

      expect(editorFactory.savingPresentation).to.be.true;
      expect(editorFactory.loadingPresentation).to.be.true;

      setTimeout(function(){
        expect(presentationTracker).to.have.been.calledWith('Presentation Published');
        expect(editorFactory.presentation.revisionStatusName).to.equal('Published');
        expect(editorFactory.presentation.changeDate).to.be.gte(timeBeforePublish);
        expect(editorFactory.presentation.changedBy).to.equal("testusername");
        expect(editorFactory.savingPresentation).to.be.false;
        expect(editorFactory.loadingPresentation).to.be.false;
        expect(editorFactory.errorMessage).to.not.be.ok;
        expect(editorFactory.apiError).to.not.be.ok;
        done();
      },10);
    });

    it('should show an error if fails to publish the presentation',function(done){
      updatePresentation = false;

      editorFactory.publishPresentation();

      expect(editorFactory.savingPresentation).to.be.true;
      expect(editorFactory.loadingPresentation).to.be.true;

      setTimeout(function(){
        expect(presentationTracker).to.not.have.been.called;
        expect(editorFactory.savingPresentation).to.be.false;
        expect(editorFactory.loadingPresentation).to.be.false;
        expect(editorFactory.errorMessage).to.be.ok;
        expect(editorFactory.apiError).to.be.ok;
        expect(messageBoxStub).to.have.been.called;

        done();
      },10);
    });
  });

  describe('save: ',function(){
    it('should add presentation', function(done){
      var broadcastSpy = sinon.spy($rootScope,'$broadcast');

      editorFactory.save();

      setTimeout(function(){
        expect(presentationTracker).to.have.been.calledTwice;
        expect(presentationTracker).to.have.been.calledWith('Presentation Created',
          'presentationId', 'some presentation', {
            presentationType: 'Presentation',
            sharedTemplate: 'blank'
        });
        expect(presentationTracker).to.have.been.calledWith('Presentation Published',
          'presentationId', 'some presentation', {
            presentationType: 'Presentation',
            sharedTemplate: 'blank'
        });
        broadcastSpy.should.have.been.calledWith('presentationCreated');

        done();
      }, 10);
    });

    it('should update presentation', function(done){
      editorFactory.presentation.id = "presentationId";

      editorFactory.save();

      setTimeout(function(){
        expect(presentationTracker).to.have.been.calledWith("Presentation Updated");

        done();
      }, 10);
    });
  });

  describe('restorePresentation: ',function(){
    it('should restore the presentation',function(done){
      updatePresentation = true;

      editorFactory.restorePresentation();

      expect(editorFactory.loadingPresentation).to.be.true;

      setTimeout(function(){
        expect(presentationTracker).to.have.been.calledWith('Presentation Restored');
        expect(editorFactory.loadingPresentation).to.be.false;
        expect(editorFactory.presentation).to.be.truely;
        expect(editorFactory.presentation.name).to.equal("restored presentation");

        presentationParser.parsePresentation.should.have.been.called;
        distributionParser.parseDistribution.should.have.been.called;

        expect(editorFactory.errorMessage).to.not.be.ok;
        expect(editorFactory.apiError).to.not.be.ok;
        done();
      },10);
    });

    it('should show an error if fails to restore the presentation',function(done){
      updatePresentation = false;

      editorFactory.restorePresentation();

      expect(editorFactory.loadingPresentation).to.be.true;

      setTimeout(function(){
        expect(presentationTracker).to.not.have.been.called;
        expect(editorFactory.loadingPresentation).to.be.false;
        expect(editorFactory.errorMessage).to.be.ok;
        expect(editorFactory.apiError).to.be.ok;
        expect(messageBoxStub).to.have.been.called;

        done();
      },10);
    });
  });

  describe('confirmRestorePresentation: ',function(){
    beforeEach(function() {
      $modal.open = function(obj) {
        return {
          result: {
            then: function(confirmCallback, cancelCallback) {
              this.confirmCallBack = confirmCallback || function() {};
              this.cancelCallback = cancelCallback || function() {};
            }
          },
          close: function(item) {
            this.result.confirmCallBack(item);
          },
          dismiss: function( type ) {
            this.result.cancelCallback(type);
          }
        };
      };
    });

    it('should restore the presentation',function(done){
      sandbox.stub(editorFactory, "restorePresentation");

      var modal = editorFactory.confirmRestorePresentation();

      modal.close();

      setTimeout(function(){
        expect(editorFactory.restorePresentation).to.be.called;
        done();
      },10);
    });

    it('should not restore the presentation',function(done){
      sandbox.stub(editorFactory, "restorePresentation");

      var modal = editorFactory.confirmRestorePresentation();

      modal.dismiss();

      setTimeout(function(){
        expect(editorFactory.restorePresentation).to.not.be.called;
        done();
      },10);
    });
  });

});
