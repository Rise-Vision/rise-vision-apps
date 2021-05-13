'use strict';

describe('directive: templateComponentBranding', function() {
  var $scope,
      element,
      rootScope,
      compile;

  beforeEach(module('risevision.template-editor.directives'));
  beforeEach(module(mockTranslate()));

  beforeEach(inject(function($compile, $rootScope, $templateCache){
    rootScope = $rootScope;
    compile = $compile;
    $templateCache.put('partials/template-editor/components/component-branding/component-branding.html', '<p>mock</p>');

    compileDirective();
  }));

  function compileDirective() {
    element = compile("<template-component-branding></template-component-branding>")(rootScope.$new());
    $scope = element.scope();

    $scope.registerDirective = sinon.stub();
    $scope.editComponent = sinon.stub();

    $scope.$digest();
  }

  it('should compile html', function() {
    expect(element.html()).to.equal('<p>mock</p>');
  });

  it('should exist', function() {
    expect($scope).to.be.ok;
    expect($scope.editLogo).to.be.ok;
    expect($scope.editColors).to.be.ok;
    expect($scope.registerDirective).to.have.been.called;
  });

  it('should initialize directive', function() {
    var directive = $scope.registerDirective.getCall(0).args[0];
    expect(directive).to.be.ok;
    expect(directive.type).to.equal('rise-branding');
  });

  it('editLogo:', function() {
    $scope.editLogo();

    $scope.editComponent.should.have.been.calledWith({type: 'rise-image-logo'});
  });

  it('editColors: ', function() {
    $scope.editColors();

    $scope.editComponent.should.have.been.calledWith({type: 'rise-branding-colors'});
  });

});
