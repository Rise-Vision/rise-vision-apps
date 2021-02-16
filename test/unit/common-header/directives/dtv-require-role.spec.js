"use strict";
describe("directive: requireRole", function() {
  var $compile,
      $rootScope,
      $scope,
      parentElement,
      roles;

  beforeEach(module("risevision.common.header.directives"));
  beforeEach(module(function ($provide) {
    $provide.service("userState", function() {
      return {
        getSelectedCompanyId: function() {
          return "aa";
        },
        _restoreState: function() {},
        hasRole: function (role) {
          if (roles) {
            return roles.indexOf(role) >= 0;
          }
          return false;
        }
      };
    });
  }));

  beforeEach(inject(function(_$compile_, _$rootScope_){
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    $scope = $rootScope.$new();
    parentElement = angular.element("<div></div>");
    parentElement.appendTo(document.body);
  }));

  it("should remove element when user has no matching role ", function() {
    var element =  angular.element("<p require-role='ce'>protected</p>");
    parentElement.append(element);
    element = $compile(element)($scope);
    $scope.$apply();
    expect(parentElement.text()).to.equal("");
  });

  it("should show element when user has role", function() {
    roles = ["ce"];
    var element =  angular.element("<p require-role='ce'>protected</p>");
    parentElement.append(element);
    element = $compile(element)($scope);
    $scope.$apply();
    expect(parentElement.text()).to.equal("protected");
  });

  it("should accept multiple roles and show if any matches", function() {
    roles = ["cp"];
    var element =  angular.element("<p require-role='ce cp'>protected</p>");
    parentElement.append(element);
    element = $compile(element)($scope);
    $scope.$apply();
    expect(parentElement.text()).to.equal("protected");
  });    
  
});
