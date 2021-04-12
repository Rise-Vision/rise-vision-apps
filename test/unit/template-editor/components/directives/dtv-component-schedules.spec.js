'use strict';

describe('directive: templateComponentSchedules', function() {
  var $scope,
      element,
      rootScope,
      compile,
      $loading,
      scheduleSelectorFactory;

  beforeEach(module('risevision.template-editor.directives'));
  beforeEach(module(mockTranslate()));
  beforeEach(module(function ($provide) {
    $provide.service('scheduleSelectorFactory', function() {
      return {
        loadingSchedules: false
      };
    });

    $provide.service('$loading', function() {
      return {
        start: sinon.stub(),
        stop: sinon.stub()
      };
    });
  }));

  beforeEach(inject(function($compile, $rootScope, $templateCache, $injector){
    rootScope = $rootScope;
    compile = $compile;
    $templateCache.put('partials/template-editor/components/component-schedules.html', '<p>mock</p>');
    $loading = $injector.get('$loading');
    scheduleSelectorFactory = $injector.get('scheduleSelectorFactory');

    compileDirective();
  }));

  function compileDirective() {
    element = compile("<template-component-schedules></template-component-schedules>")(rootScope.$new());
    $scope = element.scope();

    $scope.registerDirective = sinon.stub();

    $scope.$digest();
  }

  it('should compile html', function() {
    expect(element.html()).to.equal('<p>mock</p>');
  });

  it('should exist', function() {
    expect($scope).to.be.ok;
    expect($scope.factory).to.be.ok;
    expect($scope.registerDirective).to.have.been.called;
  });

  it('should initialize directive', function() {
    var directive = $scope.registerDirective.getCall(0).args[0];
    expect(directive).to.be.ok;
    expect(directive.type).to.equal('rise-schedules');
    expect(directive.title).to.equal('Schedules');
  });

  describe('watch loadingSchedules:', function() {
    it('should show spinner when loading Schedules', function() {
      scheduleSelectorFactory.loadingSchedules = true;
      $scope.$digest();
      $loading.start.should.have.been.calledWith('schedules-component-spinner');
    });

    it('should hide spinner when finished loading Schedules', function() {
      $loading.stop.resetHistory();

      scheduleSelectorFactory.loadingSchedules = true;
      $scope.$digest();
      scheduleSelectorFactory.loadingSchedules = false;
      $scope.$digest();

      $loading.stop.should.have.been.calledWith('schedules-component-spinner');
    });
  });

});
