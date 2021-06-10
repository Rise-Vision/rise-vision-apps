import {expect} from 'chai';
import { TestBed } from '@angular/core/testing';

import { StripeService } from './stripe.service';
import { StripeLoaderService } from './stripe-loader.service';

describe('StripeService', () => {
  let stripeService: StripeService;
  let stripeLoader: any;
  let elements: any;
  let stripeClient: any;  
  
  beforeEach(() => {
    stripeLoader = {
      load: function() {
        elements = {
          create: sinon.stub().returns('result')
        };
        return Promise.resolve(stripeClient = {
          createPaymentMethod: sinon.stub().returns(Promise.resolve()),
          handleCardAction: sinon.stub().returns(Promise.resolve()),
          confirmCardSetup: sinon.stub().returns(Promise.resolve()),
          elements: sinon.stub().returns(elements)
        });
      }
    }

    TestBed.configureTestingModule({
      providers: [
        {provide: StripeLoaderService, useValue: stripeLoader}        
      ]
    });
    stripeService = TestBed.inject(StripeService);
  });

  it("should exist", function() {
    expect(stripeService).to.be.ok;
    expect(stripeService.createPaymentMethod).to.be.a('function');
    expect(stripeService.handleCardAction).to.be.a('function');
    expect(stripeService.confirmCardSetup).to.be.a('function');
    expect(stripeService.initializeStripeElements).to.be.a('function');
  });

  it('createPaymentMethod', function(done) {
    stripeService.createPaymentMethod('type', 'element', 'details')
      .then(function() {
        stripeClient.createPaymentMethod.should.have.been.calledWith('type', 'element', 'details');

        done();
      });
  });

  it('handleCardAction', function(done) {
    stripeService.handleCardAction('secret')
      .then(function() {
        stripeClient.handleCardAction.should.have.been.calledWith('secret');

        done();
      });
  });

  it('confirmCardSetup', function(done) {
    stripeService.confirmCardSetup('secret')
      .then(function() {
        stripeClient.confirmCardSetup.should.have.been.calledWith('secret');

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
