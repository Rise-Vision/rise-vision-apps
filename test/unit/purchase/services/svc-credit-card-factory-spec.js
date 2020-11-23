/*jshint expr:true */
"use strict";

describe("Services: credit card factory", function() {
  beforeEach(module("risevision.apps.purchase"));
  beforeEach(module(function ($provide) {
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

  var $rootScope, creditCardFactory, stripeService;

  beforeEach(function() {
    inject(function($injector) {
      $rootScope = $injector.get('$rootScope');
      stripeService = $injector.get("stripeService");
      creditCardFactory = $injector.get("creditCardFactory");
    });
  });

  it("should exist", function() {
    expect(creditCardFactory).to.be.ok;
    expect(creditCardFactory.initElements).to.be.a("function");
  });

  describe("initElements: ", function() {
    beforeEach(function(done) {
      creditCardFactory.initElements();
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
      expect(creditCardFactory.stripeElements['cardNumber']).to.be.an('object');
      expect(creditCardFactory.stripeElements['cardExpiry']).to.be.an('object');
      expect(creditCardFactory.stripeElements['cardCvc']).to.be.an('object');
    });

    it('should initialize handlers', function() {
      creditCardFactory.stripeElements['cardNumber'].mount.should.have.been.calledWith('#new-card-number');

      creditCardFactory.stripeElements['cardNumber'].on.should.have.been.calledTwice;
      creditCardFactory.stripeElements['cardNumber'].on.should.have.been.calledWith('blur', sinon.match.func);
      creditCardFactory.stripeElements['cardNumber'].on.should.have.been.calledWith('change', sinon.match.func);
    });

    it('should $digest on blur', function() {
      sinon.spy($rootScope, '$digest');

      creditCardFactory.stripeElements['cardNumber'].on.getCall(0).args[1]();

      $rootScope.$digest.should.have.been.called;
    });

    it('should add dirty class and $digest on change', function() {
      var cardElement = angular.element('<div id="new-card-number"/>').appendTo('body');

      sinon.spy($rootScope, '$digest');

      creditCardFactory.stripeElements['cardNumber'].on.getCall(1).args[1]();

      expect(cardElement[0].className).to.contain('dirty');
      $rootScope.$digest.should.have.been.called;

      cardElement.remove();
    });

    it('should handle failure to get element', function() {
      sinon.spy($rootScope, '$digest');

      creditCardFactory.stripeElements['cardNumber'].on.getCall(1).args[1]();

      $rootScope.$digest.should.have.been.called;
    });

  });

});
