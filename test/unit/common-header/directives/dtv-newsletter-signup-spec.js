/*jshint expr:true */

"use strict";
describe("directive: newsletter signup", function() {
  beforeEach(module("risevision.common.header.directives"));

  var $scope, elemScope;

  beforeEach(inject(function($compile, $rootScope) {
    $scope = $rootScope.$new();
    var validHTML =
      "<form name=\"form\">" +
      "  <newsletter-signup ng-model=\"user.mailSyncEnabled\" already-opted-in=\"user.alreadyOptedIn\" company-industry=\"company.companyIndustry\" />" +
      "</form>";
    $scope.user = { alreadyOptedIn: false };
    $scope.company = {};
    var elem = $compile(validHTML)($scope);
    elemScope = elem.children().isolateScope();

    $scope.$digest();
  }));

  it("should initialize", function(done) {
    $scope.user.mailSyncEnabled = true;
    $scope.company.companyIndustry = "OTHER";
    $scope.$digest();

    setTimeout(function() {
      expect(elemScope.mailSyncEnabled).to.be.true;
      expect(elemScope.companyIndustry).to.equal("OTHER");
      done();
    });
  });

  describe("showNewsletterSignup:", function() {
    it("should return false for other Industries for K-12 and Higher Education", function () {
      $scope.company.companyIndustry = "";
      $scope.$digest();
      expect(elemScope.showNewsletterSignup()).to.be.false;

      $scope.company.companyIndustry = "OTHER";
      $scope.$digest();
      expect(elemScope.showNewsletterSignup()).to.be.false;

    });

    it("should return true for K-12 and Higher Education", function () {
      $scope.company.companyIndustry = "PRIMARY_SECONDARY_EDUCATION";
      $scope.$digest();
      expect(elemScope.showNewsletterSignup()).to.be.true;

      $scope.company.companyIndustry = "HIGHER_EDUCATION";
      $scope.$digest();
      expect(elemScope.showNewsletterSignup()).to.be.true;

    });

  });

});

describe("directive: newsletter already opted in", function() {
  beforeEach(module("risevision.common.header.directives"));

  var $scope, elemScope;

  beforeEach(inject(function($compile, $rootScope) {
    $scope = $rootScope.$new();
    var validHTML =
      "<form name=\"form\">" +
      "  <newsletter-signup ng-model=\"user.mailSyncEnabled\" already-opted-in=\"user.alreadyOptedIn\" company-industry=\"company.companyIndustry\" />" +
      "</form>";
    $scope.user = { mailSyncEnabled: true, alreadyOptedIn: true };
    $scope.company = {};
    var elem = $compile(validHTML)($scope);
    elemScope = elem.children().isolateScope();

    $scope.$digest();
  }));

  describe("showNewsletterSignup:", function() {
    it("should return false if it's already opted in", function () {
      $scope.company.companyIndustry = "PRIMARY_SECONDARY_EDUCATION";
      $scope.$digest();
      expect(elemScope.showNewsletterSignup()).to.be.false;

      $scope.company.companyIndustry = "HIGHER_EDUCATION";
      $scope.$digest();
      expect(elemScope.showNewsletterSignup()).to.be.false;

      $scope.company.companyIndustry = "";
      $scope.$digest();
      expect(elemScope.showNewsletterSignup()).to.be.false;

      $scope.company.companyIndustry = "OTHER";
      $scope.$digest();
      expect(elemScope.showNewsletterSignup()).to.be.false;
    });

  });

});
