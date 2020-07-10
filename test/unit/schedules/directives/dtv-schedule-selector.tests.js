'use strict';

describe('directive: schedule-selector', function() {
  var $scope, $rootScope, element, $loading, $timeout, innerElementStub, scheduleSelectorFactory,
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
  }));

  beforeEach(inject(function($compile, $templateCache, $injector){
    $templateCache.put('partials/schedules/schedule-selector.html', '<div id="tooltipButton"></div>');
    $rootScope = $injector.get('$rootScope');
    $timeout = $injector.get('$timeout');
    $loading = $injector.get('$loading');
    scheduleSelectorFactory = $injector.get('scheduleSelectorFactory');

    innerElementStub = {
      trigger: sandbox.stub()
    };
    sandbox.stub(angular,'element').returns(innerElementStub);

    $scope = $rootScope.$new();

    element = $compile('<schedule-selector show-tooltip="showTooltip"></schedule-selector>')($scope);

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
    expect(element[0].outerHTML).to.equal('<schedule-selector show-tooltip="showTooltip" class="ng-scope ng-isolate-scope"><div id="tooltipButton"></div></schedule-selector>');
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
    it('should open tooltip and load', function() {
      $scope.toggleTooltip();
      $scope.$digest();
      $timeout.flush();

      $scope.factory.load.should.have.been.called;
      innerElementStub.trigger.should.have.been.calledWith('show');
    });

    it('should close tooltip if open', function() {
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
