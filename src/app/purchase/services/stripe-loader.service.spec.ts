import {expect} from 'chai';
import { TestBed } from '@angular/core/testing';

import { StripeLoaderService } from './stripe-loader.service';
import { assert } from 'sinon';
import { UserState } from 'src/app/ajs-upgraded-providers';

describe('StripeLoaderService', () => {
  let stripeLoader: StripeLoaderService;
  let clock: any;
  let userState: UserState

  beforeEach(() => {
    userState = {
      getCopyOfUserCompany: sinon.stub().returns({
        isTest: false
      })
    };
    TestBed.configureTestingModule({
      providers: [
        {provide: UserState, useValue: userState},
      ]
    });
    stripeLoader = TestBed.inject(StripeLoaderService);

    clock = sinon.useFakeTimers();
  });


  afterEach(function () {
    clock.restore();
  });


  it("should exist", function() {
    expect(stripeLoader).to.be.ok;
    expect(stripeLoader.load).to.be.a("function");
  });
  
  it("should return a promise", function() {
    expect(stripeLoader.load().then).to.be.a("function");
  });

  it("should not resolve if Stripe object is not present", function(done) {
    stripeLoader.load()
    .then(function() {
      assert.fail("failed");
    });

    clock.tick(100);

    done();
  });

  it("should resolve once stripe object is found", function(done) {
    window.Stripe = function() {return 1;};

    stripeLoader.load()
    .then(function(result) {
      expect(result).to.be.ok;

      done();
    })
    .then(null,done);

    clock.tick(100);
  });

  it("should initialize with the key", function(done) {
    window.Stripe = sinon.spy();

    stripeLoader.load()
    .then(function() {
      window.Stripe.should.have.been.calledWith('pk_test_GrMIAHSoqhaik4tcHepsxjOR');

      done();
    })
    .then(null,done);

    clock.tick(100);
  });

});
