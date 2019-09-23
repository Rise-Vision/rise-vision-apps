/* jshint expr:true */
/* jshint maxlen:false */

"use strict";

describe("Services: Company Core API Service", function() {

  beforeEach(module("risevision.core.company"));
  beforeEach(module(function ($provide) {
    //stub services
    $provide.service("$q", function() {return Q;});
    
    $provide.service("coreAPILoader",function () {
      return function(){
        var deferred = Q.defer();
                
        deferred.resolve({
          subcompanies: {
            list: function () {
              return {
                execute: function (callback) {
                  setTimeout(function () {
                    callback(window.rvFixtures.companiesResp);
                  }, 0);
                }
              };
            }
          },
          company: {
            list: function(obj) {              
              return {
                execute: function (callback) {
                  setTimeout(function () {
                    expect(obj).to.be.truely;
                    expect(obj.companyId).to.equal("some_id");
                    expect(obj.search).to.equal("name:~\"s\" OR id:~\"s\" OR street:~\"s\" OR unit:~\"s\" OR city:~\"s\" OR province:~\"s\" OR country:~\"s\" OR postalCode:~\"s\" OR telephone:~\"s\" OR fax:~\"s\" OR shipToName:~\"s\" OR shipToStreet:~\"s\" OR shipToCity:~\"s\" OR shipToPostalCode:~\"s\"");

                    callback(window.rvFixtures.companiesResp);
                  }, 0);
                }
              };
            },
            patch: function(obj) {
              expect(obj).to.be.ok;
              expect(obj.id).to.equal("companyId");
              expect(obj.data).to.be.ok;
              
              var def = Q.defer();
              if (obj.data.alertSettings) {
                expect(obj.data).to.have.property("alertSettings");
                
                def.resolve({
                  result: {
                    item: obj.data
                  }
                });
              } else {
                def.reject("API Failed");
              }
              return def.promise;
            },
            updateAddress: function () {
              return {
                execute: function (callback) {
                  setTimeout(function () {
                    callback(window.rvFixtures.companiesResp.items[0]);
                  }, 0);
                }
              };
            },
            enableProduct: function (obj) {
              return {
                execute: function(callback) {
                  if (obj.id) {
                    expect(obj.id).to.be.ok;
                    expect(obj.productCode).to.be.ok;
                    expect(obj.data).to.be.ok;
                    callback({ result: "Ok" });
                  }
                  else {
                    callback({});
                  }
                }
              };
            }
          }
        });
        return deferred.promise;
      };
    });

    $provide.value("CORE_URL", "");
  }));
  
  // New service format:
  describe("company service: ", function() {
    var company;
    
    beforeEach(function() {
      inject(function($injector){
        company = $injector.get("company");
      });      
    });

    it("should exist", function() {
      expect(company).be.defined;
      expect(company.updateAlerts).be.defined;
    });

    describe("updateAlerts:",function(){
      var alertSettings;
      
      beforeEach(function() {
        alertSettings = {
          id: "companyId",
          alertSettings: {
            enabled: true
          }
        };
        
      });
      
      it("should update alerts",function(done){
        company.updateAlerts(alertSettings.id, alertSettings)
        .then(function(result){
          expect(result).to.be.ok;
          expect(result.item).to.be.ok;
          expect(result.item).to.have.property("alertSettings");
          
          done();
        })
        .then(null,done);
      });
      
      it("should remove extra properties",function(done){
        company.updateAlerts(alertSettings.id, alertSettings)
        .then(function(result){
          expect(result).to.be.ok;
          expect(result.item).to.be.ok;
          expect(result.item).to.not.have.property("id");
          
          done();
        })
        .then(null,done);
      });
      
      it("should handle failure to update alerts",function(done){
        company.updateAlerts(alertSettings.id, {})
        .then(function(result) {
          done(result);
        })
        .then(null, function(error) {
          expect(error).to.deep.equal("API Failed");
          done();
        })
        .then(null,done);
      });
    });
  });

  
  
  // Old services:
  var companyService, enableCompanyProduct;
  
  beforeEach(function() {
    inject(function($injector){
      companyService = $injector.get("companyService");
      enableCompanyProduct = $injector.get("enableCompanyProduct");
    });
  });

  it("should exist", function() {
    expect(companyService).be.defined;
  });

  describe("getCompanies", function() {
    it("should get companies", function (done) {
      companyService.getCompanies({companyId: "some_id", query: "s"}).then(function (result) {
        expect(result).to.deep.equal(rvFixtures.companiesResp);
        done();
      });
    });

    it("should get companies regardless of additional Array fields", function (done) {
      Array.prototype.contains = function(){};
      companyService.getCompanies({companyId: "some_id", query: "s"}).then(function (result) {
        expect(result).to.deep.equal(rvFixtures.companiesResp);
        done();
      });
    });
  });

  xdescribe("getSubCompanies", function () {
    it("should load subcompanies", function (done) {
      companyService.getSubCompanies(2, "", "", 20, null).then(function (result) {
        expect(result).to.deep.equal(rvFixtures.companiesResp);
        done();
      }, function (err) {throw err; });
    });
  });

  describe("getCompany", function() {
    xit("should get company", function () {
      throw "Write this";
    });
  });

  describe("deleteCompany", function() {
    xit("should delete company", function () {
      throw "Write this";
    });
  });

  xdescribe("updateAddress", function() {
    it("should update address", function (done) {
      companyService.updateAddress(rvFixtures.companiesResp.items[0], false).then(function (result) {
        expect(result).to.deep.equal(rvFixtures.companiesResp.items[0]);
        done();
      }, function (err) {throw err; });
    });
  });

  describe("enableCompanyProduct", function() {
    it("should enable a product", function (done) {
      enableCompanyProduct("companyId", "productCode", { "displayId": true })
      .then(function () {
        done();
      });
    });

    it("should fail to enable a product", function (done) {
      enableCompanyProduct()
      .catch(function () {
        done();
      });
    });
  });

});
