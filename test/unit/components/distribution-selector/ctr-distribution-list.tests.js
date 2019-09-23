"use strict";
describe("controller: Distribution List", function() {
  beforeEach(module("risevision.common.components.distribution-selector"));
  beforeEach(module("risevision.common.components.distribution-selector.services"));
  beforeEach(module(function ($provide) {
    $provide.service("displayService",function(){
      return {
        list : function(){
          apiCount++;
          var deferred = Q.defer();
          if(returnPresentations){
            deferred.resolve(result);
          }else{
            deferred.reject("ERROR; could not retrieve list");
          }
          return deferred.promise;
        }
      };
    });
    $provide.service("$loading",function(){
      return {
        start : function(){
          return;
        },
        stop : function(){
          return;
        }
      };
    });
  }));
  var $scope, $broadcastSpy, returnPresentations, apiCount, result, $loading,$loadingStartSpy, $loadingStopSpy, rootScope;
  beforeEach(function(){

    result = {
      items: [],
      cursor: "asdf"
    };
    for (var i = 1; i <= 40; i++) {
      result.items.push(i);
    }
    apiCount = 0;
    returnPresentations = true;


    inject(function($injector,$rootScope, $controller){
      rootScope = $rootScope;
      $scope = $rootScope.$new();

      $scope.parameters = {};
      $scope.parameters.distribution = [];

      $broadcastSpy = sinon.spy($rootScope, "$broadcast");
      $loading = $injector.get("$loading");
      $loadingStartSpy = sinon.spy($loading, "start");
      $loadingStopSpy = sinon.spy($loading, "stop");
      $controller("distributionListController", {
        $scope : $scope,
        $rootScope: $rootScope,
        displayService: $injector.get("displayService"),

        $loading: $loading
      });
      $scope.$digest();
    });
  });

  beforeEach(function(done) {
    setTimeout(function(){
      expect($scope.loadingDisplays).to.be.false;
      expect(apiCount).to.equal(1);
      expect($scope.error).to.not.be.ok;

      done();
    },10);
  });


  it("should exist",function(){
    expect($scope).to.be.truely;

    expect($scope.toggleDisplay).to.be.a("function");
    expect($scope.isSelected).to.be.a("function");

    expect($scope.sortBy).to.be.a("function");
    expect($scope.doSearch).to.be.a("function");
    expect($scope.load).to.be.a("function");
  });

  it("should init the scope objects",function(){
    expect($scope.displays).to.be.truely;
    expect($scope.displays).to.have.property("list");
    expect($scope.displays).to.have.property("add");
    expect($scope.displays).to.have.property("clear");
    expect($scope.displays).to.have.property("endOfList");

    expect($scope.search).to.be.truely;
    expect($scope.search).to.have.property("sortBy");
    expect($scope.search).to.have.property("count");
    expect($scope.search).to.have.property("reverse");

    expect($scope.parameters.distribution).to.be.an("array");
  });


  it("should load the list",function(){
    expect($scope.loadingDisplays).to.be.false;
    expect($scope.displays).to.be.truely;
    expect($scope.displays.list).to.have.length(40);
    expect($scope.displays.cursor).to.be.truely;
    expect($scope.displays.endOfList).to.be.false;

  });


  describe("list functions: ",function(){
    returnPresentations = true;

    describe("load: ",function(){
      it("should re-load if there are more items",function(done){
        result = {
          items: [21]
        };
        $scope.load();
        $scope.$digest();

        expect($scope.loadingDisplays).to.be.true;
        $loadingStartSpy.should.have.been.calledWith("display-list-loader");
        setTimeout(function(){
          expect($scope.loadingDisplays).to.be.false;
          expect($scope.error).to.not.be.ok;
          expect(apiCount).to.equal(2);

          expect($scope.displays.list).to.have.length(41);
          expect($scope.displays.cursor).to.not.be.truely;
          expect($scope.displays.endOfList).to.be.true;
          $scope.$digest();
          $loadingStopSpy.should.have.been.calledWith("display-list-loader");
          done();
        },10);
      });

      it("should not re-load if there are no more items",function(done){
        result = {
          items: [41]
        };
        $scope.load();
        $scope.$digest();

        expect($scope.loadingDisplays).to.be.true;
        setTimeout(function(){
          $scope.load();

          expect($scope.loadingDisplays).to.be.false;

          done();
        },10);
      });
    });

    describe("sortBy: ",function(){
      it("should reset list and reverse sort by changeDate",function(done){
        $scope.sortBy("name");
        $scope.$digest();

        expect($scope.loadingDisplays).to.be.true;
        setTimeout(function(){
          expect($scope.loadingDisplays).to.be.false;
          expect($scope.error).to.not.be.ok;
          expect(apiCount).to.equal(2);

          expect($scope.displays.list).to.have.length(40);

          expect($scope.search.sortBy).to.equal("name");
          expect($scope.search.reverse).to.be.true;

          done();
        },10);

      });

      it("should reset list and sort by name",function(done){
        $scope.sortBy("name");
        $scope.$digest();

        expect($scope.loadingDisplays).to.be.true;
        setTimeout(function(){
          expect($scope.loadingDisplays).to.be.false;
          expect($scope.error).to.not.be.ok;
          expect(apiCount).to.equal(2);

          expect($scope.displays.list).to.have.length(40);

          expect($scope.search.sortBy).to.equal("name");
          expect($scope.search.reverse).to.be.true;

          done();
        },10);
      });
    });

    it("should reset list and doSearch",function(done){
      $scope.doSearch();
      $scope.$digest();

      expect($scope.loadingDisplays).to.be.true;
      setTimeout(function(){
        expect($scope.loadingDisplays).to.be.false;
        expect($scope.error).to.not.be.ok;
        expect(apiCount).to.equal(2);

        expect($scope.displays.list).to.have.length(40);

        expect($scope.search.sortBy).to.equal("name");
        expect($scope.search.reverse).to.be.false;

        done();
      },10);
    });

    it("should set error if list fails to load",function(done){
      returnPresentations = false;
      $scope.doSearch();
      $scope.$digest();

      expect($scope.loadingDisplays).to.be.true;
      setTimeout(function(){
        expect($scope.loadingDisplays).to.be.false;
        expect($scope.error).to.be.ok;
        expect(apiCount).to.equal(2);
        expect($scope.displays.list).to.have.length(0);

        done();
      },10);
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

    it("should broadcast event on addDisplay()",function(){
      $scope.addDisplay();

      $broadcastSpy.should.have.been.calledWith("distributionSelector.addDisplay");
    });

    it("should reload list when a new display is created",function(){
      var spy = sinon.spy($scope,"load");

      rootScope.$broadcast("displayCreated");

      $scope.$apply();
      spy.should.have.been.called;
    });

  });

});
