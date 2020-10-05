'use strict';
describe('directive: batch-operations', function() {
  var $scope,
      element;
  beforeEach(module('risevision.apps.directives'));
  beforeEach(module(function ($provide) {

  }));
  beforeEach(inject(function($compile, $rootScope, $templateCache){
    $rootScope.listObject = 'listObject';
    $rootScope.listOperations = 'listOperations';

    $templateCache.put('partials/common/batch-operations.html', '<p>mock</p>');

    element = $compile('<batch-operations list-object="listObject" list-operations="listOperations"></batch-operations>')($rootScope.$new());
    $rootScope.$digest();
    $scope = element.isolateScope();   
  }));

  describe('batch-operations:', function () {
    it('should compile', function() {
      expect(element[0].outerHTML).to.equal('<batch-operations list-object="listObject" list-operations="listOperations" class="ng-scope ng-isolate-scope"><p>mock</p></batch-operations>');
    });

    it('should initialize scope', function() {
      expect($scope.listObject).to.equal('listObject');
      expect($scope.listOperations).to.equal('listOperations');
    });

  });

});
