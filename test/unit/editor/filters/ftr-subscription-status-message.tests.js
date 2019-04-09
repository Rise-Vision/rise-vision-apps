'use strict';
describe('filter: subscriptionStatusMessage', function() {
  beforeEach(module('risevision.editor.filters'));
  var subscriptionStatusMessage;

  beforeEach(module(function ($provide) {
    $provide.service('translateFilter', function(){
      return function(key){
        var status = '';
        switch (key) {
          case 'editor-app.subscription.status.professional':
            status = 'Professional';
            break;
          case 'editor-app.subscription.status.daysTrial':
            status = 'Days Trial';
            break;
          case 'editor-app.subscription.status.daysRemaining':
            status = 'Days Remaining';
            break;
        }
        return status;
      };
    });

  }));

  beforeEach(function(){
    inject(function($filter){
      subscriptionStatusMessage = $filter('subscriptionStatusMessage');
    });
  });

  it('should exist',function(){
    expect(subscriptionStatusMessage).to.be.ok;
  });

  it('should return status if none of the conditions match',function() {
    var gadget = {
      subscriptionStatus: 'Subscribed'
    };

    expect(subscriptionStatusMessage(gadget)).to.equal('Subscribed');
  });

  it('should return licensed displays if isLicensed',function(){
    var gadget = {
      isLicensed: true
    };

    expect(subscriptionStatusMessage(gadget)).to.equal('Professional');
  });

  it('should trial period if available',function(){
    var gadget = {
      subscriptionStatus: 'Not Subscribed',
      trialPeriod: 14
    };

    expect(subscriptionStatusMessage(gadget)).to.equal('Not Subscribed - ' + 14 + ' Days Trial');
  });

  it('should return non free gadget',function(){
    var gadget = {
      subscriptionStatus: 'On Trial',
      expiry: new Date().setDate(new Date().getDate() + 3)
    };

    expect(subscriptionStatusMessage(gadget)).to.equal('On Trial - 3 Days Remaining');
  });

});
