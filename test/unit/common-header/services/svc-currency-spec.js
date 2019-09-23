/*jshint expr:true */

describe("Services: Currency", function() {

  beforeEach(module("risevision.common.currency"));

  it("should exist", function() {
    inject(function(currencyService) {
      expect(currencyService).to.be.ok;
    });
  });

  beforeEach(module(function ($provide) {
    //stub services
    $provide.service("$q", function() {return Q;});
    //$provide.service("$log", function() {return Q;});

    $provide.value("storeAPILoader", function () {
       var deffered = Q.defer();
       var mockResponse =
        {
         "result": false,
         "code": -1,
         "items": [
          {
           "currencyCode": "usd",
           "description": "United States Dollar",
           "bankAccountCode": "1005",
           "bankAccountDescription": "Bank Of America"
          },
          {
           "country": "US",
           "currencyCode": "usd",
           "description": "United States Dollar",
           "bankAccountCode": "1005",
           "bankAccountDescription": "Bank Of America"
          },
          {
           "country": "CA",
           "currencyCode": "cad",
           "description": "Canada Dollar",
           "bankAccountCode": "1011",
           "bankAccountDescription": "RBC"
          }
         ]
        };      
       var executeMethod = function(func) {
        func(mockResponse);
       };
       var listMethod = function() {
        return {"execute" : executeMethod};
       };
       var StoreAPI = {"currency":{"list": listMethod}};
       deffered.resolve(StoreAPI);
      return deffered.promise;
    });
  }));

  it("should select correct currency", function (done){
    inject(function(currencyService) {
      currencyService().then(function(currency) {

        expect(currency.items.length).to.equal(3);

        var currencyItem = currency.getByCountry("");
        expect(currencyItem.getName()).to.equal("USD");
        expect(currencyItem.pickPrice(1, 2)).to.equal(1);

        currencyItem = currency.getByCountry("CA");
        expect(currencyItem.getName()).to.equal("CAD");
        expect(currencyItem.pickPrice(1, 2)).to.equal(2);

        done();
      });
    });
  });

});
