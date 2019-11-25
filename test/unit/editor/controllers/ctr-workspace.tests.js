'use strict';
describe('controller: Workspace', function() {
  var sandbox = sinon.sandbox.create();

  beforeEach(module('risevision.editor.controllers'));
  beforeEach(module('risevision.editor.services'));
  beforeEach(module(mockTranslate()));
  beforeEach(module(function ($provide) {
    $provide.factory('editorFactory',function(){
      return { 
        presentation: {
          name: 'New Presentation'
        }
      };
    });
    $provide.factory('artboardFactory', function() {
      return {};
    });
    $provide.factory('$stateParams',function(){
      return { };
    });
    $provide.value('RVA_URL',"http://rva-test.appspot.com");
    $provide.factory('$modal',function(){
      return {
        open: function(params){
          modalOpenCalled = true;
          expect(params).to.be.ok;
          expect(params.resolve.confirmationTitle()).to.equal('editor-app.workspace.legacyWarning.title');
          expect(params.resolve.confirmationMessage()).to.equal('editor-app.workspace.legacyWarning.message');
          expect(params.resolve.confirmationButton()).to.equal('editor-app.workspace.legacyWarning.confirmation');          
          return {
            result:{
              then:function(func){
                expect(func).to.be.a('function');
              }
            }
          };
        }
      };
    });
    $provide.factory('userState',function(){
      return {
        hasRole: sandbox.stub().returns(true),
        _restoreState: sandbox.stub(),
        getCopyOfSelectedCompany: sandbox.stub().returns({})
      };
    });
  }));

  afterEach(function() {
    sandbox.restore();
  });

  var $scope, editorFactory, modalOpenCalled, $rootScope, $timeout, $modal, $window, $state, userState;

  beforeEach(function(){
    inject(function($injector,$controller){
      $rootScope = $injector.get('$rootScope');
      $timeout = $injector.get('$timeout');
      $modal = $injector.get('$modal');
      $window = $injector.get('$window');
      $state = $injector.get('$state');
      userState = $injector.get('userState');
      modalOpenCalled = false;
      $scope = $rootScope.$new();
      editorFactory = $injector.get('editorFactory');

      $controller('WorkspaceController', {
        $scope : $scope,
        editorFactory: editorFactory
      });
      $scope.$digest();
      $timeout.flush();
    });
  });

  it('should exist',function(){
    expect($scope).to.be.ok;

    expect($scope.factory).to.be.ok;
    expect($scope.artboardFactory).to.be.ok;
    expect($scope.factory).to.deep.equal(editorFactory);
  });

  describe('hasContentEditorRole', function() {
    it('should return true if user has ce role',function() {
      expect($scope.hasContentEditorRole()).to.be.true;
    });

    it('should return false if user does not have ce role',function() {
      userState.hasRole.returns(false);
      expect($scope.hasContentEditorRole()).to.be.false;
    });
  });

  it('should show warning if presentation has deprecated items',function(){
    editorFactory.hasLegacyItems = true;
    $scope.$digest();
    expect(modalOpenCalled).to.be.true;
  });

  it('should flag unsaved changes to presentation',function(){
    expect($scope.hasUnsavedChanges).to.be.false;
    editorFactory.presentation.name = "New Name";
    $scope.$apply();

    expect($scope.hasUnsavedChanges).to.be.true;
  });

  it('should clear unsaved changes flag after saving presentation',function(){
    editorFactory.presentation.name = "New Name";
    $scope.$apply();
    $rootScope.$broadcast('presentationUpdated');
    $scope.$apply();
    $timeout.flush();
    expect($scope.hasUnsavedChanges).to.be.false;
  });

  it('should clear unsaved changes when deleting the presentation',function(){
    editorFactory.presentation.name = "New Name";
    $scope.$apply();
    $rootScope.$broadcast('presentationDeleted');
    $scope.$apply();
    expect($scope.hasUnsavedChanges).to.be.false;
  });

  it('should not flag unsaved changes when publishing',function(){    
    editorFactory.presentation.revisionStatusName = 'Published';
    editorFactory.presentation.changeDate = new Date();
    editorFactory.presentation.changedBy = 'newUsername';
    $scope.$apply();

    expect($scope.hasUnsavedChanges).to.be.false;
  });

  it('should not flag unsaved changes for playlist item statusMessage',function(){    
    editorFactory.presentation.placeholders = [
      {
        items: [
          {type: 'widget'}
        ]
      }
    ];
    $scope.$apply();
    $scope.hasUnsavedChanges = false;
    editorFactory.presentation.placeholders[0].items[0].statusMessage = 'Free';
    $scope.$apply();

    expect($scope.hasUnsavedChanges).to.be.false;
  });

  it('should flag unsaved changes when removing playlist items',function(){    
    editorFactory.presentation.placeholders = [
      {
        items: [
          {type: 'widget'},
          {type: 'widget'}
        ]
      }
    ];
    $scope.$apply();
    $scope.hasUnsavedChanges = false;
    delete editorFactory.presentation.placeholders[0].items[0];
    $scope.$apply();

    expect($scope.hasUnsavedChanges).to.be.true;
  });

    it('should flag unsaved changes when playlist items changed',function(){    
    editorFactory.presentation.placeholders = [
      {
        items: [
          {type: 'widget'},
          {type: 'widget'}
        ]
      }
    ];
    $scope.$apply();
    $scope.hasUnsavedChanges = false;
    editorFactory.presentation.placeholders[0].items[1].type = 'gadget';
    editorFactory.presentation.placeholders[0].items[1].url = 'http://url.com';
    $scope.$apply();

    expect($scope.hasUnsavedChanges).to.be.true;
  });

  it('should notify unsaved changes when changing URL',function(){
    editorFactory.presentation.name = "New Name";
    $scope.$apply();
    var modalOpenStub = sinon.stub($modal, 'open',function(){return {result:{then:function(){}}}});

    $rootScope.$broadcast('$stateChangeStart',{name:'newState'});
    $scope.$apply();

    modalOpenStub.should.have.been.called;
  });

  it('should not notify unsaved changes when changing URL if user is not Content Editor', function(){
    userState.hasRole.returns(false);
    sandbox.stub($modal, 'open').returns({result: Q.resolve()});
    editorFactory.presentation.name = "New Name";
    $scope.$apply();

    $rootScope.$broadcast('$stateChangeStart',{name:'newState'});
    $scope.$apply();

    $modal.open.should.not.have.been.called;
  });

  it('should not notify unsaved changes when changing URL if there are no changes',function(){
    var modalOpenStub = sinon.stub($modal, 'open',function(){return {result:{then:function(){}}}});

    $rootScope.$broadcast('$stateChangeStart',{name:'newState'});
    $scope.$apply();

    modalOpenStub.should.not.have.been.called;
  });

  it('should not notify unsaved changes when changing URL if state is artboard or htmleditor',function(){
    editorFactory.presentation.name = "New Name";
    $scope.$apply();
    var modalOpenStub = sinon.stub($modal, 'open',function(){return {result:{then:function(){}}}});
    
    $rootScope.$broadcast('$stateChangeStart',{name:'apps.editor.workspace.artboard'});
    $scope.$apply();

    modalOpenStub.should.not.have.been.called;

    $rootScope.$broadcast('$stateChangeStart',{name:'apps.editor.workspace.htmleditor'});
    $scope.$apply();

    modalOpenStub.should.not.have.been.called;
  });

  it('should notify unsaved changes when closing window',function(){
    editorFactory.presentation.name = "New Name";
    $scope.$apply();

    var result = $window.onbeforeunload();
    expect(result).to.equal("common.saveBeforeLeave");
  });

  it('should not notify unsaved changes when closing window if there are no changes',function(){    
    var result = $window.onbeforeunload();
    expect(result).to.equal(undefined);
  });

  it('should stop listening for window close on $destroy',function(){
    expect($window.onbeforeunload).to.be.a('function');
    $rootScope.$broadcast('$destroy');
    $scope.$apply();
    expect($window.onbeforeunload).to.equal(null);
  });

});
