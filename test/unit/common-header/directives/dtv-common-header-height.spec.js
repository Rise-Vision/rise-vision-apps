/*jshint expr:true */

"use strict";
describe("directive: common header height", function() {
  beforeEach(module("risevision.common.header.directives"));

  var $rootScope, $timeout, elem, height;
  beforeEach(module(function ($provide) {
    height = 141;
    $provide.service("$window", function() {
      return {
        document: {
          getElementById: function(elementId) {
            expect(elementId).to.equal("commonHeaderDiv");
            return "common-header-div";
          }
        },
        getComputedStyle: function(element) {
          expect(element).to.equal("common-header-div");
          return {
            getPropertyValue: function(property) {
              expect(property).to.equal("height");
              return height;
            }
          };
        }
      };
    });
  }));

  beforeEach(inject(function($injector, $compile, _$rootScope_) {
    $timeout = $injector.get("$timeout");
    $rootScope = _$rootScope_;

    elem = angular.element("<div common-header-height style=\"--common-header-height:120px;\">mock</div>");

    $compile(elem)($rootScope);

    $rootScope.$digest();
  }));

  it("should populate html", function() {
    expect(elem[0].outerHTML).to.equal("<div common-header-height=\"\" style=\"--common-header-height:120px;\" class=\"ng-scope\">mock</div>");
  });

  it("should initialize", function(done) {
    sinon.spy(elem[0].style, "setProperty");

    $timeout.flush();

    setTimeout(function() {
      elem[0].style.setProperty.should.have.been.calledWith("--common-header-height", "141px");
      done();
    }, 10);
  });

  describe("event handlers", function() {
    beforeEach(function(done) {
      $timeout.flush();

      setTimeout(function() {
        done();
      }, 10);
    });

    it("should refresh value on company change", function(done) {
      sinon.spy(elem[0].style, "setProperty");
      height = 100;

      $rootScope.$broadcast("risevision.company.selectedCompanyChanged");
      $rootScope.$digest();

      $timeout.flush();

      setTimeout(function() {
        elem[0].style.setProperty.should.have.been.calledWith("--common-header-height", "100px");
        done();
      }, 10);
    });

    it("should refresh value on company update", function(done) {
      sinon.spy(elem[0].style, "setProperty");
      height = 105;

      $rootScope.$broadcast("risevision.company.updated");
      $rootScope.$digest();

      $timeout.flush();

      setTimeout(function() {
        elem[0].style.setProperty.should.have.been.calledWith("--common-header-height", "105px");
        done();
      }, 10);
    });

  });
  
});
