/*jshint expr:true */

"use strict";
describe("directive: integer parser", function() {
  beforeEach(module("risevision.common.header.directives"));

  var $scope, form;

  beforeEach(inject(function($compile, $rootScope) {
    $scope = $rootScope.$new();
    var element = angular.element(
      "<form name=\"form\">" +
      "<select name=\"timezone\" ng-model=\"company.timeZoneOffset\" integer-parser>" +
      " <option ng-show=\"false\" value=\"\">&lt; Select Time Zone &gt;</option>" +
      " <option value=\"{{c[1]}}\" ng-repeat=\"c in TIMEZONES\">{{c[0]}}</option>" +
      "</select>" +
      "</form>"
    );
    $scope.company = { 
    };
    $scope.TIMEZONES = [
      ["(GMT -01:00) Cape Verde Is.", "-60"],
      ["(GMT  00:00) Dublin, Edinburgh, Lisbon, London", "0"],
      ["(GMT +01:00) Amsterdam, Berlin, Bern, Rome, Paris, Stockholm, Vienna",
        "60"
      ]
    ];
    $compile(element)($scope);
    form = $scope.form;
    
    $scope.$digest();
  }));

  it("should default to undefined", function() {
    expect($scope.company.timeZoneOffset).to.not.equal(null);
    expect($scope.company.timeZoneOffset).to.be.undefined;
    expect(form.timezone.$viewValue).to.equal("");
  });
  
  it("should initialize", function() {
    $scope.company.timeZoneOffset = 0;
    $scope.$digest();
    expect($scope.company.timeZoneOffset).to.equal(0);
    expect(form.timezone.$viewValue).to.equal("0");
  });

  it("should pass selected value", function() {
    form.timezone.$setViewValue(-60);
    $scope.$digest();
    expect(form.timezone.$viewValue).to.equal(-60);
    expect($scope.company.timeZoneOffset).to.equal(-60);
  });
  
  it("should parse string value", function() {
    form.timezone.$setViewValue("60");
    $scope.$digest();
    expect(form.timezone.$viewValue).to.equal("60");
    expect($scope.company.timeZoneOffset).to.equal(60);
  });
  
});
