"use strict";
describe("controller: Distribution List", function() {
  beforeEach(module("risevision.common.components.distribution-selector"));
  beforeEach(module(function ($provide) {
    $provide.service("displayService",function(){
      return {
        list: 'listService'
      };
    });
    $provide.service("$loading",function(){
      return {
        start: sinon.spy(),
        stop: sinon.spy()
      };
    });
    $provide.service('ScrollingListService', function() {
      return sinon.stub().returns({
        doSearch: sinon.spy()
      });
    });

  }));
  var $scope, $loading, ScrollingListService;
  beforeEach(function(){

    inject(function($injector, $rootScope, $controller){
      $scope = $rootScope.$new();

      $scope.parameters = {
        distribution: []
      };

      $loading = $injector.get("$loading");
      ScrollingListService = $injector.get('ScrollingListService');

      $controller("distributionListController", {
        $scope : $scope,
        displayService: $injector.get("displayService"),
        $loading: $loading
      });
      $scope.$digest();
    });
  });

  it("should exist",function(){
    expect($scope).to.be.ok;

    expect($scope.toggleDisplay).to.be.a("function");
    expect($scope.isSelected).to.be.a("function");
  });

  it("should init the scope objects",function(){
    expect($scope.displays).to.be.ok;

    expect($scope.search).to.be.ok;
    expect($scope.search).to.have.property("sortBy");
    expect($scope.search).to.have.property("count");
    expect($scope.search).to.have.property("reverse");

    expect($scope.parameters.distribution).to.be.an("array");
  });

  describe('$loading: ', function() {
    it('should stop spinner', function() {
      $loading.stop.should.have.been.calledWith('display-list-loader');
    });

    it('should start spinner', function(done) {
      $scope.displays.loadingItems = true;
      $scope.$digest();
      setTimeout(function() {
        $loading.start.should.have.been.calledWith('display-list-loader');

        done();
      }, 10);
    });
  });

  it("should add display to distribution",function(done){
    $scope.toggleDisplay("displayId");
    $scope.$digest();

    setTimeout(function(){
      expect($scope.parameters.distribution).to.contain("displayId");

      done();
    },10);
  });

  it("should remove display from distribution if it was there before",function(done){
    $scope.toggleDisplay("displayId");
    $scope.toggleDisplay("displayId");
    $scope.$digest();

    setTimeout(function(){
      expect($scope.parameters.distribution).to.not.contain("displayId");

      done();
    },10);
  });

  it("should return true if a display is already on the distribution",function(done){
    $scope.toggleDisplay("displayId");
    var actual = $scope.isSelected("displayId");
    $scope.$digest();

    setTimeout(function(){
      expect(actual).to.be.true;

      done();
    },10);
  });

  it("should return false if a display is not on the distribution",function(done){
    var actual = $scope.isSelected("displayId");
    $scope.$digest();

    setTimeout(function(){
      expect(actual).to.be.false;

      done();
    },10);
  });

  it("should reload list when a new display is created",function(){
    $scope.$broadcast("displayCreated", {
      id: 'displayId'
    });

    $scope.$apply();
    $scope.displays.doSearch.should.have.been.called;
    expect($scope.parameters.distribution).to.have.length(1);
  });

});
