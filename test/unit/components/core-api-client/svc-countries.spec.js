describe("Services: Countries Core API Service", function() {
  beforeEach(module("risevision.core.countries"));
  beforeEach(module(function ($provide) {
    //stub services
    $provide.service("$q", function() {return Q;});

    $provide.value("coreAPILoader", function() {
        var deferred = Q.defer();
        var gapi = {
          country: {
            list: function () {
              var def = Q.defer();
              
              setTimeout(function () {
                def.resolve({
                  result: {
                    items: [
                      {
                       "code": "US",
                       "name": "United States",
                       "kind": "core#countryItem"
                      },
                      {
                       "code": "EG",
                       "name": "Egypt",
                       "kind": "core#countryItem"
                      },
                      {
                       "code": "GB",
                       "name": "United Kingdom",
                       "kind": "core#countryItem"
                      },
                      {
                       "code": "FR",
                       "name": "France",
                       "kind": "core#countryItem"
                      },
                      {
                       "code": "GR",
                       "name": "Greece",
                       "kind": "core#countryItem"
                      },
                      {
                       "code": "RO",
                       "name": "Romania",
                       "kind": "core#countryItem"
                      },
                      {
                       "code": "AT",
                       "name": "Austria",
                       "kind": "core#countryItem"
                      },
                      {
                       "code": "PT",
                       "name": "Portugal",
                       "kind": "core#countryItem"
                      },
                      {
                       "code": "BR",
                       "name": "Brazil",
                       "kind": "core#countryItem"
                      },
                      {
                       "code": "CA",
                       "name": "Canada",
                       "kind": "core#countryItem"
                      },
                      {
                       "code": "TR",
                       "name": "Turkey",
                       "kind": "core#countryItem"
                      }
                    ]
                  }
                });
              }, 0);
              
              return def.promise;
            }
          }
        };
        deferred.resolve(gapi);
        return deferred.promise;
    });
  }));


  var getCoreCountries, COUNTRIES;
  beforeEach(function(){
    inject(function($injector){
      getCoreCountries = $injector.get("getCoreCountries");
      COUNTRIES = $injector.get("COUNTRIES");
    });
  });

  it("should exist",function(){
    expect(getCoreCountries).to.be.truely;
    expect(getCoreCountries).to.be.a.function;
    expect(COUNTRIES).to.be.truely;
    expect(COUNTRIES).to.be.a.function;
  });
  
  describe("getCoreCountries",function(){
    it("should return a promise w/ the countries list",function(done){
      getCoreCountries()
      .then(function(result){
        expect(result).to.be.truely;
        expect(result).to.be.an.array;
        done();
      })
      .then(null,done);
    });
    
    it("should order by name",function(done){
      getCoreCountries()
      .then(function(result){
        expect(result[0].name).to.equal("Austria");
        expect(result[result.length - 1].name).to.equal("United States");
        done();
      })
      .then(null,done);
    });
  });

  describe("COUNTRIES",function(){
    it("should return the list of countries",function(done){
      var result = COUNTRIES;

      setTimeout(function() {
        expect(result).to.be.truely;
        expect(result).to.be.an.array;
        done();
      }, 10);
    });
  });
});
