"use strict";
describe("service: display:", function() {
  beforeEach(module("risevision.common.components.distribution-selector.services"));
  beforeEach(module(function ($provide) {
    $provide.service("$q", function() {return Q;});
    $provide.service("userState",function(){
      return {
        getSelectedCompanyId : function(){
          return "TEST_COMP_ID";
        }
      };
    });

    $provide.service("coreAPILoader",function () {
      return function(){
        var deferred = Q.defer();

        deferred.resolve({
          display: {
            list: function(obj){
              expect(obj).to.be.ok;

              var def = Q.defer();
              if (returnList) {
                def.resolve({
                  result: {
                    nextPageToken: 1,
                    items: [
                      {
                        id: "id1",
                        name: "display1",
                        address: "1 display 1 street"
                      },
                      {
                        id: "id2",
                        name: "display2",
                        address: "2 display 2 street"
                      },
                      {
                        id: "id3",
                        name: "display3",
                        address: "3 display 3 street"
                      }
                    ]
                  }
                });
              } else {
                def.reject("API Failed");
              }
              return def.promise;
            }
          }
        });
        return deferred.promise;
      };
    });

  }));
  var displayService, returnList;
  beforeEach(function(){
    returnList = true;

    inject(function($injector){
      displayService = $injector.get("displayService");
    });
  });

  it("should exist",function(){
    expect(displayService).to.be.truely;
    expect(displayService.list).to.be.a("function");
  });

  describe("list:",function(){
    it("should return a list of displays",function(done){
      displayService.list({})
        .then(function(result){
          expect(result).to.be.truely;
          expect(result.items).to.be.an.array;
          expect(result.items).to.have.length(3);
          done();
        })
        .then(null,done);
    });

    it("should handle failure to get list correctly",function(done){
      returnList = false;

      displayService.list({})
        .then(function(displays) {
          done(displays);
        })
        .then(null, function(error) {
          expect(error).to.deep.equal("API Failed");
          done();
        })
        .then(null,done);
    });
  });

});
