/*jshint expr:true */
"use strict";

describe("Services: stripe elements factory", function() {
  beforeEach(module("risevision.apps.purchase"));
  beforeEach(module(function ($provide) {
    $provide.service("$q", function() {return Q;});

    var _generateElement = function(id) {
      return {
        id: id,
        mount: sinon.stub(),
        on: sinon.stub()
      };
    };

    $provide.value("stripeService", {
      initializeStripeElements: sinon.stub().returns(Q.resolve([_generateElement(1), _generateElement(2), _generateElement(3)]))
    });

  }));

  var $rootScope, stripeElementsFactory, stripeService;

  beforeEach(function() {
    inject(function($injector) {
      $rootScope = $injector.get('$rootScope');
      stripeService = $injector.get("stripeService");
      stripeElementsFactory = $injector.get("stripeElementsFactory");
    });
  });

  it("should exist", function() {
    expect(stripeElementsFactory).to.be.ok;

    expect(stripeElementsFactory.init).to.be.a("function");
  });

  describe("init: ", function() {
    beforeEach(function(done) {
      stripeElementsFactory.init();
      setTimeout(function() {
        done();
      }, 10);
    });

    it('should initialize', function() {
      stripeService.initializeStripeElements.should.have.been.calledWith([
        'cardNumber',
        'cardExpiry',
        'cardCvc'
      ], sinon.match.object);
    });

    it('should initialize elements and add them to the scope', function() {
      expect(stripeElementsFactory.stripeElements['cardNumber']).to.be.an('object');
      expect(stripeElementsFactory.stripeElements['cardExpiry']).to.be.an('object');
      expect(stripeElementsFactory.stripeElements['cardCvc']).to.be.an('object');
    });

    it('should initialize handlers', function() {
      stripeElementsFactory.stripeElements['cardNumber'].mount.should.have.been.calledWith('#new-card-number');

      stripeElementsFactory.stripeElements['cardNumber'].on.should.have.been.calledTwice;
      stripeElementsFactory.stripeElements['cardNumber'].on.should.have.been.calledWith('blur', sinon.match.func);
      stripeElementsFactory.stripeElements['cardNumber'].on.should.have.been.calledWith('change', sinon.match.func);
    });

    it('should $digest on blur', function() {
      sinon.spy($rootScope, '$digest');

      stripeElementsFactory.stripeElements['cardNumber'].on.getCall(0).args[1]();

      $rootScope.$digest.should.have.been.called;
    });

    it('should add dirty class and $digest on change', function() {
      var cardElement = angular.element('<div id="new-card-number"/>').appendTo('body');

      sinon.spy($rootScope, '$digest');

      stripeElementsFactory.stripeElements['cardNumber'].on.getCall(1).args[1]();

      expect(cardElement[0].className).to.contain('dirty');
      $rootScope.$digest.should.have.been.called;

      cardElement.remove();
    });

    it('should handle failure to get element', function() {
      sinon.spy($rootScope, '$digest');

      stripeElementsFactory.stripeElements['cardNumber'].on.getCall(1).args[1]();

      $rootScope.$digest.should.have.been.called;
    });
  });

});
