/**
 * Created by rodrigopavezi on 10/20/14.
 */
"use strict";
describe("callEndpoint: ", function () {

  beforeEach(module("risevision.common.core.endpoint"));

  beforeEach(module(function ($provide) {
    //stub services
    $provide.service("$q", function () {
      return Q;
    });

    $provide.value("coreAPILoader", function () {
      var deffered = Q.defer();
      var gapi = {
        company: {
          list: function () {
            return {
              execute: function (callback) {
                setTimeout(function () {
                  callback(window.rvFixtures.companiesResp);
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
  var callEndpoint;
  beforeEach(function () {
    inject(function ($injector) {
      callEndpoint = $injector.get("callEndpoint");
    });
  });

  it("should exist", function () {
    expect(callEndpoint).to.be.ok;
  });

  it("Should get company", function (done) {
    var method = "core.company.list";
    var criteria = {
      id: ""
    };
    callEndpoint(method, criteria).then(function (result) {
      expect(result).to.deep.equal(rvFixtures.companiesResp);
      done();
    }).then(null, done);
  });
});
