'use strict';
describe('directive: tooltip-overlay', function() {
  var $scope,
    element,
    $window,
    $timeout,
    honeBackdropFactory,
    tourFactory,
    sandbox = sinon.sandbox.create();

  beforeEach(module('risevision.apps.directives'));
  beforeEach(module(function ($provide) {
    $provide.service('honeBackdropFactory', function() {
      return {
        createForElement: sandbox.stub(),
        hide: sandbox.stub()
      };
    });
    $provide.service('tourFactory', function() {
      return {
        isShowing: sandbox.stub().returns(true),
        dismissed: sandbox.spy()
      };
    });
  }));

  beforeEach(inject(function($compile, $rootScope, $injector){
    $scope = $rootScope.$new();

    $window = $injector.get('$window');
    $timeout = $injector.get('$timeout');
    honeBackdropFactory = $injector.get('honeBackdropFactory');
    tourFactory = $injector.get('tourFactory');

    var $document = $injector.get('$document');
    var $body = angular.element($document[0].body);

    element = $compile('<div tooltip-overlay="tooltipKey"></div>')($scope);

    $body.append(element);

    $scope = element.scope();
    $scope.$digest();
  }));

  afterEach(function () {
    element.remove();

    sandbox.restore();
  });

  it('should initialize', function() {
    expect($scope).to.be.ok;
    expect($scope.dismiss).to.be.a('function');
  });

  it('should compile', function() {
    expect(element[0].outerHTML).to.equal('<div tooltip-trigger="show" ng-click="dismiss()" tooltip-animation="false" tooltip-digest-on-resize="" class="ng-scope"></div>');
  });

  describe('tooltipKey:', function() {
    it('should show if tooltipKey is valid and tour isShowing', function() {
      $scope.tooltipKey = 'tooltipKey';
      $scope.$digest();
      $timeout.flush();

      tourFactory.isShowing.should.have.been.calledWith('tooltipKey');
      honeBackdropFactory.createForElement.should.have.been.calledWith(element, {});
    });

    it('should not show if tour is not showing and clear tooltip key', function() {
      tourFactory.isShowing.returns(false);

      $scope.tooltipKey = 'tooltipKey';
      $scope.$digest();

      $timeout.verifyNoPendingTasks();

      tourFactory.isShowing.should.have.been.calledWith('tooltipKey');
      honeBackdropFactory.createForElement.should.not.have.been.called;

      expect($scope.tooltipKey).to.not.be.ok;      
    });

    it('should not show if tooltip key is blank', function() {
      $scope.tooltipKey = '';
      $scope.$digest();

      $timeout.verifyNoPendingTasks();

      tourFactory.isShowing.should.not.have.been.called;
      honeBackdropFactory.createForElement.should.not.have.been.called;
    });

    it('should not show if element is hidden', function() {
      element.hide();

      $scope.tooltipKey = 'tooltipKey';
      $scope.$digest();

      honeBackdropFactory.createForElement.should.not.have.been.called;

      $timeout.flush();

      honeBackdropFactory.createForElement.should.not.have.been.called;
    });

    it('should trigger show event', function(done) {
      element.on('show', function() {
        done();
      });

      $scope.tooltipKey = 'tooltipKey';
      $scope.$digest();

      $timeout.flush();
    });
  });

  describe('tooltip-overlay-key:', function() {

    it('should show if keys match', function() {
      element[0].setAttribute('tooltip-overlay-key', 'tooltipKey1');
      $scope.tooltipKey = 'tooltipKey1';
      $scope.$digest();
      $timeout.flush();

      honeBackdropFactory.createForElement.should.have.been.calledWith(element, {});
    });

    it('should not show if keys do not match', function() {
      element[0].setAttribute('tooltip-overlay-key', 'tooltipKey1');
      $scope.tooltipKey = 'wrongKey';
      $scope.$digest();

      honeBackdropFactory.createForElement.should.not.have.been.calledWith(element, {});
    });

  });

  describe('dismiss:', function() {
    it('should reset tooltip and update factory', function() {
      $scope.tooltipKey = 'tooltipKey';

      $scope.dismiss();

      tourFactory.dismissed.should.have.been.calledWith('tooltipKey');
      expect($scope.tooltipKey).to.not.be.ok;      
    });

    it('should hide asynchronously', function() {
      $scope.dismiss();

      honeBackdropFactory.hide.should.not.have.been.called;

      $timeout.flush();

      honeBackdropFactory.hide.should.have.been.called;
    });

    it('should trigger hide event', function(done) {
      element.on('hide', function() {
        done();
      });

      $scope.dismiss();

      $timeout.flush();
    });
  });

});
