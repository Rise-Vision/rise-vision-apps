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

  var $rootScope, $scope, $modal, $timeout, $window, $state, factory, scheduleFactory;

  beforeEach(function() {
    factory = {
      presentation: { templateAttributeData: {} },
      save: function() {
        return Q.resolve();
      },
      publish: function () {
        return Q.resolve();
      }
    };
  });

  beforeEach(module('risevision.template-editor.controllers'));
  beforeEach(module('risevision.template-editor.services'));
  beforeEach(module('risevision.editor.services'));
  beforeEach(module(mockTranlate()));
  beforeEach(module(function ($provide) {
    $provide.factory('templateEditorFactory',function() {
      return factory;
    });
    $provide.factory('blueprintFactory',function() {
      return factory;
    });
    $provide.factory('scheduleFactory',function() {
      return {
        hasSchedules: function () {}
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
      scheduleFactory = $injector.get('scheduleFactory');

      $controller('TemplateEditorController', {
        $scope: $scope,
        editorFactory: $injector.get('templateEditorFactory')
      });

      $scope.$digest();
    });
  });

  it('should exist', function() {
    expect($scope).to.be.truely;
    expect($scope.factory).to.be.truely;
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

    it('should get empty attribute data',function() {
      var data = $scope.getAttributeData('test-id');

      expect(data).to.deep.equal({ id: 'test-id' });
    });

    it('should not update templateAttributeData on get',function() {
      $scope.getAttributeData('test-id');

      expect($scope.factory.presentation.templateAttributeData).to.deep.equal({});
    });

    it('should get undefined attribute data value',function() {
      var data = $scope.getAttributeData('test-id', 'symbols');

      expect(data).to.not.be.ok;
    });

  });

  describe('setAttributeData', function () {

    it('should set an attribute data value',function() {
      $scope.setAttributeData('test-id', 'symbols', 'CADUSD=X|MXNUSD=X');

      expect($scope.factory.presentation.templateAttributeData).to.deep.equal({
        components: [
          {
            id: 'test-id',
            symbols: 'CADUSD=X|MXNUSD=X'
          }
        ]
      });
    });

    it('should get an attribute data value',function() {
      $scope.setAttributeData('test-id', 'symbols', 'CADUSD=X|MXNUSD=X');

      var data = $scope.getAttributeData('test-id', 'symbols');

      expect(data).to.equal('CADUSD=X|MXNUSD=X');
    });

    it('should get attribute data',function() {
      $scope.setAttributeData('test-id', 'symbols', 'CADUSD=X|MXNUSD=X');

      var data = $scope.getAttributeData('test-id');

      expect(data).to.deep.equal({
        id: 'test-id',
        symbols: 'CADUSD=X|MXNUSD=X'
      });
    });

  });

  describe('getBlueprintData', function () {

    it('should get null blueprint data',function() {
      factory.blueprintData = { components: [] };

      var data = $scope.getBlueprintData('rise-data-financial-01');

      expect(data).to.be.null;
    });

    it('should get null blueprint data value',function() {
      factory.blueprintData = { components: [] };

      var data = $scope.getBlueprintData('rise-data-financial-01', 'symbols');

      expect(data).to.be.null;
    });

    it('should get blueprint data attributes',function() {
      factory.blueprintData = { components: SAMPLE_COMPONENTS };

      var data = $scope.getBlueprintData('rise-data-financial-01');

      expect(data).to.deep.equal({
        "financial-list": {
          "label": "template.financial-list",
          "value": "-LNuO9WH5ZEQ2PLCeHhz"
        },
        "symbols": {
          "label": "template.symbols",
          "value": "CADUSD=X|MXNUSD=X|USDEUR=X"
        }
      });
    });

    it('should get blueprint data value',function() {
      factory.blueprintData = { components: SAMPLE_COMPONENTS };

      var data = $scope.getBlueprintData('rise-data-financial-01', 'symbols');

      expect(data).to.equal('CADUSD=X|MXNUSD=X|USDEUR=X');
    });

  });

  describe('getComponentIds', function () {

    it('should get the component ids of rise-image components',function() {
      factory.blueprintData = { components: SAMPLE_COMPONENTS };

      var ids = $scope.getComponentIds({ type: 'rise-image' });

      expect(ids).to.deep.equal(['rise-image-01']);
    });

    it('should get the component ids of all rise components',function() {
      factory.blueprintData = { components: SAMPLE_COMPONENTS };

      var ids = $scope.getComponentIds();

      expect(ids).to.deep.equal(['rise-image-01', 'rise-data-financial-01']);
    });

  });

  describe('unsaved changes', function () {
    it('should flag unsaved changes to presentation', function () {
      expect($scope.hasUnsavedChanges).to.be.false;
      factory.presentation.id = '1234';
      factory.presentation.name = 'New Name';
      $scope.$apply();
      $timeout.flush();

      expect($scope.hasUnsavedChanges).to.be.true;
    });

    it('should clear unsaved changes flag after saving presentation', function () {
      factory.presentation.id = '1234';
      factory.presentation.name = 'New Name';
      $scope.$apply();
      $rootScope.$broadcast('presentationUpdated');
      $scope.$apply();
      $timeout.flush();
      expect($scope.hasUnsavedChanges).to.be.false;
    });

    it('should clear unsaved changes when deleting the presentation', function () {
      factory.presentation.id = '1234';
      factory.presentation.name = 'New Name';
      $scope.$apply();
      $rootScope.$broadcast('presentationDeleted');
      $scope.$apply();
      expect($scope.hasUnsavedChanges).to.be.false;
    });

    it('should not flag unsaved changes when publishing', function () {
      factory.presentation.id = '1234';
      factory.presentation.revisionStatusName = 'Published';
      factory.presentation.changeDate = new Date();
      factory.presentation.changedBy = 'newUsername';
      $scope.$apply();

      expect($scope.hasUnsavedChanges).to.be.false;
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

    it('should not notify unsaved changes when changing URL if there are no changes and user has schedules', function () {
      var saveStub = sinon.stub(factory, 'save');

      sinon.stub($state, 'go');
      sinon.stub(factory, 'publish');
      sinon.stub(scheduleFactory, 'hasSchedules').returns(true);

      $rootScope.$broadcast('$stateChangeStart', { name: 'newState' });
      $scope.$apply();

      saveStub.should.not.have.been.called;
      $state.go.should.have.been.called;
      factory.publish.should.not.have.been.called;
    });

    it('should not change URL if there are no changes but user does not have schedules', function () {
      var saveStub = sinon.stub(factory, 'save');

      sinon.stub($state, 'go');
      sinon.stub(factory, 'publish');
      sinon.stub(scheduleFactory, 'hasSchedules').returns(false);

      $rootScope.$broadcast('$stateChangeStart', { name: 'newState' });
      $scope.$apply();

      saveStub.should.not.have.been.called;
      $state.go.should.not.have.been.called;
      factory.publish.should.have.been.called;
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
