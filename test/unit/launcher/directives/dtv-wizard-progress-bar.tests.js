'use strict';
describe('directive: wizard-progress-bar', function() {
  var $compile,
      $rootScope,
      $scope,
      element,
      event;
  beforeEach(module('risevision.apps.launcher.directives'));
  beforeEach(inject(function(_$compile_, _$rootScope_, $templateCache){
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    $scope = $rootScope.$new();
    $templateCache.put('partials/launcher/wizard-progress-bar.html', '<p>mock</p>');

    element = $compile('<wizard-progress-bar number-of-steps="4" current-step="1"></wizard-progress-bar>')($scope);
    $scope.$digest();
  }));

  describe('wizard-progress-bar:', function () {
    it('should compile', function() {
      expect(element[0].outerHTML).to.equal('<wizard-progress-bar number-of-steps="4" current-step="1" class="ng-scope ng-isolate-scope"><p>mock</p></wizard-progress-bar>');
    });

    it('should initialize scope', function() {
      var scope = element.isolateScope();

      expect(scope._).to.be.ok;
      
      expect(scope.numberOfSteps).to.equal(4);
      expect(scope.currentStep).to.equal(1);
    });
  });
});
