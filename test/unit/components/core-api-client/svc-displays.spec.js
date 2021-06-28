describe("Services: Display Core API Service", function() {
  beforeEach(module("risevision.core.display"));
  beforeEach(module(function ($provide) {
    //stub services
    $provide.service("$q", function() {return Q;});

    $provide.value("coreAPILoader", function() {
        var deffered = Q.defer();
        var gapi = {
          display: {
            list: function () {
              return {
                execute: function (callback) {
                  setTimeout(function () {
                    callback(window.rvFixtures.displays);
                  }, 0);
                }
              };
            }
          }
        };
        deffered.resolve(gapi);
        return deffered.promise;
    });
  }));


  var displayService;
  beforeEach(function(){
    inject(function($injector){
      displayService = $injector.get("displayService");
    });
  });

  it("should exist",function(){
    expect(displayService).to.be.truely;
    expect(displayService.list).to.be.a.function;
  });

  describe("list",function(){
    it("should query the company's list of displays",function(done){
      displayService.list()
      .then(function(result){
        expect(result).to.be.truely;
        expect(result).to.be.an.array;
        done();
      })
      .then(null,done);
    });
  });
});
