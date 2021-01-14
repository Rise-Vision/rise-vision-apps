'use strict';

describe('filter: subscriptionDescription', function() {
  beforeEach(module('risevision.apps.billing.filters'));

  var subscriptionDescription;

  beforeEach(function() {
    inject(function($filter) {
      subscriptionDescription = $filter('subscriptionDescription');      
    });
  });

  it('should exist',function(){
    expect(subscriptionDescription).to.be.ok;
  });

  it('should return blank if no subscription is passed', function () {
    expect(subscriptionDescription()).to.equal('');
  });

  it('should format legacy subscription names', function () {
    expect(subscriptionDescription({
      plan_id: 'b1844725d63fde197f5125b58b6cba6260ee7a57-m',
      plan_quantity: 1,
      billing_period: 1,
      billing_period_unit: 'month'
    })).to.equal('Enterprise Plan Monthly');

    expect(subscriptionDescription({
      plan_id: 'b1844725d63fde197f5125b58b6cba6260ee7a57-m',
      plan_quantity: 3,
      billing_period: 1,
      billing_period_unit: 'month'
    })).to.equal('3 x Enterprise Plan Monthly');

    expect(subscriptionDescription({
      plan_id: '93b5595f0d7e4c04a3baba1102ffaecb17607bf4-m',
      plan_quantity: 1,
      billing_period: 0,
      billing_period_unit: 'year'
    })).to.equal('Advanced Plan Yearly');

    expect(subscriptionDescription({
      plan_id: '40c092161f547f8f72c9f173cd8eebcb9ca5dd25-m',
      plan_quantity: 2,
      billing_period: 1,
      billing_period_unit: 'year'
    })).to.equal('2 x Basic Plan Yearly');

    expect(subscriptionDescription({
      plan_id: '40c092161f547f8f72c9f173cd8eebcb9ca5dd25-m',
      plan_quantity: 2,
      billing_period: 3,
      billing_period_unit: 'year'
    })).to.equal('2 x Basic Plan 3 Year');

    expect(subscriptionDescription({
      plan_id: '40c092161f547f8f72c9f173cd8eebcb9ca5dd25-m',
      plan_quantity: 2,
      billing_period: 3,
      billing_period_unit: 'month'
    })).to.equal('2 x Basic Plan 3 Month');

  });

  it('Use plan_id if the plan mapping is not found', function() {
    expect(subscriptionDescription({
      plan_id: 'pppc',
      plan_quantity: 1,
      billing_period: 1,
      billing_period_unit: 'year',
    })).to.equal('pppc');

    expect(subscriptionDescription({
      plan_id: 'pppc',
      plan_quantity: 3,
      billing_period: 1,
      billing_period_unit: 'year',
    })).to.equal('pppc');
  });

  it('should format volume plan names', function () {
    expect(subscriptionDescription({
      plan_id: '34e8b511c4cc4c2affa68205cd1faaab427657dc',
      plan_quantity: 1,
      billing_period: 1,
      billing_period_unit: 'month',
    })).to.equal('1 x Display Licenses Monthly Plan');

    expect(subscriptionDescription({
      plan_id: '88725121a2c7a57deefcf06688ffc8e84cc4f93b',
      plan_quantity: 3,
      billing_period: 1,
      billing_period_unit: 'year',
    })).to.equal('3 x Display Licenses for Education Yearly Plan');

  });

});
