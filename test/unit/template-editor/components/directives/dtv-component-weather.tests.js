'use strict';

describe('directive: templateComponentWeather', function() {
  var $scope,
      element,
      factory;

  beforeEach(function() {
    factory = { selected: { id: "TEST-ID" } };
  });

  beforeEach(module('risevision.template-editor.directives'));
  beforeEach(module('risevision.template-editor.controllers'));
  beforeEach(module('risevision.template-editor.services'));
  beforeEach(module('risevision.editor.services'));
  beforeEach(module(mockTranlate()));
  beforeEach(module(function ($provide) {
    $provide.service('templateEditorFactory', function() {
      return factory;
    });
  }));

  beforeEach(inject(function($compile, $rootScope, $templateCache){
    $templateCache.put('partials/template-editor/components/component-weather.html', '<p>mock</p>');

    element = $compile("<template-component-weather></template-component-weather>")($rootScope.$new());

    $scope = element.scope();

    $scope.registerDirective = sinon.stub();
    $scope.setAttributeData = sinon.stub();

    $scope.$digest();
  }));

  it('should compile html', function() {
    expect(element.html()).to.equal('<p>mock</p>');
  });

  it('should exist', function() {
    expect($scope).to.be.ok;
    expect($scope.factory).to.be.ok;
    expect($scope.factory).to.deep.equal({ selected: { id: "TEST-ID" } })
    expect($scope.registerDirective).to.have.been.called;

    var directive = $scope.registerDirective.getCall(0).args[0];
    expect(directive).to.be.ok;
    expect(directive.type).to.equal('rise-data-weather');
    expect(directive.iconType).to.equal('svg');
    expect(directive.icon).to.exist;
    expect(directive.show).to.be.a('function');
  });

  it('should load weather from attribute data', function() {
    var directive = $scope.registerDirective.getCall(0).args[0];
    var sampleValue = "test weather";

    $scope.getAttributeData = function() {
      return sampleValue;
    }

    directive.show();

    expect($scope.componentId).to.equal("TEST-ID");
    expect($scope.scale).to.equal(sampleValue);
  });

  it('should load weather from blueprint when the attribute data is missing', function() {
    var directive = $scope.registerDirective.getCall(0).args[0];
    var sampleValue = "test weather";

    $scope.getAttributeData = function() {
      return null;
    };

    $scope.getBlueprintData = function() {
      return sampleValue;
    };

    directive.show();

    expect($scope.componentId).to.equal("TEST-ID");
    expect($scope.scale).to.equal(sampleValue);
  });

  it('should save weather to attribute data', function() {
    var directive = $scope.registerDirective.getCall(0).args[0];
    var sampleValue = "test weather";

    $scope.getAttributeData = function() {
      return sampleValue;
    }

    directive.show();

    $scope.scale = "updated weather";

    $scope.save();

    expect($scope.setAttributeData.calledWith(
      "TEST-ID", "scale", "updated weather"
    )).to.be.true;
  });

});
