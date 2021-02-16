'use strict';
describe('directive: email validator', function() {
  beforeEach(module('risevision.common.header.directives'));
  var $scope, form;

  beforeEach(inject(function($compile, $rootScope) {
    $scope = $rootScope.$new();
    var element = angular.element(
      '<form name="form">' +
      '<input ng-model="email" name="email" email-validator />' +
      '</form>'
    );
    $scope.email = '1234';
    $compile(element)($scope);
    form = $scope.form;
    
    $scope.$digest();
  }));

  it('should pass with blank value', function() {
    form.email.$setViewValue('');
    $scope.$digest();
    expect($scope.email).to.not.be.ok;
    expect(form.email.$valid).to.be.true;
  });

  it('should not pass with incorrect format', function() {
    form.email.$setViewValue('1234');
    $scope.$digest();
    expect(form.email.$valid).to.be.false;
  });

  it('should pass with valid email', function() {
    form.email.$setViewValue('test@test.com');
    $scope.$digest();
    expect(form.email.$valid).to.be.true;
  });
  
});
