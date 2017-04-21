'use strict';
describe('directive: guid validator', function() {
  beforeEach(module('risevision.apps.directives'));
  var $scope, form;

  beforeEach(inject(function($compile, $rootScope) {
    $scope = $rootScope.$new();
    var element = angular.element(
      '<form name="form">' +
      '<input ng-model="id" name="id" guid-validator />' +
      '</form>'
    );
    $scope.id = '1234';
    $compile(element)($scope);
    form = $scope.form;
    
    $scope.$digest();
  }));

  it('should pass with blank value', function() {
    form.id.$setViewValue('');
    $scope.$digest();
    expect($scope.id).to.not.be.ok;
    expect(form.id.$valid).to.be.true;
  });

  it('should not pass with incorrect format', function() {
    form.id.$setViewValue('1234');
    $scope.$digest();
    expect(form.id.$valid).to.be.false;
  });

  it('should not pass with invalid characters', function() {
    form.id.$setViewValue('74312x47-2x61-45ea-8ab0-b1exe81c79d5');
    $scope.$digest();
    expect(form.id.$valid).to.be.false;
  });

  it('should pass with valid id', function() {
    form.id.$setViewValue('abcdef01-1234-45ea-8ab0-b1e3e81c79d5');
    $scope.$digest();
    expect(form.id.$valid).to.be.true;
  });
  
});
