/*jshint expr:true */
"use strict";

describe("Services: stripe service", function() {
  beforeEach(module("risevision.apps.purchase"));
  beforeEach(module(function ($provide) {
    $provide.service("$q", function() {return Q;});
    $provide.service("stripeLoader", function() {
      var elements = {
        create: sinon.spy()
      };

      return function() {
        return Q.resolve(stripeClient = {
          card: {
            createToken: sinon.spy(function(obj, callback) {
              callback("status", createTokenResponse);
            })
          },
          elements: function() {
            return elements;
          }
        });
      };
    });
  }));

  var $window, cardObject, stripeService, stripeClient;
  var createTokenResponse;

  beforeEach(function() {
    cardObject = {
      number: "number",
      cvc: "cvc",
      expMonth: "month",
      expYear: "year"
    };

    inject(function($injector) {
      $window = $injector.get("$window");
      stripeService = $injector.get("stripeService");
    });
  });

  it("should exist", function() {
    expect(stripeService).to.be.ok;
  });
});
