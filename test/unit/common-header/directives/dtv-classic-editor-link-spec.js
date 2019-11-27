/*jshint expr:true */

"use strict";
describe("directive: classic editor link", function() {
  beforeEach(module("risevision.common.header.directives"));

  var $scope, elem, $window, userState;
  beforeEach(module(function ($provide) {
    $provide.service("userState", function() {
      return {
        getSelectedCompanyId: function() {
          return "aa";
        },
        getCopyOfSelectedCompany: sinon.stub().returns({}),
        _restoreState: function() {}
      };
    });

  }));

  beforeEach(inject(function($injector, $compile, $rootScope) {
    $window = $injector.get("$window");
    userState = $injector.get("userState");

    elem = angular.element("<div classic-editor-link ng-hide=\"hideEditorLink\"><a>mock</a></div>");

    $scope = $rootScope.$new();
    $compile(elem)($scope);
    $scope.$digest();
  }));

  it("should populate html", function() {
    expect(elem[0].outerHTML).to.equal("<div classic-editor-link=\"\" ng-hide=\"hideEditorLink\" class=\"ng-scope\"><a>mock</a></div>");
  });

  it("should handle click event and open classic editor", function() {
    sinon.stub($window, 'open');

    var link = elem.find('a');

    link.click();

    $window.open.should.have.been.calledWith('https://rva.risevision.com/#PRESENTATIONS?cid=aa', '_blank');
  });

  describe("hideEditorLink:", function() {
    it("should refresh hideEditorLink value on company change", function() {
      userState.getCopyOfSelectedCompany.returns({
        creationDate: new Date('Dec 29, 2019')
      });

      expect(elem.scope().hideEditorLink).to.be.undefined;

      $scope.$broadcast("risevision.company.selectedCompanyChanged");
      $scope.$digest();

      expect(elem.scope().hideEditorLink).to.be.true;

      expect(elem[0].outerHTML).to.equal("<div classic-editor-link=\"\" ng-hide=\"hideEditorLink\" class=\"ng-scope ng-hide\"><a>mock</a></div>");
    });
    
    it("should not hideEditorLink if the company was created before the release date", function() {
      userState.getCopyOfSelectedCompany.returns({
        creationDate: new Date('Oct 29, 2019')
      });

      $scope.$broadcast("risevision.company.selectedCompanyChanged");
      $scope.$digest();

      expect(elem.scope().hideEditorLink).to.be.false;

      expect(elem[0].outerHTML).to.equal("<div classic-editor-link=\"\" ng-hide=\"hideEditorLink\" class=\"ng-scope\"><a>mock</a></div>");
    });
    
  });
});
