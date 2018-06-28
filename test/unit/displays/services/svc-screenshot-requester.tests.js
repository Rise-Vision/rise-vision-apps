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

    $provide.service('$window', function() {
      var primus = {
        on: function(eName, cb) {
          if(eName === 'data') {
            primus.dataCb = cb;
          } else if (eName === 'open') {
            primus.openCb = cb;
          }
        },
        open: function() {
          setTimeout(function() {
            primus.openCb && primus.openCb();
          });
        },
        end: function() {

        },
        emit: function(eName, data) {
          if (eName !== 'data') { return; }
          primus.dataCb(data);
        }
      };

      var newPrimusHandler;

      return {
        Primus: function() { return {
          open: function() {},
          on: function(eName, cb) {if (eName === 'data') {newPrimusHandler = cb; }},
          end: function() {}
        }; },
        PrimusOldMS: function() { return primus; },
        primus: primus,
        triggerNewPrimus: function(data) { newPrimusHandler(data); }
      };
    });

  }));

  var primus;
  var screenshotRequester;

  describe('screenshotRequester', function() {
    var $timeout;
    var triggerNewPrimus;

    beforeEach(function() {
      inject(function($injector){
        primus = $injector.get('$window').primus;
        triggerNewPrimus = $injector.get('$window').triggerNewPrimus;
        screenshotRequester = $injector.get('screenshotRequester');
        $timeout = $injector.get('$timeout');
      });
    });

    it('should wait for a successful screenshot response', function(done) {
      var coreCall = sinon.stub();

      coreCall.returns({
        then: function() {
          setTimeout(function() {
            primus.dataCb({
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
        primus.dataCb({ msg: 'client-connected', clientId: 1 });
      }, 50);
    });

    it('should wait for a successful screenshot response from new MS', function(done) {
      var coreCall = sinon.stub();

      coreCall.returns({
        then: function() {
          setTimeout(function() {
            triggerNewPrimus({
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
        primus.dataCb({ msg: 'client-connected', clientId: 1 });
      }, 50);
    });

    it('should wait for a failed screenshot response', function(done) {
      var coreCall = sinon.stub();

      coreCall.returns({
        then: function(a, b) {
          expect(a).to.equal(null);

          setTimeout(function() {
            primus.dataCb({
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
        primus.dataCb({ msg: 'client-connected', clientId: 1 });
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
        primus.dataCb({ msg: 'client-connected', clientId: 1 });
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
        primus.dataCb({ msg: 'client-connected', clientId: 1 });
      }, 50);
    });
  });
});
