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
        $provide.service('displayFactory',function(){
          return {
            addDisplayModal: function(){}
          };
        });
      });

      inject(function ($injector) {
        $state = $injector.get('$state');
        supportFactory = $injector.get('supportFactory');
        canAccessApps = $injector.get('canAccessApps');
        editorFactory = $injector.get('editorFactory');
        displayFactory = $injector.get('displayFactory');
        $rootScope = $injector.get('$rootScope');
      });
  });


  var $state, supportFactory, canAccessApps, editorFactory, displayFactory, $rootScope;

  describe('state apps.launcher.support:',function(){

    it('should register state',function(){
      var supportState = $state.get('apps.launcher.support')
      expect(supportState).to.be.ok;
      expect(supportState.url).to.equal('/support');
      expect(supportState.controller).to.be.ok;
    });

    it('should init support modal',function(done){
      var spy = sinon.spy(supportFactory,'handleGetSupportAction')
      $state.get('apps.launcher.support').controller[3]($state, canAccessApps, supportFactory);
      setTimeout(function() {
        spy.should.have.been.called;
        done();
      }, 10);
    });
  });
  
  describe('state apps.editor.add:',function(){

    it('should register state',function(){
      var state = $state.get('apps.editor.add')
      expect(state).to.be.ok;
      expect(state.url).to.equal('/editor/add');
      expect(state.controller).to.be.ok;
    });

    it('should init add presentation modal',function(done){
      var spy = sinon.spy(editorFactory,'addPresentationModal')
      $state.get('apps.editor.add').controller[3]($state, canAccessApps, editorFactory);
      setTimeout(function() {
        spy.should.have.been.called;
        done();
      }, 10);
    });
  });

  describe('state apps.editor.workspace.artboard:',function(){
    it('should register state',function(){
      var state = $state.get('apps.editor.workspace.artboard')
      expect(state).to.be.ok;
      expect(state.url).to.equal('');
      expect(state.controller).to.be.ok;
      expect(state.reloadOnSearch).to.be.false;
    });
  });


  describe('state apps.editor.workspace.htmleditor:',function(){
    it('should register state',function(){
      var state = $state.get('apps.editor.workspace.htmleditor')
      expect(state).to.be.ok;
      expect(state.url).to.equal('/htmleditor');
      expect(state.controller).to.be.ok;
      expect(state.reloadOnSearch).to.be.false;
    });
  });


  it('should open add display modal when addDisplay event is sent',function(){
    var spy = sinon.spy(displayFactory,'addDisplayModal');

    $rootScope.$broadcast('distributionSelector.addDisplay');

    spy.should.have.been.called;
  });

  describe('state apps.launcher.signup:',function(){
    it('should register state',function(){
      var state = $state.get('apps.launcher.signup')
      expect(state).to.be.ok;
      expect(state.url).to.equal('/signup');
      expect(state.controller).to.be.ok;
    });

    it('should remove show_product param and go to home',function(done){
      var userState = {};
      var userAuthFactory = {authenticate: function(){return Q.reject()}};
      var $location = {search: function() {}};

      var goSpy = sinon.spy($state,'go');
      var searchSpy = sinon.spy($location,'search');
      
      $state.get('apps.launcher.signup').controller[7](userState, userAuthFactory, $state, null, $location, null, null);
      setTimeout(function() {
        goSpy.should.have.been.called;
        searchSpy.should.have.been.called;
        done();
      }, 10);
    });

    it('should redirect to store product if signed in',function(done){
      var STORE_URL = "https://store.risevision.com/";
      var IN_RVA_PATH = "product/productId/?cid=companyId";

      var userState = {
        isLoggedIn: function() {return true;},
        getSelectedCompanyId:function(){return 'cid123'}
      };
      var userAuthFactory = {
        authenticate: function(){return Q.resolve()}        
      };
      var $location = {search: function() {return {show_product:123}}};
      var $window = {location:{}}

      $state.get('apps.launcher.signup').controller[7](userState, userAuthFactory, $state, $window, $location, STORE_URL, IN_RVA_PATH);
      setTimeout(function() {
        expect($window.location.href).to.equal('https://store.risevision.com/product/123/?cid=cid123')
        done();
      }, 10);
    });

    it('should not redirect to store product if not signed in',function(done){
      var STORE_URL = "https://store.risevision.com/";
      var IN_RVA_PATH = "product/productId/?cid=companyId";

      var userState = {
        isLoggedIn: function() {return false;},
        getSelectedCompanyId:function(){return 'cid123'}
      };
      var userAuthFactory = {
        authenticate: function(){return Q.resolve()}
      };
      var $location = {search: function() {return {show_product:123}}};
      var $window = {location:{}}

      var goSpy = sinon.spy($state,'go')
      var searchSpy = sinon.spy($location,'search')

      $state.get('apps.launcher.signup').controller[7](userState, userAuthFactory, $state, $window, $location, STORE_URL, IN_RVA_PATH);
      setTimeout(function() {
        expect($window.location.href).to.not.equal('https://store.risevision.com/product/123/?cid=cid123');
        goSpy.should.have.been.called;
        searchSpy.should.have.been.called;
        done();
      }, 10);
    });
  });
  
});
