'use strict';
describe('directive: tooltip-overlay', function() {
  var $scope,
    element,
    $window,
    $timeout,
    honeBackdropFactory,
    sandbox = sinon.sandbox.create();

  beforeEach(module('risevision.apps.directives'));
  beforeEach(module(function ($provide) {
    $provide.service('honeBackdropFactory', function() {
      return {
        createForElement: sinon.stub(),
        hide: sinon.stub()
      };
    });
  }));

  beforeEach(inject(function($compile, $rootScope, $injector){
    $scope = $rootScope.$new();

    $window = $injector.get('$window');
    $timeout = $injector.get('$timeout');
    honeBackdropFactory = $injector.get('honeBackdropFactory');

    var $document = $injector.get('$document');
    var $body = angular.element($document[0].body);

    element = $compile('<div tooltip-overlay="isShowing"></div>')($scope);

    $body.append(element);

    $scope = element.scope();
    $scope.$digest();

    sinon.spy($scope, '$digest');
    sinon.stub($scope, '$emit');
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
    expect(element[0].outerHTML).to.equal('<div tooltip-template="&quot;partials/launcher/share-tooltip.html&quot;" tooltip-trigger="show" ng-click="dismiss()" class="ng-scope ng-isolate-scope"></div>');
  });

  describe('show', function() {
    it('should show asynchronously when isShowing is true', function() {
      $scope.isShowing = true;
      $scope.$digest();

      honeBackdropFactory.createForElement.should.not.have.been.called;

      $timeout.flush();

      honeBackdropFactory.createForElement.should.have.been.calledWith(element, {});
    });

    it('should not show if element is hidden', function() {
      element.hide();

      $scope.isShowing = true;
      $scope.$digest();

      honeBackdropFactory.createForElement.should.not.have.been.called;

      $timeout.flush();

      honeBackdropFactory.createForElement.should.not.have.been.called;
    });

    it('should trigger show event', function(done) {
      element.on('show', function() {
        done();
      });

      $scope.isShowing = true;
      $scope.$digest();

      $timeout.flush();
    });

    it('should trigger digest cycle on resize', function() {
      $scope.isShowing = true;
      $scope.$digest();

      $timeout.flush();

      $scope.$digest.reset();

      angular.element($window).trigger('resize');

      $scope.$digest.should.have.been.called;
    });
  });

  describe('hide', function() {
    beforeEach(function() {
      $scope.isShowing = true;
      $scope.$digest();

      $timeout.flush();
    });

    it('should hide asynchronously when isShowing is false', function() {
      $scope.isShowing = false;
      $scope.$digest();

      honeBackdropFactory.hide.should.not.have.been.called;

      $timeout.flush();

      honeBackdropFactory.hide.should.have.been.called;
    });

    it('should hide even if element is hidden', function() {
      element.hide();

      $scope.isShowing = false;
      $scope.$digest();

      $timeout.flush();

      honeBackdropFactory.hide.should.have.been.called;
    });

    it('should trigger show event', function(done) {
      element.on('hide', function() {
        done();
      });

      $scope.isShowing = false;
      $scope.$digest();

      $timeout.flush();
    });

    it('should remove resize handler', function() {
      $scope.isShowing = false;
      $scope.$digest();

      $timeout.flush();

      $scope.$digest.reset();

      angular.element($window).trigger('resize');

      $scope.$digest.should.not.have.been.called;
    });
  });

  it('dismiss:', function() {
    $scope.dismiss();

    expect($scope.isShowing).to.be.false;

    $scope.$emit.should.have.been.calledWith('tooltipOverlay.dismissed');
  });

});
