'use strict';

describe('directive: preview-selector', function() {
  var $scope, $rootScope, element, $loading, $timeout, innerElementStub, listServiceInstance, $document,
    sandbox = sinon.sandbox.create();


  beforeEach(module('risevision.schedules.directives'));
  beforeEach(module(function ($provide) {
    $provide.service('$loading', function() {
      return {
        start: sinon.stub(),
        stop: sinon.stub()
      };
    });
    $provide.service('schedule', function() {
      return {
      };
    });
    $provide.service('ScrollingListService', function () {
      return function () {
        return listServiceInstance;
      };
    });
  }));

  beforeEach(inject(function($compile, $injector, $templateCache){
    $templateCache.put('partials/schedules/preview-selector.html', '<div id="preview-selector-tooltip"></div>');
    $rootScope = $injector.get('$rootScope');
    $timeout = $injector.get('$timeout');
    $loading = $injector.get('$loading');
    $document = $injector.get('$document');

    listServiceInstance = {
      doSearch: sandbox.stub()
    };

    innerElementStub = {
      trigger: sandbox.stub()
    };
    sandbox.stub(angular,'element').returns(innerElementStub);

    $rootScope.mySchedule = {
      id: 'myScheduleId'
    };
    $rootScope.selectedCallback = sinon.stub();

    element = $compile('<preview-selector ng-model="mySchedule" on-select="selectedCallback()"></preview-selector>')($rootScope.$new());

    $rootScope.$digest();
    $scope = element.isolateScope();
  }));

  afterEach(function () {
    element.remove();
    sandbox.restore();
  });

  it('should exist', function() {
    expect($scope).to.be.ok;
    expect($scope.toggleTooltip).to.be.a('function');
    expect($scope.select).to.be.a('function');

    expect($scope.showTooltip).to.be.false;
  });


  it('should compile', function() {
    expect(element[0].outerHTML).to.equal('<preview-selector ng-model="mySchedule" on-select="selectedCallback()" class="ng-pristine ng-untouched ng-valid ng-scope ng-isolate-scope ng-not-empty"><div id="preview-selector-tooltip"></div></preview-selector>');
  });
  
  it('should initialize', function() {
    expect($scope.showTooltip).to.be.false;
    expect($scope.filterConfig).to.deep.equal({
      placeholder: 'Search schedules'
    });
    expect($scope.search).to.deep.equal({
      sortBy: 'changeDate',
      reverse: true,
    });
  });

  describe('spinner:', function() {
    it('should show spinner when loading selected Schedules', function() {
      $scope.schedules = {};
      $scope.schedules.loadingItems = true;
      $scope.$digest();
      $loading.start.should.have.been.calledWith('preview-selector-spinner');
    });

    it('should hide spinner when finished loading selected Schedules', function() {
      $loading.stop.resetHistory();

      $scope.schedules = {};
      $scope.schedules.loadingItems = true;
      $scope.$digest();
      $scope.schedules.loadingItems = false;
      $scope.$digest();

      $loading.stop.should.have.been.calledWith('preview-selector-spinner');
    });
  });

  describe('toggleTooltip:', function() {
    it('should open tooltip and load', function() {
      sinon.spy($document,'bind');

      $scope.toggleTooltip();
      $scope.$digest();
      $timeout.flush();

      innerElementStub.trigger.should.have.been.calledWith('show');

      $document.bind.should.have.been.calledWith('click');
      $document.bind.should.have.been.calledWith('touchstart');
    });

    it('should initialize schedules list', function() {
      $scope.toggleTooltip();
      $scope.$digest();
      $timeout.flush();

      expect($scope.schedules).to.equal(listServiceInstance);
    });

    it('should close tooltip if open', function() {
      sinon.spy($document,'unbind');
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

      $document.unbind.should.have.been.calledWith('click');
      $document.unbind.should.have.been.calledWith('touchstart');
    });

    it('should close tooltip when clicking outside', function() {
      $scope.toggleTooltip();
      $scope.$digest();
      $timeout.flush();
      innerElementStub.trigger.reset();

      //click outside
      $document.trigger('click');

      $scope.$digest();
      $timeout.flush();

      innerElementStub.trigger.should.have.been.calledWith('hide');
    });

    it('should not close tooltip when clicking inside', function() {
      $scope.toggleTooltip();
      $scope.$digest();
      $timeout.flush();
      innerElementStub.trigger.reset();

      //click inside tooltip
      var event = new CustomEvent('click');
      var target = angular.element('#preview-selector-tooltip');
      target.trigger('click');

      $scope.$digest();
      innerElementStub.trigger.should.not.have.been.calledWith('hide');
    });

  });

  describe('select:', function() {
    beforeEach(function() {
      sandbox.stub($scope, 'toggleTooltip');
    });

    it('should set ngModel and clsoe tooltip', function() {
      var newSchedule = {
        id: 'newScheduleId'
      };
      $scope.toggleTooltip.resetHistory();

      $scope.select(newSchedule);

      expect($scope.ngModel).to.equal(newSchedule);
      $rootScope.selectedCallback.should.have.been.called;
      $scope.toggleTooltip.should.have.been.called;
    });
  });
});
