'use strict';

describe('directive: schedule-selector', function() {
  var $scope, $rootScope, element, $loading, $timeout, innerElementStub, scheduleSelectorFactory, outsideClickHandler,
    sandbox = sinon.sandbox.create();


  beforeEach(module('risevision.schedules.directives'));
  beforeEach(module(function ($provide) {
    $provide.service('scheduleSelectorFactory', function() {
      return {
        select: sandbox.stub(),
        load: sandbox.stub(),
        unselectedSchedules: {}
      };
    });
    $provide.service('$loading', function() {
      return {
        start: sinon.stub(),
        stop: sinon.stub()
      };
    });
    $provide.service('outsideClickHandler', function() {
      return {
        bind: sinon.stub(),
        unbind: sinon.stub()
      };
    });
  }));

  beforeEach(inject(function($compile, $templateCache, $injector){
    $templateCache.put('partials/schedules/schedule-selector.html', '<div id="schedule-selector-button"></div>');
    $rootScope = $injector.get('$rootScope');
    $timeout = $injector.get('$timeout');
    $loading = $injector.get('$loading');
    scheduleSelectorFactory = $injector.get('scheduleSelectorFactory');
    outsideClickHandler = $injector.get('outsideClickHandler');

    innerElementStub = {
      trigger: sandbox.stub()
    };
    sandbox.stub(angular,'element').returns(innerElementStub);

    $scope = $rootScope.$new();

    element = $compile('<schedule-selector></schedule-selector>')($scope);

    $rootScope.$digest();
    $scope = element.isolateScope();   
  }));

  afterEach(function () {
    element.remove();
    sandbox.restore();
  });

  it('should exist', function() {
    expect($scope).to.be.ok;
    expect($scope.factory).to.ok;
    expect($scope.toggleTooltip).to.be.a('function');
    expect($scope.select).to.be.a('function');
  });

  it('should compile', function() {
    expect(element[0].outerHTML).to.equal('<schedule-selector class="ng-scope ng-isolate-scope"><div id="schedule-selector-button"></div></schedule-selector>');
  });

  describe('spinner:', function() {
    it('should show spinner when loading selected Schedules', function() {
      scheduleSelectorFactory.loadingSchedules = true;
      $scope.$digest();
      $loading.start.should.have.been.calledWith('selected-schedules-spinner');
    });

    it('should hide spinner when finished loading selected Schedules', function() {
      $loading.stop.resetHistory();

      scheduleSelectorFactory.loadingSchedules = true;
      $scope.$digest();
      scheduleSelectorFactory.loadingSchedules = false;
      $scope.$digest();

      $loading.stop.should.have.been.calledWith('selected-schedules-spinner');
    });

    it('should show spinner when loading unselected Schedules', function() {
      scheduleSelectorFactory.unselectedSchedules.loadingItems = true;
      $scope.$digest();
      $loading.start.should.have.been.calledWith('selected-schedules-spinner');
    });

    it('should hide spinner when finished loading unselected Schedules', function() {
      $loading.stop.resetHistory();

      scheduleSelectorFactory.unselectedSchedules.loadingItems = true;
      $scope.$digest();
      scheduleSelectorFactory.unselectedSchedules.loadingItems = false;
      $scope.$digest();

      $loading.stop.should.have.been.calledWith('selected-schedules-spinner');
    });
  });

  describe('toggleTooltip:', function() {
    it('should open tooltip, register outsideClickHandler and load', function() {
      $scope.toggleTooltip();
      $scope.$digest();
      $timeout.flush();

      $scope.factory.load.should.have.been.called;
      innerElementStub.trigger.should.have.been.calledWith('show');
      outsideClickHandler.bind.should.have.been.calledWith('schedule-selector', '#schedule-selector, #schedule-selector-tooltip', $scope.toggleTooltip);
    });

    it('should close tooltip if open and unregister outsideClickHandler', function() {
      //open
      $scope.toggleTooltip();
      $scope.$digest();
      $timeout.flush();
      innerElementStub.trigger.resetHistory();

      //close
      $scope.toggleTooltip();
      $scope.$digest();
      $timeout.flush();

      innerElementStub.trigger.should.have.been.calledWith('hide');
      outsideClickHandler.unbind.should.have.been.called;
    });

  });

  describe('select:', function() {
    beforeEach(function() {
      sandbox.stub($scope, 'toggleTooltip');
    });

    it('should select and toggle tooltip', function() {
      $scope.toggleTooltip.resetHistory();

      $scope.select();

      scheduleSelectorFactory.select.should.have.been.called;
      $scope.toggleTooltip.should.have.been.called;
    });
  });
});
