'use strict';
describe('directive: share-url-button', function() {
  var $scope, element, $timeout;

  beforeEach(module('risevision.apps.billing.directives'));

  beforeEach(inject(function($compile, $rootScope, $templateCache, $injector){
    $templateCache.put('partials/billing/share-url-button.html', '<button id="tooltipButton"></button>');
    $timeout = $injector.get('$timeout');

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
    expect(element[0].outerHTML).to.equal('<button id="tooltipButton" class="ng-isolate-scope"></button>');
  });

  describe('toggleTooltip:', function() {
    it('should open tooltip', function(done) {
      element.on('show', function() {
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
        done();
      });

      $scope.dismiss();
      $timeout.flush();
    });
  });

});
