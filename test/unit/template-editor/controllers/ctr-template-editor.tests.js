'use strict';
describe('controller: TemplateEditor', function() {
  beforeEach(module('risevision.template-editor.controllers'));
  beforeEach(module('risevision.template-editor.services'));
  beforeEach(module('risevision.editor.services'));
  beforeEach(module(mockTranlate()));
  beforeEach(module(function ($provide) {
    $provide.factory('templateEditorFactory',function() {
      return {};
    });
  }));

  var $scope;

  beforeEach(function() {
    inject(function($injector, $rootScope, $controller) {
      $scope = $rootScope.$new();

      $controller('TemplateEditorController', {
        $scope: $scope,
        editorFactory: $injector.get('templateEditorFactory'),
        presentation: { templateAttributeData: {} }
      });

      $scope.$digest();
    });
  });

  it('should exist', function() {
    expect($scope).to.be.truely;
    expect($scope.factory).to.be.truely;
    expect($scope.presentation).to.be.ok;
    expect($scope.presentation.templateAttributeData).to.deep.equal({});
  });

  it('should define attribute data functions',function() {
    expect($scope.getAttributeData).to.be.a('function');
    expect($scope.setAttributeData).to.be.a('function');
  });

  it('should get empty attribute data',function() {
    var data = $scope.getAttributeData("test-id");

    expect(data).to.deep.equal({ id: "test-id" });
    expect($scope.presentation.templateAttributeData).to.deep.equal({
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

    expect($scope.presentation.templateAttributeData).to.deep.equal({
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

});
