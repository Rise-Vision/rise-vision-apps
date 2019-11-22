'use strict';
describe('controller: TemplateEditor', function() {

  var SAMPLE_COMPONENTS = [
    {
      "type": "rise-image",
      "id": "rise-image-01",
      "label": "template.rise-image",
      "attributes": {
        "file": {
          "label": "template.file",
          "value": "risemedialibrary-7fa5ee92-7deb-450b-a8d5-e5ed648c575f/rise-image-demo/heatmap-icon.png"
        }
      }
    },
    {
      "type": "rise-data-financial",
      "id": "rise-data-financial-01",
      "label": "template.rise-data-financial",
      "attributes": {
        "financial-list": {
          "label": "template.financial-list",
          "value": "-LNuO9WH5ZEQ2PLCeHhz"
        },
        "symbols": {
          "label": "template.symbols",
          "value": "CADUSD=X|MXNUSD=X|USDEUR=X"
        }
      }
    }
  ];

  var $rootScope, $scope, $modal, $timeout, $window, $state, factory, scheduleFactory, blueprintFactory, userState;
  var sandbox = sinon.sandbox.create();

  beforeEach(function() {
    factory = {
      presentation: { templateAttributeData: {} },
      getAttributeData: sandbox.stub().returns('data'),
      setAttributeData: sandbox.stub(),
      isUnsaved: function() {
        return factory.hasUnsavedChanges
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
      return factory;
    });
    $provide.factory('blueprintFactory',function() {
      return {
        getBlueprintData: sandbox.stub().returns('blueprintData')
      };
    });
    $provide.factory('scheduleFactory',function() {
      return {
        hasSchedules: function () {}
      };
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
      factory = $injector.get('templateEditorFactory');
      blueprintFactory = $injector.get('blueprintFactory');
      scheduleFactory = $injector.get('scheduleFactory');
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
    expect($scope.factory).to.be.ok;
    expect($scope.factory.presentation).to.be.ok;
    expect($scope.factory.presentation.templateAttributeData).to.deep.equal({});
  });

  it('should define attribute and blueprint data functions',function() {
    expect($scope.getBlueprintData).to.be.a('function');
    expect($scope.getAttributeData).to.be.a('function');
    expect($scope.setAttributeData).to.be.a('function');
    expect($scope.getAvailableAttributeData).to.be.a('function');
  });

  describe('getAttributeData', function () {

    it('should return attribute data from factory',function() {
      var data = $scope.getAttributeData('test-id');

      factory.getAttributeData.should.have.been.calledWith('test-id');
      expect(data).to.equal('data');
    });

  });

  describe('setAttributeData', function () {

    it('should set attribute data via factory',function() {
      $scope.setAttributeData('test-id', 'symbols', 'CADUSD=X|MXNUSD=X');

      factory.setAttributeData.should.have.been.calledWith('test-id', 'symbols', 'CADUSD=X|MXNUSD=X');
    });
  });

  describe('getBlueprintData', function () {

    it('should get blueprint data from factory',function() {
      var data = $scope.getBlueprintData('test-id');

      blueprintFactory.getBlueprintData.should.have.been.calledWith('test-id');
      expect(data).to.equal('blueprintData');
    });

  });

  describe('getComponentIds', function () {

    it('should get the component ids of rise-image components',function() {
      blueprintFactory.blueprintData = { components: SAMPLE_COMPONENTS };

      var ids = $scope.getComponentIds({ type: 'rise-image' });

      expect(ids).to.deep.equal(['rise-image-01']);
    });

    it('should get the component ids of all rise components',function() {
      blueprintFactory.blueprintData = { components: SAMPLE_COMPONENTS };

      var ids = $scope.getComponentIds();

      expect(ids).to.deep.equal(['rise-image-01', 'rise-data-financial-01']);
    });

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
      expect($scope.factory.hasUnsavedChanges).to.be.false;
      factory.presentation.id = '1234';
      factory.presentation.name = 'New Name';
      $scope.$apply();
      $timeout.flush();

      expect($scope.factory.hasUnsavedChanges).to.be.true;
    });

    it('should save presentation if no id is provided', function () {
      sandbox.stub(factory, 'save').returns(Q.resolve());
      factory.presentation.name = 'New Name';
      $scope.$apply();

      expect(factory.save).to.have.been.called;
    });

    it('should not save presentation if user has no Content Editor role', function () {
      userState.hasRole.returns(false)
      sandbox.stub(factory, 'save').returns(Q.resolve());
      factory.presentation.name = 'New Name';
      $scope.$apply();

      expect(factory.save).to.not.have.been.called;
    });

    it('should clear unsaved changes flag after saving presentation', function () {
      factory.presentation.id = '1234';
      factory.presentation.name = 'New Name';
      $scope.$apply();
      $rootScope.$broadcast('presentationUpdated');
      $scope.$apply();
      $timeout.flush();
      expect($scope.factory.hasUnsavedChanges).to.be.false;
    });

    it('should clear unsaved changes when deleting the presentation', function () {
      factory.presentation.id = '1234';
      factory.presentation.name = 'New Name';
      $scope.$apply();
      $rootScope.$broadcast('presentationDeleted');
      $scope.$apply();
      expect($scope.factory.hasUnsavedChanges).to.be.false;
    });

    it('should not flag unsaved changes when publishing', function () {
      factory.presentation.id = '1234';
      factory.presentation.revisionStatusName = 'Published';
      factory.presentation.changeDate = new Date();
      factory.presentation.changedBy = 'newUsername';
      $scope.$apply();

      expect($scope.factory.hasUnsavedChanges).to.be.false;
    });

    it('should notify unsaved changes when changing URL', function () {
      factory.presentation.id = '1234';
      factory.presentation.name = 'New Name';
      $scope.$apply();
      $timeout.flush();
      var saveStub = sinon.stub(factory, 'save', function(){
        return Q.resolve();
      });

      $rootScope.$broadcast('$stateChangeStart', { name: 'newState' });
      $scope.$apply();

      saveStub.should.have.been.called;
    });

    it('should not notify unsaved changes when changing URL and user is not Content Editor', function () {
      userState.hasRole.returns(false);
      factory.presentation.id = '1234';
      factory.presentation.name = 'New Name';
      $scope.$apply();
      $timeout.flush();
      var saveStub = sinon.stub(factory, 'save', function(){
        return Q.resolve();
      });

      $rootScope.$broadcast('$stateChangeStart', { name: 'newState' });
      $scope.$apply();

      saveStub.should.not.have.been.called;
    });

    it('should not notify unsaved changes when changing URL on delete', function () {
      factory.presentation.id = '1234';
      factory.presentation.name = 'New Name';
      $scope.$apply();
      $timeout.flush();
      var saveStub = sinon.stub(factory, 'save', function(){
        return Q.resolve();
      });

      $rootScope.$broadcast('presentationDeleted');
      $scope.$apply();

      $rootScope.$broadcast('$stateChangeStart', { name: 'newState' });
      $scope.$apply();

      saveStub.should.not.have.been.called;
    });

    it('should not notify unsaved changes when changing URL if state is in Template Editor', function () {
      factory.presentation.id = '1234';
      factory.presentation.name = 'New Name';
      $scope.$apply();
      var saveStub = sinon.stub(factory, 'save');

      $rootScope.$broadcast('$stateChangeStart', { name: 'apps.editor.templates' });
      $scope.$apply();

      saveStub.should.not.have.been.called;
    });

    it('should notify unsaved changes when closing window', function () {
      factory.presentation.id = '1234';
      factory.presentation.name = 'New Name';
      $scope.$apply();
      $timeout.flush();

      var result = $window.onbeforeunload();
      expect(result).to.equal('common.saveBeforeLeave');
    });

    it('should not notify unsaved changes when closing window if user is not Content Editor', function () {
      userState.hasRole.returns(false);
      factory.presentation.id = '1234';
      factory.presentation.name = 'New Name';
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
