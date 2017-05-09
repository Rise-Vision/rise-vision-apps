'use strict';
  
describe('service: placeholderFactory:', function() {
  beforeEach(module('risevision.editor.services'));
  beforeEach(module(function ($provide) {
    placeholder = {
      id: 'ph1',
      type: 'url',
      items: [
        {
          name: 'item1',
          objectReference: 'widget1'
        },
        {
          name: 'item2',
          objectReference: undefined,
        },
        {
          name: 'item3',
          objectReference: 'widget1',
        }
      ]      
    };

    $provide.service('gadgetFactory',function(){
      return {
        updateItemsStatus: function(items){
          var deferred = Q.defer();                
          if (forceError) {
            items[0].gadget = {};
            deferred.reject();
          } else {
            items[0].gadget = {id:'widget1', productCode:'pc1', statusMessage: 'Free'};
            deferred.resolve();
          }          
          return deferred.promise;
        }
      };
    });

  }));
  var placeholder, placeholderFactory, forceError;
  beforeEach(function(){    
    inject(function($injector){  
      placeholderFactory = $injector.get('placeholderFactory');
    });
  });

  it('should exist',function(){
    expect(placeholderFactory).to.be.truely;
    
    expect(placeholderFactory.setPlaceholder).to.be.a('function');
    expect(placeholderFactory.clearPlaceholder).to.be.a('function');    
    expect(placeholderFactory.updateSubscriptionStatus).to.be.a('function');    
  });

  it('should set placeholder', function() {
    placeholderFactory.setPlaceholder(placeholder)
    expect(placeholderFactory.placeholder).to.equal(placeholder);
  });

  it('should clear placeholder', function() {
    placeholderFactory.setPlaceholder(placeholder);
    placeholderFactory.clearPlaceholder();
    expect(placeholderFactory.placeholder).to.equal(undefined);
  });
  
  describe('updateSubscriptionStatus: ', function() {
    beforeEach(function(){    
      placeholderFactory.setPlaceholder(placeholder);
    });
    it('should update the status', function(done) {      
      placeholderFactory.updateSubscriptionStatus();
      setTimeout(function() {
        expect(placeholder.items[0].gadget.statusMessage).to.equal('Free');  
        done();
      }, 10);      
    });

    it('should handle failures', function(done) {
      forceError = true;
      placeholderFactory.updateSubscriptionStatus();
      setTimeout(function() {
        expect(placeholder.items[0].gadget.statusMessage).to.not.be.ok;  
        done();
      }, 10);      
    });
  });
  
});
