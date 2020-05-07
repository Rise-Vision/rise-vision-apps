'use strict';
describe('service: encoding:', function() {
  var encoding, $httpBackend, authRequestHandler;

  beforeEach(module('risevision.storage.services'));

  beforeEach(module(function ($provide) {
    $provide.service('$q', function() {return Q;});

    $provide.service('storageAPILoader', function () {
      return function() {
        return Q.resolve({
          getEncodingUploadURI: function(obj) {return {result: true};}
        });
      };
    });

    $provide.service('userState', function () {
      return {
        getSelectedCompanyId: function() {return '12345';},
        _restoreState: function(){}
      };
    });
  }));

  beforeEach(function(){
    inject(function($injector){
      $httpBackend = $injector.get('$httpBackend');

      encoding = $injector.get('encoding');
      setTimeout(function() {$httpBackend.flush();});
    });
  });

  it('should be applicable if file is video', function() {
    $httpBackend.when('HEAD', /.*encoding-switch-on/).respond(200, {});

    return encoding.isApplicable('video/subtype')
    .then(function(resp) {
      expect(resp).to.be.ok;
    });
  });

  it('should not be applicable if file is not video', function() {
    $httpBackend.when('HEAD', /.*encoding-switch-on/).respond(200, {});

    return encoding.isApplicable('text/subtype')
    .then(function(resp) {
      expect(resp).to.not.be.ok;
    });
  });

  it('should not be applicable if master switch is off', function() {
    $httpBackend.when('HEAD', /.*encoding-switch-on/).respond(403, {});

    return encoding.isApplicable('video/subtype')
    .then(function(resp) {
      expect(resp).to.not.be.ok;
    });
  });

  it('should retrieve encoder upload uri from storage server api', function() {
    $httpBackend.when('HEAD', /.*encoding-switch-on/).respond(200, {});

    return encoding.getResumableUploadURI('filename')
    .then(function(resp) {
      expect(resp).to.be.true;
    });
  });
});
