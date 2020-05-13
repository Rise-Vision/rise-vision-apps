'use strict';
describe('service: encoding:', function() {
  var encoding, $httpBackend, authRequestHandler, $timeout;

  beforeEach(module('risevision.storage.services'));

  beforeEach(module(function ($provide) {
    $provide.service('$q', function() {return Q;});

    $provide.service('storageAPILoader', function () {
      return function() {
        return Q.resolve({
          getEncodingUploadURI: function(obj) {return {result: true};},
          acceptEncodedFile: function(obj) {return {result: true};}
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
      $timeout = $injector.get('$timeout');

      encoding = $injector.get('encoding');
      setTimeout(function() {$httpBackend.flush();});
    });
  });

  describe('applicability', function() {
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

  });

  describe('upload uri', function() {
    it('should retrieve encoder upload uri from storage server api', function() {
      $httpBackend.when('HEAD', /.*encoding-switch-on/).respond(200, {});

      return encoding.getResumableUploadURI('filename')
      .then(function(resp) {
        expect(resp).to.be.true;
      });
    });
  });

  describe('task status checks', function() {
    var taskToken = '12345';

    var item = {
      encodingStatusURL: 'https://host/v1/status',
      taskToken: taskToken
    };

    it('monitors status for a file item', function() {
      var statusResponse = {statuses: {}};
      statusResponse.statuses[taskToken] = {percent: 50};

      $httpBackend.when('HEAD', /.*encoding-switch-on/).respond(200, {});
      $httpBackend.when('POST', /.*status/).respond(200, statusResponse);

      var statusPromise = encoding.monitorStatus(item, onProgressSetStatusComplete);
      $timeout.flush(); // progress through first status check at 50%

      function onProgressSetStatusComplete(pct) {
        console.log('Encoding status: ' + pct + '%');

        statusResponse.statuses[taskToken].percent = 100;

        setTimeout(function() {$timeout.flush();}, 50); // second check
        setTimeout(function() {$httpBackend.flush();}, 60);
      }

      return statusPromise;
    });

    it('retries on monitor check failure', function() {
      $httpBackend.when('HEAD', /.*encoding-switch-on/).respond(200, {});

      var statusResponse = {statuses: {}};
      statusResponse.statuses[taskToken] = {percent: 100};

      var mockResp = $httpBackend.when('POST', /.*status/).respond(500, {});

      var statusPromise = encoding.monitorStatus(item, onProgress);
      var statusChecks = 0;
      $timeout.flush(); // allow first status request to fail

      setTimeout(function() {
        mockResp.respond(200, statusResponse); // set second request success
        setTimeout(function() {$timeout.flush();}, 5);
        setTimeout(function() {$httpBackend.flush();}, 10);
      }, 50);

      function onProgress(pct) {
        console.log('Encoding status: ' + pct + '%');
        statusChecks++;
      }

      return statusPromise.then(function() {
        assert('Two status calls', statusChecks === 2);
      });
    });
  });

  describe('file acceptance', function() {
    it('should accept the file after encoding', function() {
      $httpBackend.when('HEAD', /.*encoding-switch-on/).respond(200, {});

      return encoding.acceptEncodedFile('companyid', 'filename')
      .then(function(resp) {
        expect(resp).to.be.true;
      });
    });
  });
});
