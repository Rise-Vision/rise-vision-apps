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

  it('should return for licensed displays if not Subscribed',function() {
    var gadget = {
      subscriptionStatus: 'Subscribed',
      isSubscribed: false
    };

    expect(subscriptionStatusMessage(gadget)).to.equal('Professional');
  });

  it('should return original status if Subscribed but not Licensed',function() {
    var gadget = {
      subscriptionStatus: 'Subscribed',
      isSubscribed: true,
      isLicensed: false
    };

    expect(subscriptionStatusMessage(gadget)).to.equal('Subscribed');
  });

  it('should return licensed displays if isLicensed',function(){
    var gadget = {
      isSubscribed: true,
      isLicensed: true
    };

    expect(subscriptionStatusMessage(gadget)).to.equal('Professional');
  });

});
