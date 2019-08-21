'use strict';

describe('directive: templateComponentBranding', function() {
  var $scope,
      element,
      rootScope,
      compile;

  beforeEach(module('risevision.template-editor.directives'));
  beforeEach(module(mockTranlate()));

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
    $scope.setPanelTitle = sinon.stub();
    $scope.setPanelIcon = sinon.stub();
    $scope.showNextPanel = sinon.stub();
    $scope.showPreviousPanel = sinon.stub();
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
    expect(directive.iconType).to.equal('streamline');
    expect(directive.icon).to.equal('ratingStar');
    expect(directive.show).to.be.a('function');
    expect(directive.onBackHandler).to.be.a('function');
  });

  it('editLogo:', function() {
    $scope.editLogo();

    $scope.editComponent.should.have.been.calledWith({type: 'rise-image'});
  });

  it('editColors: ', function() {
    $scope.editColors();

    $scope.setPanelIcon.should.have.been.calledWith('palette', 'streamline');
    $scope.setPanelTitle.should.have.been.calledWith('Color Settings');
    $scope.showNextPanel.should.have.been.calledWith('.branding-colors-container');
  });

  it('directive.show: ', function() {
    var directive = $scope.registerDirective.getCall(0).args[0];

    directive.show();

    $scope.setPanelTitle.should.have.been.calledWith('Brand Settings');
    $scope.showNextPanel.should.have.been.calledWith('.branding-component-container');
  });

  it('directive.onBackHandler: ', function() {
    var directive = $scope.registerDirective.getCall(0).args[0];
    $scope.showPreviousPanel.returns('backPanel');

    expect(directive.onBackHandler()).to.equal('backPanel');

    $scope.setPanelIcon.should.have.been.called;
    $scope.setPanelTitle.should.have.been.calledWith('Brand Settings');
    $scope.showPreviousPanel.should.have.been.called;
  });

});
