'use strict';
describe('directive: share-schedule-button', function() {
  var $scope, $rootScope, element, $timeout, innerElementStub, sandbox = sinon.sandbox.create();

  beforeEach(module('risevision.schedules.directives'));

  beforeEach(inject(function($compile, $templateCache, $injector){
    $templateCache.put('partials/schedules/share-schedule-button.html', '<div id="tooltipButton"></div><div id="actionSheetButton"></div>');
    $rootScope = $injector.get('$rootScope');
    $timeout = $injector.get('$timeout');

    innerElementStub = {
      trigger: sandbox.stub()
    };
    sandbox.stub(angular,'element').returns(innerElementStub);

    $scope = $rootScope.$new();

    element = $compile('<share-schedule-button schedule-id="123"></share-schedule-button>')($scope);

    $rootScope.$digest();
    $scope = element.isolateScope();   
  }));

  afterEach(function () {
    element.remove();
    sandbox.restore();
  });

  it('should exist', function() {
    expect($scope).to.be.ok;
    expect($scope.scheduleId).to.equal(123);
    expect($scope.dismiss).to.be.a('function');
    expect($scope.toggleTooltip).to.be.a('function');
    expect($scope.toggleActionSheet).to.be.a('function');
  });

  it('should compile', function() {
    expect(element[0].outerHTML).to.equal('<share-schedule-button schedule-id="123" class="ng-scope ng-isolate-scope"><div id="tooltipButton"></div><div id="actionSheetButton"></div></share-schedule-button>');
  });

  describe('toggleTooltip:', function() {
    it('should open tooltip', function() {
      $scope.toggleTooltip();
      $timeout.flush();

      innerElementStub.trigger.should.have.been.calledWith('show');
    });

    it('should close tooltip if open', function() {
      //open
      $scope.toggleTooltip();
      $timeout.flush();
      innerElementStub.trigger.resetHistory();

      //close
      $scope.toggleTooltip();
      $timeout.flush();

      innerElementStub.trigger.should.have.been.calledWith('hide');
    });
  });

  describe('toggleActionSheet:', function() {
    it('should open action sheet', function() {
      $scope.toggleActionSheet();

      innerElementStub.trigger.should.have.been.calledWith('toggle');
    });

    it('should close close if open', function() {
      //open
      $scope.toggleActionSheet();
      innerElementStub.trigger.resetHistory();

      //close
      $scope.toggleActionSheet();

      innerElementStub.trigger.should.have.been.calledWith('toggle');
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

    it('should close action sheet if open', function() {
      $scope.toggleActionSheet();
      $timeout.flush();
      innerElementStub.trigger.resetHistory();

      $scope.dismiss();
      $timeout.flush();

      innerElementStub.trigger.should.have.been.calledWith('toggle');
    });
  });
});
