'use strict';
describe('controller: TemplateEditor', function() {
  var $rootScope, $scope, $modal, $timeout, $window, $state, templateEditorFactory, userState;
  var sandbox = sinon.sandbox.create();

  beforeEach(function() {
    templateEditorFactory = {
      presentation: { templateAttributeData: {} },
      isUnsaved: function() {
        return templateEditorFactory.hasUnsavedChanges
      },
      save: function() {
        return Q.resolve();
      },
      publish: function () {
        return Q.resolve();
      }
    };
  });
  afterEach(function() {
    sandbox.restore();
  });

  beforeEach(module('risevision.template-editor.controllers'));
  beforeEach(module('risevision.template-editor.directives'));
  beforeEach(module('risevision.template-editor.services'));
  beforeEach(module('risevision.editor.services'));
  beforeEach(module(mockTranslate()));
  beforeEach(module(function ($provide) {
    $provide.factory('templateEditorFactory',function() {
      return templateEditorFactory;
    });
    $provide.factory('userState',function() {
      return {
        _restoreState: sandbox.stub(), 
        hasRole: sandbox.stub().returns(true)
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

  beforeEach(function() {
    inject(function($injector, $controller) {
      $rootScope = $injector.get('$rootScope');
      $scope = $rootScope.$new();

      $modal = $injector.get('$modal');
      $window = $injector.get('$window');
      $timeout = $injector.get('$timeout');
      $state = $injector.get('$state');
      templateEditorFactory = $injector.get('templateEditorFactory');
      userState = $injector.get('userState');

      $controller('TemplateEditorController', {
        $scope: $scope,
        editorFactory: $injector.get('templateEditorFactory')
      });

      $scope.$digest();
    });
  });

  it('should exist', function() {
    expect($scope).to.be.ok;
    expect($scope.templateEditorFactory).to.be.ok;
    expect($scope.templateEditorFactory.presentation).to.be.ok;
    expect($scope.templateEditorFactory.presentation.templateAttributeData).to.deep.equal({});
    expect($scope.componentsFactory).to.be.ok;
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

  describe('unsaved changes', function () {
    it('should flag unsaved changes to presentation', function () {
      expect($scope.templateEditorFactory.hasUnsavedChanges).to.be.false;
      templateEditorFactory.presentation.id = '1234';
      templateEditorFactory.presentation.name = 'New Name';
      $scope.$apply();
      $timeout.flush();

      expect($scope.templateEditorFactory.hasUnsavedChanges).to.be.true;
    });

    it('should save presentation if no id is provided', function () {
      sandbox.stub(templateEditorFactory, 'save').returns(Q.resolve());
      templateEditorFactory.presentation.name = 'New Name';
      $scope.$apply();

      expect(templateEditorFactory.save).to.have.been.called;
    });

    it('should not save presentation if user has no Content Editor role', function () {
      userState.hasRole.returns(false)
      sandbox.stub(templateEditorFactory, 'save').returns(Q.resolve());
      templateEditorFactory.presentation.name = 'New Name';
      $scope.$apply();

      expect(templateEditorFactory.save).to.not.have.been.called;
    });

    it('should clear unsaved changes flag after saving presentation', function () {
      templateEditorFactory.presentation.id = '1234';
      templateEditorFactory.presentation.name = 'New Name';
      $scope.$apply();
      $rootScope.$broadcast('presentationUpdated');
      $scope.$apply();
      $timeout.flush();
      expect($scope.templateEditorFactory.hasUnsavedChanges).to.be.false;
    });

    it('should clear unsaved changes when deleting the presentation', function () {
      templateEditorFactory.presentation.id = '1234';
      templateEditorFactory.presentation.name = 'New Name';
      $scope.$apply();
      $rootScope.$broadcast('presentationDeleted');
      $scope.$apply();
      expect($scope.templateEditorFactory.hasUnsavedChanges).to.be.false;
    });

    it('should not flag unsaved changes when publishing', function () {
      templateEditorFactory.presentation.id = '1234';
      templateEditorFactory.presentation.revisionStatusName = 'Published';
      templateEditorFactory.presentation.changeDate = new Date();
      templateEditorFactory.presentation.changedBy = 'newUsername';
      $scope.$apply();

      expect($scope.templateEditorFactory.hasUnsavedChanges).to.be.false;
    });

    it('should notify unsaved changes when changing URL', function () {
      templateEditorFactory.presentation.id = '1234';
      templateEditorFactory.presentation.name = 'New Name';
      $scope.$apply();
      $timeout.flush();
      var saveStub = sinon.stub(templateEditorFactory, 'save', function(){
        return Q.resolve();
      });

      $rootScope.$broadcast('$stateChangeStart', { name: 'newState' });
      $scope.$apply();

      saveStub.should.have.been.called;
    });

    it('should not notify unsaved changes when changing URL and user is not Content Editor', function () {
      userState.hasRole.returns(false);
      templateEditorFactory.presentation.id = '1234';
      templateEditorFactory.presentation.name = 'New Name';
      $scope.$apply();
      $timeout.flush();
      var saveStub = sinon.stub(templateEditorFactory, 'save', function(){
        return Q.resolve();
      });

      $rootScope.$broadcast('$stateChangeStart', { name: 'newState' });
      $scope.$apply();

      saveStub.should.not.have.been.called;
    });

    it('should not notify unsaved changes when changing URL on delete', function () {
      templateEditorFactory.presentation.id = '1234';
      templateEditorFactory.presentation.name = 'New Name';
      $scope.$apply();
      $timeout.flush();
      var saveStub = sinon.stub(templateEditorFactory, 'save', function(){
        return Q.resolve();
      });

      $rootScope.$broadcast('presentationDeleted');
      $scope.$apply();

      $rootScope.$broadcast('$stateChangeStart', { name: 'newState' });
      $scope.$apply();

      saveStub.should.not.have.been.called;
    });

    it('should not notify unsaved changes when changing URL if state is in Template Editor', function () {
      templateEditorFactory.presentation.id = '1234';
      templateEditorFactory.presentation.name = 'New Name';
      $scope.$apply();
      var saveStub = sinon.stub(templateEditorFactory, 'save');

      $rootScope.$broadcast('$stateChangeStart', { name: 'apps.editor.templates' });
      $scope.$apply();

      saveStub.should.not.have.been.called;
    });

    it('should notify unsaved changes when closing window', function () {
      templateEditorFactory.presentation.id = '1234';
      templateEditorFactory.presentation.name = 'New Name';
      $scope.$apply();
      $timeout.flush();

      var result = $window.onbeforeunload();
      expect(result).to.equal('common.saveBeforeLeave');
    });

    it('should not notify unsaved changes when closing window if user is not Content Editor', function () {
      userState.hasRole.returns(false);
      templateEditorFactory.presentation.id = '1234';
      templateEditorFactory.presentation.name = 'New Name';
      $scope.$apply();
      $timeout.flush();

      var result = $window.onbeforeunload();
      expect(result).to.equal(undefined);
    });

    it('should not notify unsaved changes when closing window if there are no changes', function() {
      var result = $window.onbeforeunload();
      expect(result).to.equal(undefined);
    });

    it('should stop listening for window close on $destroy', function () {
      expect($window.onbeforeunload).to.be.a('function');
      $rootScope.$broadcast('$destroy');
      $scope.$apply();
      expect($window.onbeforeunload).to.equal(null);
    });
  });
});
