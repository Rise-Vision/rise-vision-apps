'use strict';

describe('service: primus:', function() {
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

        }
      };
      var Primus = function() {
        return primus;
      };

      return {
        Primus: function() { return primus; },
        PrimusOldMS: function() { return primus; },
        primus: primus
      };
    });

  }));

  var primus;
  var getDisplayStatus;

  describe('getDisplayStatus', function() {
    var $timeout;
    var $httpBackend;

    beforeEach(function(){
      inject(function($injector){
        primus = $injector.get('$window').primus;
        getDisplayStatus = $injector.get('getDisplayStatus');
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

      getDisplayStatus(['a', 'b', 'c']).then(function(msg) {
        expect(msg[0].a).to.be.true;
        expect(msg[1].b).to.be.true;
        expect(msg[2].c).to.be.true;
        done();
      });

      setTimeout($httpBackend.flush, 100);
    });

    it('should handle a timeout', function(done) {
      setTimeout(function() {
        $timeout.flush();
      });

      primus.open = function() {};

      getDisplayStatus([]).catch(function(err) {
        expect(err).to.equal('timeout');
        done();
      });
    });
  });

  var screenshotRequester;
  describe('screenshotRequester', function() {
    var $timeout;

    beforeEach(function() {
      inject(function($injector){
        primus = $injector.get('$window').primus;
        screenshotRequester = $injector.get('screenshotRequester');
        $timeout = $injector.get('$timeout');

        primus.open = function() {
          setTimeout(function() {
            primus.dataCb({
              msg: 'client-connected',
              clientId: 1
            });
          });
        };
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
    });
  });
});
