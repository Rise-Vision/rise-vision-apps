"use strict";

/*jshint expr:true */

describe("directive: http validator", function() {
  beforeEach(module("risevision.widget.common.url-field.http-validator"));
  var $scope, form, insecureUrl;

  beforeEach(module(function ($provide) {
    $provide.service('insecureUrl', function() { 
      return sinon.stub().returns(true);
    });
  }));

  beforeEach(inject(function($compile, $rootScope, $injector) {
    insecureUrl = $injector.get('insecureUrl');

    $scope = $rootScope.$new();
    var element = angular.element(
      "<form name=\"form\">" +
      "<input ng-model=\"url\" name=\"url\" http-validator />" +
      "</form>"
    );
    $scope.url = "";
    $compile(element)($scope);
    form = $scope.form;
    
    $scope.$digest();
  }));

  it("should not pass with insecure urls", function() {
    var value = 'http://shouldfail.com';

    form.url.$setViewValue(value);
    $scope.$digest();
    expect(form.url.$valid).to.be.false;

    insecureUrl.should.have.been.calledWith(value);
  });

  it("should pass with valid url", function() {
    insecureUrl.returns(false);

    var value = 'https://risevision.com';

    form.url.$setViewValue(value);
    $scope.$digest();
    expect(form.url.$valid).to.be.true;

    insecureUrl.should.have.been.calledWith(value);
  });

});
