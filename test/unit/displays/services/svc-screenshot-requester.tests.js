'use strict';

describe('service: screenshot requester:', function() {
  var sandbox;

  beforeEach(module('risevision.displays.services'));
  beforeEach(module(function ($provide) {
    $provide.service('$q', function() {return Q;});
    $provide.service('userState',function(){
      return {
        _restoreState:function(){}
      };
    });

  }));

  var primus;
  var screenshotRequester;

  describe('screenshotRequester', function() {
    var $timeout;
    var triggerPrimusHandler;

    beforeEach(function() {
      inject(function($injector){
        var $window = $injector.get('$window');

        var primusHandler;

        $window.Primus = function() { return {
            open: function() {},
            on: function(eName, cb) {if (eName === 'data') {primusHandler = cb; }},
            end: function() {}
          };
        };

        $window.primus = primus;
        $window.triggerPrimusHandler = triggerPrimusHandler = function(data) { primusHandler(data); };

        screenshotRequester = $injector.get('screenshotRequester');
        $timeout = $injector.get('$timeout');
      });
    });

    it('should wait for a successful screenshot response from new MS', function(done) {
      var coreCall = sinon.stub();

      coreCall.returns({
        then: function() {
          setTimeout(function() {
            triggerPrimusHandler({
              msg: 'screenshot-saved',
              clientId: 1
            });
          });
        }
      });

      screenshotRequester(coreCall).then(function(data) {
        expect(coreCall).to.be.calledOnce;
        expect(data.msg).to.equal("screenshot-saved");
        done();
      });

      setTimeout(function() {
        triggerPrimusHandler({ msg: 'client-connected', clientId: 1 });
      }, 50);
    });

    it('should wait for a failed screenshot response', function(done) {
      var coreCall = sinon.stub();

      coreCall.returns({
        then: function(a, b) {
          expect(a).to.equal(null);

          setTimeout(function() {
            triggerPrimusHandler({
              msg: 'screenshot-failed',
              clientId: 1
            });
          });
        }
      });

      screenshotRequester(coreCall).catch(function(err) {
        expect(coreCall).to.be.calledOnce;
        expect(err).to.equal('screenshot-failed');
        done();
      });

      setTimeout(function() {
        triggerPrimusHandler({ msg: 'client-connected', clientId: 1 });
      }, 50);
    });

    it('should wait for a failed Core request', function(done) {
      var coreCall = sinon.stub();

      coreCall.returns({
        then: function(a, b) {
          expect(a).to.equal(null);
          b('core-failed');
        }
      });

      screenshotRequester(coreCall).catch(function(err) {
        expect(coreCall).to.be.calledOnce;
        expect(err).to.equal('core-failed');
        done();
      });

      setTimeout(function() {
        triggerPrimusHandler({ msg: 'client-connected', clientId: 1 });
      }, 50);
    });

    it('should handle a timeout', function(done) {
      var coreCall = sinon.stub();

      coreCall.returns({
        then: function() {
          $timeout.flush();
        }
      });

      screenshotRequester(coreCall).catch(function(err) {
        expect(coreCall).to.be.calledOnce;
        expect(err).to.equal('timeout');
        done();
      });

      setTimeout(function() {
        triggerPrimusHandler({ msg: 'client-connected', clientId: 1 });
      }, 50);
    });
  });
});
