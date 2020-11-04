/*jshint expr:true */
"use strict";

describe("Services: stripe service", function() {
  beforeEach(module("risevision.apps.purchase"));
  beforeEach(module(function ($provide) {
    $provide.service("$q", function() {return Q;});
    $provide.service("stripeLoader", function() {
      elements = {
        create: sinon.stub().returns('result')
      };

      return function() {
        return Q.resolve(stripeClient = {
          createPaymentMethod: sinon.stub().returns(Q.resolve()),
          handleCardAction: sinon.stub().returns(Q.resolve()),
          elements: sinon.stub().returns(elements)
        });
      };
    });
  }));

  var $window, stripeService, stripeClient, elements;
  var createTokenResponse;

  beforeEach(function() {
    inject(function($injector) {
      $window = $injector.get("$window");
      stripeService = $injector.get("stripeService");
    });
  });

  it("should exist", function() {
    expect(stripeService).to.be.ok;
    expect(stripeService.createPaymentMethod).to.be.a('function');
    expect(stripeService.authenticate3ds).to.be.a('function');
    expect(stripeService.initializeStripeElements).to.be.a('function');
  });

  it('createPaymentMethod', function(done) {
    stripeService.createPaymentMethod('type', 'element', 'details')
      .then(function() {
        stripeClient.createPaymentMethod.should.have.been.calledWith('type', 'element', 'details');

        done();
      });
  });

  it('authenticate3ds', function(done) {
    stripeService.authenticate3ds('secret')
      .then(function() {
        stripeClient.handleCardAction.should.have.been.calledWith('secret');

        done();
      });
  });

  it('initializeStripeElements', function(done) {
    stripeService.initializeStripeElements(['el1', 'el2'], 'options')
      .then(function(result) {
        stripeClient.elements.should.have.been.called;
        elements.create.should.have.been.calledTwice;
        elements.create.should.have.been.calledWith('el1', 'options');
        elements.create.should.have.been.calledWith('el2', 'options');

        expect(result).to.deep.equal(['result', 'result']);

        done();
      });
  });

});
