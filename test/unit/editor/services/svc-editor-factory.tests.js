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
        parsePresentation: function(presentation) {
          presentation.parsed = true;
          return {};
        },

        updatePresentation: function(presentation) {
          presentation.updated = true;
        }
      };
    });
    $provide.service('distributionParser', function() {
      return {
        parseDistribution: function(presentation) {
          presentation.distributionParsed = true;
        },
        updateDistribution: function(presentation) {
          presentation.distributionUpdated = true;
        }
      };
    });
    $provide.service('presentationTracker', function() { 
      return function(name) {
        trackerCalled = name;
      };
    });
    $provide.service('store', function() {
      return {
        product: {
          list: function() {
            return Q.resolve({items:[{productCode: 'test'}]});
          }
        }
      };
    });
    $provide.service('$state',function(){
      return {
        go : function(state, params){
          if (state){
            currentState = state;
            stateParams = params;
          }
          return Q.resolve();
        },
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
    $provide.service('scheduleFactory', function() { 
      return {
        createFirstSchedule: function(){
          return Q.resolve();
        }
      };
    });
    $provide.service('$window', function() {
      return {
        open: function(url, target) {
        }
      };
    });
    $provide.value('VIEWER_URL', 'http://rvaviewer-test.appspot.com');
    $provide.value('TEMPLATES_TYPE', 'Templates');
    $provide.factory('messageBox', function() {
      return messageBoxStub;
    });
  }));
  var editorFactory, trackerCalled, updatePresentation, currentState, stateParams, 
    presentationParser, $window, $modal, processErrorCode, scheduleFactory, userAuthFactory,
    $rootScope;
  beforeEach(function(){
    trackerCalled = undefined;
    currentState = undefined;
    updatePresentation = true;

    inject(function($injector){
      editorFactory = $injector.get('editorFactory');
      presentationParser = $injector.get('presentationParser');
      $window = $injector.get('$window');
      $modal = $injector.get('$modal');
      scheduleFactory = $injector.get('scheduleFactory');
      userAuthFactory = $injector.get('userAuthFactory');
      $rootScope = $injector.get('$rootScope');
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
    expect(editorFactory.presentation.parsed).to.be.true;
    expect(editorFactory.presentationId).to.not.be.ok;
  });

  
  it('newPresentation: should reset the presentation',function(){
    editorFactory.presentation.id = 'presentationId';
    
    editorFactory.newPresentation();
    
    expect(trackerCalled).to.equal('New Presentation');
    
    expect(editorFactory.presentation.layout).to.be.ok;
    expect(editorFactory.presentation.parsed).to.be.true;
    expect(editorFactory.presentationId).to.not.be.ok;
  });
    
  describe('getPresentation:',function(){
    it("should get the presentation",function(done){
      editorFactory.getPresentation("presentationId")
      .then(function() {
        expect(editorFactory.presentation).to.be.truely;
        expect(editorFactory.presentation.name).to.equal("some presentation");
        expect(editorFactory.presentation.parsed).to.be.true;
        expect(editorFactory.presentation.distributionParsed).to.be.true;

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
        expect(editorFactory.presentation).to.be.truely;
        expect(editorFactory.hasLegacyItems).to.be.true;

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

      sandbox.stub(presentationParser, "parsePresentation").returns(true);

      editorFactory.addPresentation()
        .then(function() {
          expect(messageBoxStub).to.not.have.been.called;
          expect(editorFactory.presentation.updated).to.be.true;
          expect(editorFactory.presentation.distributionUpdated).to.be.true;
          expect(editorFactory.savingPresentation).to.be.true;
          expect(editorFactory.loadingPresentation).to.be.true;

          setTimeout(function(){
            expect(currentState).to.equal('apps.editor.workspace.artboard');
            expect(trackerCalled).to.equal('Presentation Created');
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

    it('should create first Schedule when adding first presentation and show modal',function(done){
      updatePresentation = true;

      var createFirstScheduleSpy = sinon.spy(scheduleFactory,'createFirstSchedule');
      var $modalOpenSpy = sinon.spy($modal, 'open');

      sandbox.stub(presentationParser, "parsePresentation").returns(true);

      editorFactory.addPresentation();

      setTimeout(function(){
        createFirstScheduleSpy.should.have.been.called;
        $modalOpenSpy.should.have.been.called;
        expect($modalOpenSpy.getCall(0).args[0].templateUrl).to.equal('partials/editor/auto-schedule-modal.html');
        expect($modalOpenSpy.getCall(0).args[0].controller).to.equal('AutoScheduleModalController');  

        done();
      },100);
    });

    it('should parse and add the presentation when $state is html-editor',function(done){
      updatePresentation = true;
      currentState = 'apps.editor.workspace.htmleditor';

      sandbox.stub(presentationParser, "parsePresentation").returns(true);

      editorFactory.addPresentation()
        .then(function() {
          expect(editorFactory.presentation.parsed).to.be.true;
          expect(editorFactory.presentation.distributionUpdated).to.be.true;

          expect(editorFactory.savingPresentation).to.be.true;
          expect(editorFactory.loadingPresentation).to.be.true;
        });

      setTimeout(function(){
        expect(currentState).to.equal('apps.editor.workspace.artboard');
        expect(trackerCalled).to.equal('Presentation Created');
        expect(editorFactory.savingPresentation).to.be.false;
        expect(editorFactory.loadingPresentation).to.be.false;
        expect(editorFactory.errorMessage).to.not.be.ok;
        expect(editorFactory.apiError).to.not.be.ok;
        
        done();
      },10);
    });

    it('should show an error if fails to create presentation',function(done){
      updatePresentation = false;

      editorFactory.addPresentation();
      
      expect(editorFactory.savingPresentation).to.be.true;
      expect(editorFactory.loadingPresentation).to.be.true;

      setTimeout(function(){
        expect(currentState).to.be.empty;
        expect(trackerCalled).to.not.be.ok;
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

      sandbox.stub(presentationParser, "parsePresentation").returns(true);

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

      editorFactory.presentation.updated = false;

      sandbox.stub(presentationParser, "parsePresentation").returns(true);

      editorFactory.updatePresentation()
        .then(function() {
          expect(messageBoxStub).to.not.have.been.called;
          expect(editorFactory.presentation.updated).to.be.true;
          expect(editorFactory.presentation.distributionUpdated).to.be.true;
          expect(editorFactory.savingPresentation).to.be.true;
          expect(editorFactory.loadingPresentation).to.be.true;
        });

      setTimeout(function(){
        expect(trackerCalled).to.equal('Presentation Updated');
        expect(editorFactory.savingPresentation).to.be.false;
        expect(editorFactory.loadingPresentation).to.be.false;
        expect(editorFactory.errorMessage).to.not.be.ok;
        expect(editorFactory.apiError).to.not.be.ok;
        done();
      },10);
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

      editorFactory.presentation.parsed = false;

      sandbox.stub(presentationParser, "parsePresentation").returns(true);

      editorFactory.updatePresentation()
        .then(function() {
          expect(editorFactory.presentation.parsed).to.be.true;
          expect(editorFactory.presentation.distributionUpdated).to.be.true;

          expect(editorFactory.savingPresentation).to.be.true;
          expect(editorFactory.loadingPresentation).to.be.true;
        });

      setTimeout(function(){
        expect(trackerCalled).to.equal('Presentation Updated');
        expect(editorFactory.savingPresentation).to.be.false;
        expect(editorFactory.loadingPresentation).to.be.false;
        expect(editorFactory.errorMessage).to.not.be.ok;
        expect(editorFactory.apiError).to.not.be.ok;
        done();
      },10);
    });

    it('should show an error if fails to update the presentation',function(done){
      updatePresentation = false;

      editorFactory.updatePresentation();

      expect(editorFactory.savingPresentation).to.be.true;
      expect(editorFactory.loadingPresentation).to.be.true;

      setTimeout(function(){
        expect(trackerCalled).to.not.be.ok;
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
  
  describe('deletePresentation: ',function(){
    it('should delete the presentation',function(done){
      updatePresentation = true;
      var broadcastSpy = sinon.spy($rootScope,'$broadcast');

      editorFactory.deletePresentation();
      
      expect(editorFactory.loadingPresentation).to.be.true;

      setTimeout(function(){
        expect(editorFactory.loadingPresentation).to.be.false;
        expect(editorFactory.errorMessage).to.not.be.ok;
        expect(editorFactory.apiError).to.not.be.ok;
        expect(trackerCalled).to.equal('Presentation Deleted');
        expect(currentState).to.equal('apps.editor.list');
        broadcastSpy.should.have.been.calledWith('presentationDeleted');
        done();
      },10);
    });
    
    it('should show an error if fails to delete the presentation',function(done){
      updatePresentation = false;
      
      editorFactory.deletePresentation();
      
      expect(editorFactory.loadingPresentation).to.be.true;

      setTimeout(function(){
        expect(currentState).to.be.empty;
        expect(trackerCalled).to.not.be.ok;
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
      
      expect(trackerCalled).to.equal('Presentation Copied');
      expect(currentState).to.equal('apps.editor.workspace.artboard');
      expect(stateParams).to.deep.equal({presentationId: undefined, copyPresentation:true});
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
      
      expect(trackerCalled).to.equal('Template Copied');
      expect(currentState).to.equal('apps.editor.workspace.artboard');
      expect(stateParams).to.deep.equal({presentationId: undefined, copyPresentation:true});
    });
  });
  
  it('addPresentationModal: ', function(done) {
    editorFactory.addPresentationModal();
    expect(trackerCalled).to.equal("Add Presentation");
    var copyTemplateSpy = sinon.spy(editorFactory, 'copyTemplate');
    
    setTimeout(function() {
      copyTemplateSpy.should.have.been.called;

      expect(editorFactory.loadingPresentation).to.be.false;

      expect(editorFactory.presentation.id).to.not.be.ok;
      expect(editorFactory.presentation.name).to.equal('Copy of some presentation');
      
      expect(trackerCalled).to.equal('Presentation Copied');
      expect(currentState).to.equal('apps.editor.workspace.artboard');
      expect(stateParams).to.deep.equal({presentationId: undefined, copyPresentation:true});

      done();
    }, 10);

  });
  
  describe('copyTemplate: ', function() {
    var newCopyOfSpy, copyPresentationSpy;
    
    beforeEach(function() {
      newCopyOfSpy = sinon.spy(editorFactory, 'newCopyOf');
      copyPresentationSpy = sinon.spy(editorFactory, 'copyPresentation');
    });

    it('should copy the template based on productDetails', function(done) {
      editorFactory.copyTemplate({rvaEntityId: 'presentationId'});
      
      newCopyOfSpy.should.have.been.calledWith('presentationId');
      
      setTimeout(function() {
        copyPresentationSpy.should.have.been.called;        
        
        done();
      }, 10);
    });
    
    it('should copy the template based on rvaEntityId', function(done) {      
      editorFactory.copyTemplate(null, 'presentationId');
      
      newCopyOfSpy.should.have.been.calledWith('presentationId');

      setTimeout(function() {
        copyPresentationSpy.should.have.been.called;        
        
        done();
      }, 10);
    });
    
    it('if API returns 403, and product is available, show goToStoreModal', function(done) {  
      var $modalOpenSpy = sinon.spy($modal, 'open');
      
      updatePresentation = false;    
      editorFactory.copyTemplate({rvaEntityId: 'presentationId'});
      
      newCopyOfSpy.should.have.been.calledWith('presentationId');
      
      setTimeout(function() {
        copyPresentationSpy.should.not.have.been.called;        
        
        $modalOpenSpy.should.have.been.called;
        done();
      }, 10);
    });
    
    it('if API returns 403, and product is not available, show goToStoreModal', function(done) {  
      var $modalOpenSpy = sinon.spy($modal, 'open');
      
      updatePresentation = false;    
      editorFactory.copyTemplate(null, 'presentationId');
      
      newCopyOfSpy.should.have.been.calledWith('presentationId');
      
      setTimeout(function() {
        copyPresentationSpy.should.not.have.been.called;        
        
        $modalOpenSpy.should.have.been.called;
        
        done();
      }, 10);
    });
  });

  it('addFromSharedTemplateModal: ', function(done) {
    var $modalOpenSpy = sinon.spy($modal, 'open');

    editorFactory.addFromSharedTemplateModal();
    expect(trackerCalled).to.equal("Add Presentation from Shared Template");

    $modalOpenSpy.should.have.been.calledWith({
      templateUrl: 'partials/editor/shared-templates-modal.html',
      size: 'md',
      controller: 'SharedTemplatesModalController'
    });
    
    setTimeout(function() {
      expect(editorFactory.loadingPresentation).to.be.false;

      expect(editorFactory.presentation.id).to.not.be.ok;
      expect(editorFactory.presentation.name).to.equal('Copy of some presentation');
      
      expect(trackerCalled).to.equal('Presentation Copied');
      expect(currentState).to.equal('apps.editor.workspace.artboard');
      expect(stateParams).to.deep.equal({presentationId: undefined, copyPresentation:true});

      done();
    }, 10);

  });

  describe('newCopyOf: ', function(done) {
    it('should return a promise', function() {
      expect(editorFactory.newCopyOf().then).to.be.a.function;
    });
    
    it('should copy Presentation', function(done) {
      editorFactory.newCopyOf("presentationId");
      
      setTimeout(function() {
        expect(editorFactory.loadingPresentation).to.be.false;

        expect(editorFactory.presentation.id).to.not.be.ok;
        expect(editorFactory.presentation.name).to.equal('Copy of some presentation');
        
        expect(trackerCalled).to.equal('Presentation Copied');
        expect(currentState).to.equal('apps.editor.workspace.artboard');
        expect(stateParams).to.deep.equal({presentationId: undefined, copyPresentation:true});

        done();
      }, 10);
    });
  });

  describe('saveAndPreview: ', function() {
    it('should add and preview new presentation', function(done) {
      var $windowOpenSpy = sinon.spy($window, 'open');
      var addEventSpy = sinon.spy(userAuthFactory, 'addEventListenerVisibilityAPI');
      var removeEventSpy = sinon.spy(userAuthFactory, 'removeEventListenerVisibilityAPI');

      sandbox.stub(presentationParser, "parsePresentation").returns(true);

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

      sandbox.stub(presentationParser, "parsePresentation").returns(true);

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
        expect(trackerCalled).to.equal('Presentation Published');
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
        expect(trackerCalled).to.not.be.ok;
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
        expect(trackerCalled).to.equal("Presentation Created");
        broadcastSpy.should.have.been.calledWith('presentationCreated');

        done();
      }, 10);
    });
    
    it('should update presentation', function(done){
      editorFactory.presentation.id = "presentationId";
      
      editorFactory.save();
      
      setTimeout(function(){
        expect(trackerCalled).to.equal("Presentation Updated");
        
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
        expect(trackerCalled).to.equal('Presentation Restored');
        expect(editorFactory.loadingPresentation).to.be.false;
        expect(editorFactory.presentation).to.be.truely;
        expect(editorFactory.presentation.name).to.equal("restored presentation");
        expect(editorFactory.presentation.parsed).to.be.true;
        expect(editorFactory.presentation.distributionParsed).to.be.true;
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
        expect(trackerCalled).to.not.be.ok;
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
