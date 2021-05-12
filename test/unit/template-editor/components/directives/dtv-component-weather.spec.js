'use strict';

describe('directive: templateComponentWeather', function() {
  var $scope,
      element,
      attributeDataFactory,
      company,
      rootScope,
      compile,
      hasRole = true;

  beforeEach(function() {
    company = {
      postalCode: '12345'
    };
  });

  beforeEach(module('risevision.template-editor.directives'));
  beforeEach(module('risevision.template-editor.controllers'));
  beforeEach(module('risevision.template-editor.services'));
  beforeEach(module('risevision.editor.services'));
  beforeEach(module(mockTranslate()));
  beforeEach(module(function ($provide) {
    $provide.service('templateEditorFactory', function() {
      return { selected: { id: "TEST-ID" } };
    });
    $provide.service('attributeDataFactory', function() {
      return {
        setAttributeData: sinon.stub()
      };
    });
    $provide.service('companySettingsFactory', function() {
      return {};
    });
    $provide.service('userState', function() {
      return {
        _restoreState: function(){},
        getCopyOfSelectedCompany: function() { 
          return company;
        },
        hasRole: function(){
          return hasRole;
        }
      };
    });
  }));

  beforeEach(inject(function($compile, $rootScope, $templateCache, $injector){
    attributeDataFactory = $injector.get('attributeDataFactory');

    rootScope = $rootScope;
    compile = $compile;
    $templateCache.put('partials/template-editor/components/component-weather.html', '<p>mock</p>');

    compileDirective();
  }));

  function compileDirective() {
    element = compile("<template-component-weather></template-component-weather>")(rootScope.$new());
    $scope = element.scope();
    $scope.registerDirective = sinon.stub();
    $scope.$digest();
  }

  it('should compile html', function() {
    expect(element.html()).to.equal('<p>mock</p>');
  });

  it('should exist', function() {
    expect($scope).to.be.ok;
    expect($scope.registerDirective).to.have.been.called;
    expect($scope.companySettingsFactory).to.be.ok;
    expect($scope.hasValidAddress).to.be.ok;
    expect($scope.canEditCompany).to.be.true;

    var directive = $scope.registerDirective.getCall(0).args[0];
    expect(directive).to.be.ok;
    expect(directive.type).to.equal('rise-data-weather');
    expect(directive.show).to.be.a('function');
  });

  it('should load weather from attribute data', function() {
    var directive = $scope.registerDirective.getCall(0).args[0];
    var sampleValue = "test weather";

    attributeDataFactory.getAttributeData = function() {
      return sampleValue;
    }

    directive.show();

    expect($scope.componentId).to.equal("TEST-ID");
    expect($scope.scale).to.equal(sampleValue);
  });

  it('should load weather from blueprint when the attribute data is missing', function() {
    var directive = $scope.registerDirective.getCall(0).args[0];
    var sampleValue = "test weather";

    attributeDataFactory.getAttributeData = function() {
      return null;
    };

    attributeDataFactory.getBlueprintData = function() {
      return sampleValue;
    };

    directive.show();

    expect($scope.componentId).to.equal("TEST-ID");
    expect($scope.scale).to.equal(sampleValue);
  });

  it('should save weather to attribute data', function() {
    var directive = $scope.registerDirective.getCall(0).args[0];
    var sampleValue = "test weather";

    attributeDataFactory.getAttributeData = function() {
      return sampleValue;
    }

    directive.show();

    $scope.scale = "updated weather";

    $scope.save();

    expect(attributeDataFactory.setAttributeData.calledWith(
      "TEST-ID", "scale", "updated weather"
    )).to.be.true;
  });

  describe('canEditCompany:',function(){
    it('should be true if user has required role',function(){
      hasRole = true;
      compileDirective();
      
      expect($scope.canEditCompany).to.be.true;
    });

    it('should be false if user does not have required role',function(){
      hasRole = false;
      compileDirective();
      
      expect($scope.canEditCompany).to.be.false;
    });
  });

  describe('hasValidAddress:',function(){
    it('should be valid if postalCode is provided',function(){
      company = {
        postalCode: '12345'
      };      
      compileDirective();
      
      expect($scope.hasValidAddress).to.be.true;
    });

    it('should be valid if city and country provided',function(){
      company = {
        city: 'city',
        country: 'country'
      };      
      compileDirective();
      
      expect($scope.hasValidAddress).to.be.true;
    });

    it('should be invalid if address is not provided',function(){
      company = {};      
      compileDirective();
      
      expect($scope.hasValidAddress).to.be.false;
    });

    it('should be invalid if address is empty',function(){
      company = {
        postalCode: "",
        city: "",
        country: "",
      };      
      compileDirective();
      
      expect($scope.hasValidAddress).to.be.false;
    });

    it('should be invalid if only city is provided but no country',function(){
      company = {
        city: "city",
      };      
      compileDirective();
      
      expect($scope.hasValidAddress).to.be.false;
    });

    it('should be invalid if only country is provided but no city',function(){
      company = {
        country: 'country'
      };      
      compileDirective();
      
      expect($scope.hasValidAddress).to.be.false;
    });

  });

});
