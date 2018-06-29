'use strict';

describe('service: display status factory:', function() {
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
            obj[id] = { connected: id === 'b' ? true : false };
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
            obj[id] = { connected: id === 'b' ? true : false };
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
});
