'use strict';
  
describe('app:', function() {
  beforeEach(function () {    
      angular.module('risevision.apps.partials',[]);

      module('risevision.apps');

      module(function ($provide) {
        $provide.service('canAccessApps',function(){
          return function() {
            var deferred = Q.defer();
            deferred.resolve("auth");
            return deferred.promise;
          }
        });
      });

      inject(function ($injector) {
        $state = $injector.get('$state');
        supportFactory = $injector.get('supportFactory');
        canAccessApps = $injector.get('canAccessApps');
      });
  });

  
  var $state, supportFactory, canAccessApps;

  describe('state apps.launcher.support:',function(){
    
    it('should register state',function(){
      var supportState = $state.get('apps.launcher.support')
      expect(supportState).to.be.ok;
      expect(supportState.url).to.equal('/support');
      expect(supportState.controller).to.be.ok;
    });

    it('should init support modal',function(done){
      var spy = sinon.spy(supportFactory,'handlePrioritySupportAction') 
      $state.get('apps.launcher.support').controller[3]($state, canAccessApps, supportFactory);
      setTimeout(function() {
        spy.should.have.been.called;
        done();
      }, 10);
    });
  });

  describe('state apps.launcher.sendnote:',function(){
    
    it('should register state',function(){
      var supportState = $state.get('apps.launcher.sendnote')
      expect(supportState).to.be.ok;
      expect(supportState.url).to.equal('/send-note');
      expect(supportState.controller).to.be.ok;
    });

    it('should init Send Us a Note modal',function(done){
      var spy = sinon.spy(supportFactory,'handleSendUsANote') 
      $state.get('apps.launcher.sendnote').controller[3]($state, canAccessApps, supportFactory);
      setTimeout(function() {
        spy.should.have.been.called;
        done();
      }, 10);
    });
  });
});
