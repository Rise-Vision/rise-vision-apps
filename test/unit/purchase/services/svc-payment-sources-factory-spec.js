/*jshint expr:true */
"use strict";

describe("Services: payment sources factory", function() {
  beforeEach(module("risevision.apps.purchase"));
  beforeEach(module(function ($provide) {
    $provide.service("$q", function() {return Q;});

    $provide.service('processErrorCode',function() {
      return function(err) {
        return 'processed ' + err;
      };
    });

    $provide.value('billing', {
      getCreditCards: sinon.stub().returns(Q.resolve({
        items: []
      }))
    });

    $provide.service('analyticsFactory',function() {
      return {
        track: sinon.stub()
      };
    });
  }));

  var paymentSourcesFactory, billing;

  beforeEach(function() {
    inject(function($injector) {
      billing = $injector.get('billing');
      paymentSourcesFactory = $injector.get("paymentSourcesFactory");
    });
  });

  it("should exist", function() {
    expect(paymentSourcesFactory).to.be.ok;

    expect(paymentSourcesFactory.init).to.be.a("function");
  });

  describe("init:", function() {
    it("should init factory object", function() {
      paymentSourcesFactory.existingCreditCards = 'existingCreditCards';
      paymentSourcesFactory.selectedCard = 'selectedCard'

      paymentSourcesFactory.init();
      
      expect(paymentSourcesFactory).to.be.ok;
      expect(paymentSourcesFactory.existingCreditCards).to.deep.equal([]);

      expect(paymentSourcesFactory.selectedCard).to.not.be.ok;
    });

    describe('_loadCreditCards:', function() {
      it('should retrieve cards and update list if successful', function(done) {
        paymentSourcesFactory.init()
          .then(function() {
            billing.getCreditCards.should.have.been.calledWith({
              count: 40
            });

            expect(paymentSourcesFactory.existingCreditCards).to.be.an('array');

            done();
          });
      });

      it('should set selected card to the first item if available', function(done) {
        billing.getCreditCards.returns(Q.resolve({items: ['card1']}))

        paymentSourcesFactory.init()
          .then(function() {
            expect(paymentSourcesFactory.selectedCard).to.equal('card1');

            done();
          });
      });

    });

  });


});
