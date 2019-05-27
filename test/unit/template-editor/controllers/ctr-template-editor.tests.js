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

  var $rootScope, $scope, $modal, $timeout, $window, factory;

  beforeEach(function() {
    factory = { presentation: { templateAttributeData: {} } };
  });

  beforeEach(module('risevision.template-editor.controllers'));
  beforeEach(module('risevision.template-editor.services'));
  beforeEach(module('risevision.editor.services'));
  beforeEach(module(mockTranlate()));
  beforeEach(module(function ($provide) {
    $provide.factory('templateEditorFactory',function() {
      return factory;
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
      factory = $injector.get('templateEditorFactory');

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
  });

  it('should get empty attribute data',function() {
    var data = $scope.getAttributeData("test-id");

    expect(data).to.deep.equal({ id: "test-id" });
    expect($scope.factory.presentation.templateAttributeData).to.deep.equal({
      components: [
        { id: "test-id" }
      ]
    });
  });

  it('should get undefined attribute data value',function() {
    var data = $scope.getAttributeData("test-id", "symbols");

    expect(data).to.not.be.ok;
  });

  it('should set an attribute data value',function() {
    $scope.setAttributeData("test-id", "symbols", "CADUSD=X|MXNUSD=X");

    expect($scope.factory.presentation.templateAttributeData).to.deep.equal({
      components: [
        {
          id: "test-id",
          symbols: "CADUSD=X|MXNUSD=X"
        }
      ]
    });
  });

  it('should get an attribute data value',function() {
    $scope.setAttributeData("test-id", "symbols", "CADUSD=X|MXNUSD=X");

    var data = $scope.getAttributeData("test-id", "symbols");

    expect(data).to.equal("CADUSD=X|MXNUSD=X");
  });

  it('should get attribute data',function() {
    $scope.setAttributeData("test-id", "symbols", "CADUSD=X|MXNUSD=X");

    var data = $scope.getAttributeData("test-id");

    expect(data).to.deep.equal({
      id: "test-id",
      symbols: "CADUSD=X|MXNUSD=X"
    });
  });

  it('should get null blueprint data',function() {
    factory.blueprintData = { components: [] };

    var data = $scope.getBlueprintData("rise-data-financial-01");

    expect(data).to.be.null;
  });

  it('should get null blueprint data value',function() {
    factory.blueprintData = { components: [] };

    var data = $scope.getBlueprintData("rise-data-financial-01", "symbols");

    expect(data).to.be.null;
  });

  it('should get blueprint data attributes',function() {
    factory.blueprintData = { components: SAMPLE_COMPONENTS };

    var data = $scope.getBlueprintData("rise-data-financial-01");

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

    var data = $scope.getBlueprintData("rise-data-financial-01", "symbols");

    expect(data).to.equal("CADUSD=X|MXNUSD=X|USDEUR=X");
  });

  describe('unsaved changes', function () {
    it('should flag unsaved changes to presentation', function () {
      expect($scope.hasUnsavedChanges).to.be.false;
      factory.presentation.name = 'New Name';
      $scope.$apply();
      $timeout.flush();

      expect($scope.hasUnsavedChanges).to.be.true;
    });

    it('should clear unsaved changes flag after saving presentation', function () {
      factory.presentation.name = 'New Name';
      $scope.$apply();
      $rootScope.$broadcast('presentationUpdated');
      $scope.$apply();
      $timeout.flush();
      expect($scope.hasUnsavedChanges).to.be.false;
    });

    it('should clear unsaved changes when deleting the presentation', function () {
      factory.presentation.name = 'New Name';
      $scope.$apply();
      $rootScope.$broadcast('presentationDeleted');
      $scope.$apply();
      expect($scope.hasUnsavedChanges).to.be.false;
    });

    it('should not flag unsaved changes when publishing', function () {
      factory.presentation.revisionStatusName = 'Published';
      factory.presentation.changeDate = new Date();
      factory.presentation.changedBy = 'newUsername';
      $scope.$apply();

      expect($scope.hasUnsavedChanges).to.be.false;
    });

    it('should notify unsaved changes when changing URL', function () {
      factory.presentation.name = 'New Name';
      $scope.$apply();
      $timeout.flush();
      var modalOpenStub = sinon.stub($modal, 'open', function () {
        return {
          result: {
            then: function() {}
          }
        }
      });

      $rootScope.$broadcast('$stateChangeStart', { name: 'newState' });
      $scope.$apply();

      modalOpenStub.should.have.been.called;
    });

    it('should not notify unsaved changes when changing URL if there are no changes', function () {
      var modalOpenStub = sinon.stub($modal, 'open', function() {
        return {
          result: {
            then: function(){}
          }
        }
      });

      $rootScope.$broadcast('$stateChangeStart', { name: 'newState' });
      $scope.$apply();

      modalOpenStub.should.not.have.been.called;
    });

    it('should not notify unsaved changes when changing URL if state is in Template Editor', function () {
      factory.presentation.name = 'New Name';
      $scope.$apply();
      var modalOpenStub = sinon.stub($modal, 'open', function() {
        return {
          result: {
            then: function () {}
          }
        }
      });

      $rootScope.$broadcast('$stateChangeStart', { name: 'apps.editor.templates' });
      $scope.$apply();

      modalOpenStub.should.not.have.been.called;
    });

    it('should notify unsaved changes when closing window', function () {
      factory.presentation.name = 'New Name';
      $scope.$apply();
      $timeout.flush();

      var result = $window.onbeforeunload();
      expect(result).to.equal("common.saveBeforeLeave");
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
