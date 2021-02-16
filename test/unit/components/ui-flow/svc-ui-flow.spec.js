/*jshint expr:true */

describe("Services: uiFlowManager", function() {

  var world = {
    hasJobs: false,
    potBroken: false,
    raining: true,
  };

  var uiState;

  beforeEach(module("risevision.common.components.ui-flow"));

  beforeEach(module(function ($provide) {
    //stub services
    $provide.service("$q", function() {return Q;});
    $provide.factory("canEarn", ["$q", function ($q) {
      return function () {
        var deferred = $q.defer();
        if(world.hasJobs) { deferred.resolve(); }
        else { deferred.reject("canEarn"); }
        return deferred.promise;
      };
    }]);

    $provide.factory("canCook", ["$q", function ($q) {
      return function () {
        var deferred = $q.defer();
        if(world.potBroken) {deferred.reject("canCook"); }
        else { deferred.resolve(); }
        return deferred.promise;
      };
    }]);

    $provide.factory("canGoOut", ["$q", function ($q) {
      return function () {
        var deferred = $q.defer();
        if(world.raining) {deferred.reject("canGoOut"); }
        else { deferred.resolve(); }
        return deferred.promise;
      };
    }]);

    $provide.value("localStorageService", {
      get: function () {return uiState;},
      set: function (name, obj) {uiState = obj;},
      remove: function () {uiState = null;}
    });

    $provide.value("$log", {
      debug: function () {
        console.log.apply(null, arguments);
      }
    });
  }));

  beforeEach(function () {
    inject(function (uiStatusDependencies) {
      uiStatusDependencies.addDependencies({"canWakeUp": "canSleep",
      "canEarn": "canWakeUp",
      "canBuy": "canEarn",
      "canCook": "canBuy",
      "canEat" : ["canGoOut", "canCook"],
      "happy": "canEat",
      "worldPeace": "noWar"});
    });
  });

  it("should exist", function(done) {
    inject(function(uiFlowManager) {
      expect(uiFlowManager).to.be.ok;
      done();
    });
  });

  it("should get stuck at 'earn' if there are no job on the market", function (done) {
    world.hasJobs = false;
    inject(function (uiFlowManager) {
      uiFlowManager.invalidateStatus("happy").then(null, function () {
        expect(uiFlowManager.getStatus()).to.equal("canEarn");
        done();});
    });
  });

  it("should get stuck at eat if the pot is broken", function (done) {
    world.hasJobs = true; world.potBroken = true;
    inject(function (uiFlowManager) {
      uiFlowManager.invalidateStatus("happy").then(null, function () {
        expect(uiFlowManager.getStatus()).to.equal("canCook");
        done();
      });
    });
  });

  it("should allow me to be happy", function (done) {
    world.potBroken = false; world.hasJobs = true;
    inject(function (uiFlowManager) {
      uiFlowManager.invalidateStatus("happy").then(function () {
        expect(uiFlowManager.getStatus()).to.equal("happy");
        done();
      });
    });
  });

  it("should persist status", function (done) {
    world.potBroken = true; world.hasJobs = true;
    inject(function (uiFlowManager, localStorageService) {
      sinon.spy(localStorageService, "set");
      uiFlowManager.invalidateStatus("happy").then(null, function () {
        try{
          uiFlowManager.persist();
          expect(localStorageService.set).to.have.been.called;
        }
        catch (e) {
          done(e);
        }
        done();
      });
    });
  });

  it("should restore status", function (done) {
    inject(function (uiFlowManager) {
      uiFlowManager.invalidateStatus().then(null, function () {
        expect(uiFlowManager.getStatus()).to.equal("canCook");
        done();
      });
    });
  });

  it("should not restore status twice", function (done) {
    inject(function (uiFlowManager) {
      uiFlowManager.invalidateStatus().then(function (){ done(); });
    });
  });

  it("should only serve one goal at a time", function (done) {
    inject(function (uiFlowManager) {
      uiFlowManager.invalidateStatus("worldPeace");
      uiFlowManager.invalidateStatus("happy").then(function (){
        try {
          expect(uiFlowManager.getStatus()).to.equal("worldPeace");
        }
        catch (e) {
          done(e);
        }
        done(); }, done);
    });
  });

  it("should cancel validation after maximum number of allowed retries is reached", function (done) {
    world.hasJobs = true; world.potBroken = true;
    inject(function (uiFlowManager, uiStatusDependencies) {
      uiStatusDependencies.setMaximumRetryCount("canCook", 2);

      uiFlowManager.invalidateStatus("happy").then(null, function () {
        expect(uiFlowManager.getStatus()).to.equal("canCook");
        uiFlowManager.invalidateStatus().then(null, function () {
          expect(uiFlowManager.getStatus()).to.equal("canCook");
          uiFlowManager.invalidateStatus().then(null, function () {
            expect(uiFlowManager.getStatus()).to.not.be.ok;
            done();
          });
        });
      });
    });
  });

});
