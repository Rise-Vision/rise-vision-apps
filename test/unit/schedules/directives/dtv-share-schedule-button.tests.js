'use strict';
describe('directive: share-schedule-button', function() {
  var $scope, $rootScope, element, $timeout, innerElementStub, currentPlanFactory, plansFactory, outsideClickHandler,
    sandbox = sinon.sandbox.create();


  beforeEach(module('risevision.schedules.directives'));
  beforeEach(module(function ($provide) {
    $provide.service('currentPlanFactory', function() {
      return {
        isPlanActive: sinon.stub().returns(true)
      };
    });
    $provide.service('plansFactory', function() {
      return {
        showUnlockThisFeatureModal: sinon.stub()
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
    $templateCache.put('partials/schedules/share-schedule-button.html', '<div id="share-schedule-button"></div><div id="actionSheetButton"></div>');
    $rootScope = $injector.get('$rootScope');
    $timeout = $injector.get('$timeout');
    currentPlanFactory = $injector.get('currentPlanFactory');
    plansFactory = $injector.get('plansFactory');
    outsideClickHandler = $injector.get('outsideClickHandler');

    innerElementStub = {
      trigger: sandbox.stub(),
      bind: sandbox.stub(),
      unbind: sandbox.stub()
    };
    sandbox.stub(angular,'element').returns(innerElementStub);

    $scope = $rootScope.$new();
    $rootScope.selectedSchedule = {
      id: 123
    };

    element = $compile('<share-schedule-button schedule="selectedSchedule"></share-schedule-button>')($scope);

    $rootScope.$digest();
    $scope = element.isolateScope();   
  }));

  afterEach(function () {
    element.remove();
    sandbox.restore();
  });

  it('should exist', function() {
    expect($scope).to.be.ok;
    expect($scope.schedule.id).to.equal(123);
    expect($scope.dismiss).to.be.a('function');
    expect($scope.toggleTooltip).to.be.a('function');
    expect($scope.toggleActionSheet).to.be.a('function');
  });

  it('should compile', function() {
    expect(element[0].outerHTML).to.equal('<share-schedule-button schedule="selectedSchedule" class="ng-scope ng-isolate-scope"><div id="share-schedule-button"></div><div id="actionSheetButton"></div></share-schedule-button>');
  });

  describe('toggleTooltip:', function() {
    it('should open tooltip and register outsideClickHandler', function() {
      $scope.toggleTooltip();
      $timeout.flush();

      innerElementStub.trigger.should.have.been.calledWith('show');
      outsideClickHandler.bind.should.have.been.calledWith('share-schedule', '#share-schedule-button, #share-schedule-popover', $scope.toggleTooltip);
    });

    it('should close tooltip if open and unregister outsideClickHandler', function() {
      //open
      $scope.toggleTooltip();
      $timeout.flush();
      innerElementStub.trigger.resetHistory();

      //close
      $scope.toggleTooltip();
      $timeout.flush();

      innerElementStub.trigger.should.have.been.calledWith('hide');
      outsideClickHandler.unbind.should.have.been.called;
    });

    it('should show Unlock This Feature modal if user is not subscribed to a plan', function() {
      currentPlanFactory.isPlanActive.returns(false);
      $scope.toggleTooltip();

      plansFactory.showUnlockThisFeatureModal.should.have.been.called;
    });
  });

  describe('toggleActionSheet:', function() {
    it('should open action sheet', function() {
      $scope.toggleActionSheet();

      innerElementStub.trigger.should.have.been.calledWith('toggle');
    });

    it('should close action sheet if open', function() {
      //open
      $scope.toggleActionSheet();
      innerElementStub.trigger.resetHistory();

      //close
      $scope.toggleActionSheet();

      innerElementStub.trigger.should.have.been.calledWith('toggle');
    });

    it('should show Unlock This Feature modal if user is not subscribed to a plan', function() {
      currentPlanFactory.isPlanActive.returns(false);
      $scope.toggleActionSheet();
      
      plansFactory.showUnlockThisFeatureModal.should.have.been.called;
    });

    it('should bind to window resize on open', function() {
      $scope.toggleActionSheet();

      innerElementStub.bind.should.have.been.calledWith('resize',$scope.toggleActionSheet);
    });

    it('should unbind from window resize when closing', function() {
      $scope.toggleActionSheet();
      innerElementStub.trigger.resetHistory();
      $scope.toggleActionSheet();

      innerElementStub.unbind.should.have.been.calledWith('resize',$scope.toggleActionSheet);
    });
  });

  describe('dismiss:', function() {
    it('should close tooltip if open', function() {
      $scope.toggleTooltip();
      $timeout.flush();
      innerElementStub.trigger.resetHistory();

      $scope.dismiss();
      $timeout.flush();

      innerElementStub.trigger.should.have.been.calledWith('hide');
    });

    it('should close action sheet if open and unbind from window resize', function() {
      $scope.toggleActionSheet();
      $timeout.flush();
      innerElementStub.trigger.resetHistory();

      $scope.dismiss();
      $timeout.flush();

      innerElementStub.trigger.should.have.been.calledWith('toggle');
      innerElementStub.unbind.should.have.been.calledWith('resize',$scope.toggleActionSheet);
    });
  });
});
