'use strict';

describe('service: checkTemplateAccess:', function() {
  var TEMPLATE_LIBRARY_PRODUCT_CODE = "templates-library";
  var TEMPLATE_TEST_CODE = "template-test";

  beforeEach(module('risevision.editor.services'));

  beforeEach(module(function ($provide) {
    $provide.value("TEMPLATE_LIBRARY_PRODUCT_CODE", TEMPLATE_LIBRARY_PRODUCT_CODE);
    $provide.service('$q', function() {return Q;});

    $provide.service('subscriptionStatusFactory', function() {
      return {
        check: function(templateCode) {
          var deferred = Q.defer();
          var status = returnStatusArray[0];
          returnStatusArray = returnStatusArray.slice(1);
          if(status) {
            deferred.resolve(returnStatusArray);
          } else {
            deferred.reject('API Error');
          }            
          return deferred.promise;
        }
      };
    });
    
    
  }));
  
  var checkTemplateAccess, returnStatusArray;

  beforeEach(function(){
    returnStatusArray = [];

    inject(function($injector){
      checkTemplateAccess = $injector.get('checkTemplateAccess');
    });
  });

  it('should exist',function(){
    expect(checkTemplateAccess).to.be.a('function');
  });

  it('should give access to premium templates if subscribed to Templates Library', function(done) {
    
    returnStatusArray = [true];

    checkTemplateAccess(TEMPLATE_TEST_CODE)
    .then(function() {
      done();
    });
  });

  it('should give access to premium templates if subscribed to the template', function(done) {
    
    returnStatusArray = [false, true];

    checkTemplateAccess(TEMPLATE_TEST_CODE)
    .then(function() {
      done();
    });
  });

  it('should reject access to premium templates if not subscribed to Templates Library or to the template', function(done) {
    
    returnStatusArray = [false, false];

    checkTemplateAccess(TEMPLATE_TEST_CODE)
    .then(null, function() {
      done();
    });
  });

});
