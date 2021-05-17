'use strict';

describe('directive: templateComponentSchedules', function() {
  var $scope,
      element,
      rootScope,
      compile,
      $loading,
      componentsFactory,
      scheduleSelectorFactory;

  beforeEach(module('risevision.template-editor.directives'));
  beforeEach(module(function ($provide) {
    $provide.service('componentsFactory', function() {
      return {
        selected: { id: "TEST-ID" },
        registerDirective: sinon.stub()
      };
    });

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
    $loading = $injector.get('$loading');
    scheduleSelectorFactory = $injector.get('scheduleSelectorFactory');
    componentsFactory = $injector.get('componentsFactory');

    rootScope = $rootScope;
    compile = $compile;
    $templateCache.put('partials/template-editor/components/component-schedules.html', '<p>mock</p>');

    compileDirective();
  }));

  function compileDirective() {
    element = compile("<template-component-schedules></template-component-schedules>")(rootScope.$new());
    $scope = element.scope();

    $scope.$digest();
  }

  it('should compile html', function() {
    expect(element.html()).to.equal('<p>mock</p>');
  });

  it('should exist', function() {
    expect($scope).to.be.ok;
    expect($scope.factory).to.be.ok;
    expect(componentsFactory.registerDirective).to.have.been.called;
  });

  it('should initialize directive', function() {
    var directive = componentsFactory.registerDirective.getCall(0).args[0];
    expect(directive).to.be.ok;
    expect(directive.type).to.equal('rise-schedules');
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
