'use strict';
describe('service: email:', function() {
  beforeEach(module('risevision.apps.services'));
  beforeEach(module(function ($provide) {
    $provide.service('$q', function() {return Q;});

    $provide.service('riseAPILoader',function () {
      return function(){
        var deferred = Q.defer();
                
        deferred.resolve({
          email: {
            send: function(obj) {
              expect(obj).to.be.ok;
              
              var def = Q.defer();
              if (apiSuccess) {
                def.resolve({
                  result: {
                    item: obj
                  }
                });
              } else {
                def.reject('API Failed');
              }
              return def.promise;
            }
          }
        });
        return deferred.promise;
      };
    });

  }));
  var email, apiSuccess;
  beforeEach(function(){
    apiSuccess = true;
    
    inject(function($injector){  
      email = $injector.get('email');
    });
  });

  it('should exist',function(){
    expect(email).to.be.truely;
    expect(email.send).to.be.a('function');
  });

  describe('send:',function(){
    it('should send an email',function(done){
      email.send(['user@gmail.com'], 'email subject', 'email body')
      .then(function(result){
        expect(result).to.be.ok;
        expect(result.item).to.be.ok;
        expect(result.item).to.deep.equal({
          from: 'support@risevision.com',
          fromName: 'Rise Vision Support',
          recipients: ['user@gmail.com'],
          subject: 'email subject',
          data: {text: 'email body'}
        });
        
        done();
      })
      .then(null,done);
    });
    
    it('should handle failure to send an email',function(done){
      apiSuccess = false;

      email.send(['user@gmail.com'], 'email subject', 'email body')
      .then(function(result) {
        done(result);
      })
      .then(null, function(error) {
        expect(error).to.deep.equal('API Failed');
        done();
      })
      .then(null,done);
    });
  });
});
