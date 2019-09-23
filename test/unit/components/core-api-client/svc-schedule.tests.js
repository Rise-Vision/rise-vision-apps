describe("Services: Schedules Core API Service", function() {
  beforeEach(module("risevision.core.schedule"));
  beforeEach(module(function ($provide) {
    //stub services
    $provide.service("$q", function() {return Q;});

    $provide.value("coreAPILoader", function() {
        var deffered = Q.defer();
        var gapi = {
          schedule: {
            list: function () {
              return {
                execute: function (callback) {
                  setTimeout(function () {
                    callback(window.rvFixtures.schedules);
                  }, 0);
                }
              };
            }
          }
        };
        deffered.resolve(gapi);
        return deffered.promise;
    });
    $provide.value("CORE_URL", "");
  }));


  var scheduleService;
  beforeEach(function(){
    inject(function($injector){
      scheduleService = $injector.get("scheduleService");
    });
  });

  it("should exist",function(){
    expect(scheduleService).to.be.truely;
    expect(scheduleService.list).to.be.a.function;
  });

  describe("list",function(){
    it("should query the company's list of schedules",function(done){
      scheduleService.list()
      .then(function(result){
        expect(result).to.be.truely;
        expect(result).to.be.an.array;
        done();
      })
      .then(null,done);
    });
  });
});
