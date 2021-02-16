'use strict';
describe('directive: share-url-button', function() {
  var $scope, element, $timeout, outsideClickHandler;

  beforeEach(module('risevision.apps.billing.directives'));

  beforeEach(module(function ($provide) {
    $provide.service('outsideClickHandler', function() {
      return {
        bind: sinon.stub(),
        unbind: sinon.stub()
      };
    });
  }));

  beforeEach(inject(function($compile, $rootScope, $templateCache, $injector){
    $templateCache.put('partials/billing/share-url-button.html', '<button id="share-schedule-button"></button>');
    $timeout = $injector.get('$timeout');
    outsideClickHandler = $injector.get('outsideClickHandler');

    $scope = $rootScope.$new();

    element = $compile('<share-url-button></share-url-button>')($scope);

    $rootScope.$digest();
    $scope = element.isolateScope();   
  }));

  afterEach(function () {
    element.remove();
  });

  it('should exist', function() {
    expect($scope).to.be.ok;

    expect($scope.dismiss).to.be.a('function');
    expect($scope.toggleTooltip).to.be.a('function');
  });

  it('should compile', function() {
    expect(element[0].outerHTML).to.equal('<button id="share-schedule-button" class="ng-isolate-scope"></button>');
  });

  describe('toggleTooltip:', function() {
    it('should open tooltip', function(done) {
      element.on('show', function() {
        outsideClickHandler.bind.should.have.been.calledWith('share-url-button', '#share-url-button, #share-url-popover', $scope.toggleTooltip);

        done();
      });

      $scope.toggleTooltip();
      $timeout.flush();
    });

    it('should close tooltip if open', function(done) {
      //open
      $scope.toggleTooltip();
      $timeout.flush();

      element.on('hide', function() {
        outsideClickHandler.unbind.should.have.been.called;

        done();
      });

      //close
      $scope.toggleTooltip();
      $timeout.flush();
    });
  });

  describe('dismiss:', function() {
    it('should close tooltip if open', function(done) {
      $scope.toggleTooltip();
      $timeout.flush();

      element.on('hide', function() {
        outsideClickHandler.unbind.should.have.been.called;

        done();
      });

      $scope.dismiss();
      $timeout.flush();
    });
  });

});
