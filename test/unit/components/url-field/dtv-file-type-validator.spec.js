'use strict';

/*jshint expr:true */

describe('directive: file type validator', function() {
  beforeEach(module('risevision.widget.common.url-field.file-type-validator'));
  var $scope, form;

  beforeEach(inject(function($compile, $rootScope) {
    $scope = $rootScope.$new();
    var element = angular.element(
      '<form name="form">' +
      '<input ng-model="url" name="url" file-type-validator="IMAGES" />' +
      '</form>'
    );
    $scope.url = '1234';
    $compile(element)($scope);
    form = $scope.form;
    
    $scope.$digest();
  }));

  it('should pass with blank value', function() {
    form.url.$setViewValue('');
    $scope.$digest();
    expect($scope.url).to.not.be.ok;
    expect(form.url.$valid).to.be.true;
  });

  it('should pass with correct type', function() {
    form.url.$setViewValue('www.url.com/logo.gif');
    $scope.$digest();
    expect(form.url.$valid).to.be.true;
  });

  it('should not pass with incorrect type', function() {
    form.url.$setViewValue('www.url.com/logo.ogg');
    $scope.$digest();
    expect(form.url.$valid).to.be.false;
  });

  it('should set a user friendly message on error', function() {
    form.url.$setViewValue('www.url.ogg');
    $scope.$digest();
    expect(form.url.customErrorMessage).to.equal('Please provide a valid file type. (jpg, jpeg, png, bmp, svg, gif, webp)');
  });
  
  
});
