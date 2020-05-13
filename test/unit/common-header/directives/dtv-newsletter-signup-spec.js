/*jshint expr:true */

"use strict";
describe("directive: newsletter signup", function() {
  beforeEach(module("risevision.common.header.directives"));

  var $scope, elemScope;

  beforeEach(inject(function($compile, $rootScope) {
    $scope = $rootScope.$new();
    var validHTML =
      "<form name=\"form\">" +
      "  <newsletter-signup ng-model=\"user.mailSyncEnabled\" already-opted-in=\"alreadyOptedIn\" />" +
      "</form>";

    $scope.alreadyOptedIn = false;
    $scope.user = {};
    $scope.company = {};
    var elem = $compile(validHTML)($scope);
    elemScope = elem.children().isolateScope();

    $scope.$digest();
  }));

  it("should initialize", function(done) {
    $scope.user.mailSyncEnabled = true;
    $scope.$digest();

    setTimeout(function() {
      expect(elemScope.mailSyncEnabled).to.be.true;
      done();
    });
  });

  describe("showNewsletterSignup:", function() {
    it("should return false if alreadyOptedIn", function () {
      $scope.alreadyOptedIn = true;
      $scope.$digest()

      expect(elemScope.showNewsletterSignup()).to.be.false;
    });

    it("should return true if not alreadyOptedIn", function () {
      expect(elemScope.showNewsletterSignup()).to.be.true;
    });

  });

});
