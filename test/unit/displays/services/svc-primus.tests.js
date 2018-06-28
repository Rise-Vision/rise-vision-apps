'use strict';

describe.only('service: primus:', function() {
  var sandbox;

  beforeEach(module('risevision.displays.services'));
  beforeEach(module(function ($provide) {
    $provide.service('$q', function() {return Q;});
    $provide.service('userState',function(){
      return {
        getAccessToken : function(){
          return{access_token: 'TEST_TOKEN'};
        },
        getSelectedCompanyId : function(){
          return 'TEST_COMP_ID';
        },
        getCopyOfSelectedCompany : function(){
          return {
            name : 'TEST_COMP',
            id : 'TEST_COMP_ID'
          };
        },
        getCopyOfProfile : function(){
          return {
            firstName : 'first',
            lastName : 'lastName',
            telephone : '123',
            email : 'foo@bar'
          };
        },
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
        write: function(d) {
          setTimeout(function() {
            primus.dataCb({
              msg: 'presence-result',
              result: [{'a': true}, {'b': false}, {'c': true},]
            });
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
  var displayStatusFactory;

  describe('displayStatusFactory', function() {
    var $timeout;
    var $httpBackend;

    beforeEach(function(){
      inject(function($injector){
        primus = $injector.get('$window').primus;
        displayStatusFactory = $injector.get('displayStatusFactory');
        $timeout = $injector.get('$timeout');
        $httpBackend = $injector.get('$httpBackend');
      });
    });

    it('should call both messaging services and load status', function(done) {
      $httpBackend.when('POST', /.*/).respond(function(method, url, data) {
        var ids = JSON.parse(data);
        return [
          200,
          ids.reduce(function(obj, id) {
            obj[id] = { connected: id === "b" ? true : false };
            return obj;
          }, {}),
        ];
      });

      displayStatusFactory.getDisplayStatus(['a', 'b', 'c']).then(function(msg) {
        expect(msg[0].a).to.be.true;
        expect(msg[1].b).to.be.true;
        expect(msg[2].c).to.be.true;
        expect(displayStatusFactory.apiError).to.be.null;
        done();
      });

      setTimeout(primus.open, 50);
      setTimeout($httpBackend.flush, 200);
    });

    it('should handle a timeout, and still return a result if the http call succeeds', function(done) {
      $httpBackend.when('POST', /.*/).respond(function(method, url, data) {
        var ids = JSON.parse(data);
        return [
          200,
          ids.reduce(function(obj, id) {
            obj[id] = { connected: id === "b" ? true : false };
            return obj;
          }, {}),
        ];
      });

      setTimeout(function() {
        $timeout.flush();
      });
      setTimeout($httpBackend.flush, 200);

      primus.open = function() {};

      displayStatusFactory.getDisplayStatus([]).then(function() {
        expect(displayStatusFactory.apiError).to.be.null;
        done();
      });
    });

    it('should handle a timeout, and return an error if the http call fails', function(done) {
      $httpBackend.when('POST', /.*/).respond(function(method, url) {
        return [
          500, 'timeout'
        ];
      });

      setTimeout(function() {
        $timeout.flush();
      });
      setTimeout($httpBackend.flush, 200);

      primus.open = function() {};

      displayStatusFactory.getDisplayStatus([]).catch(function(err) {
        expect(err.data).to.equal('timeout');
        expect(displayStatusFactory.apiError).to.be.not.null;
        done();
      });
    });
  });

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
