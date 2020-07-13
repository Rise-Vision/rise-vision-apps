'use strict';

describe('directive: preview-selector', function() {
  var $scope, $rootScope, element, $loading, $timeout, innerElementStub,
    sandbox = sinon.sandbox.create();


  beforeEach(module('risevision.schedules.directives'));
  beforeEach(module(function ($provide) {
    $provide.service('$loading', function() {
      return {
        start: sinon.stub(),
        stop: sinon.stub()
      };
    });
  }));

  beforeEach(inject(function($compile, $injector){
    $rootScope = $injector.get('$rootScope');
    $timeout = $injector.get('$timeout');
    $loading = $injector.get('$loading');

    innerElementStub = {
      trigger: sandbox.stub()
    };
    sandbox.stub(angular,'element').returns(innerElementStub);

    $scope = $rootScope.$new();
    $scope.schedules = {};

    element = $compile('<div preview-selector><div id="tooltipButton"></div></div>')($scope);

    $rootScope.$digest();
  }));

  afterEach(function () {
    element.remove();
    sandbox.restore();
  });

  it('should exist', function() {
    expect($scope).to.be.ok;
    expect($scope.toggleTooltip).to.be.a('function');
    expect($scope.selectSchedule).to.be.a('function');
    expect($scope.isSelected).to.be.a('function');
    expect($scope.select).to.be.a('function');

    expect($scope.showTooltip).to.be.false;
  });

  it('should compile', function() {
    expect(element[0].outerHTML).to.equal('<div preview-selector="" class="ng-scope"><div id="tooltipButton"></div></div>');
  });

  describe('spinner:', function() {
    it('should show spinner when loading selected Schedules', function() {
      $scope.schedules.loadingItems = true;
      $scope.$digest();
      $loading.start.should.have.been.calledWith('preview-selector-spinner');
    });

    it('should hide spinner when finished loading selected Schedules', function() {
      $loading.stop.resetHistory();

      $scope.schedules.loadingItems = true;
      $scope.$digest();
      $scope.schedules.loadingItems = false;
      $scope.$digest();

      $loading.stop.should.have.been.calledWith('preview-selector-spinner');
    });
  });

  describe('toggleTooltip:', function() {
    it('should open tooltip and load', function() {
      $scope.toggleTooltip();
      $scope.$digest();
      $timeout.flush();

      innerElementStub.trigger.should.have.been.calledWith('show');
    });

    it('should initialize selectedSchedule', function() {
      $scope.selectedSchedule = {
        id: 'selectedSchedule'
      };
      $scope.toggleTooltip();
      $scope.$digest();
      $timeout.flush();

      expect($scope.isSelected({
        id: 'selectedSchedule'
      })).to.be.true;
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

      $scope.selectSchedule('selectedSchedule');
      $scope.select();

      expect($scope.selectedSchedule).to.equal('selectedSchedule');
      $scope.toggleTooltip.should.have.been.called;
    });
  });
});
