'use strict';

describe('app:', function() {
  beforeEach(function () {
      angular.module('risevision.apps.partials',[]);

      module('risevision.apps');

      module(function ($provide) {
        $provide.service('canAccessApps',function(){
          return sinon.spy(function() {
            return Q.resolve("auth");
          })
        });

        $provide.service('editorFactory',function(){
          return {
            presentation: 'copyPresentation',
            addPresentationModal: sinon.spy(),
            getPresentation: sinon.spy(),
            copyTemplate: sinon.spy(),
            newPresentation: sinon.spy()
          };
        });

        $provide.service('displayFactory',function(){
          return {
            addDisplayModal: function(){}
          };
        });

        $provide.service('plansFactory',function(){
          return {
            showPlansModal: sinon.stub()
          };
        });
      });

      inject(function ($injector) {
        $state = $injector.get('$state');
        canAccessApps = $injector.get('canAccessApps');
        editorFactory = $injector.get('editorFactory');
        displayFactory = $injector.get('displayFactory');
        plansFactory = $injector.get('plansFactory');
        $rootScope = $injector.get('$rootScope');
        $location = $injector.get('$location');
      });
  });


  var $state, canAccessApps, editorFactory, displayFactory, plansFactory, $rootScope, $location;

  describe('state apps.editor.add:',function(){

    it('should register state',function(){
      var state = $state.get('apps.editor.add');
      expect(state).to.be.ok;
      expect(state.url).to.equal('/editor/add');
      expect(state.controller).to.be.ok;
    });

    it('should init add presentation modal',function(done){
      $state.get('apps.editor.add').controller[3]($state, canAccessApps, editorFactory);
      setTimeout(function() {
        canAccessApps.should.have.been.called;

        editorFactory.addPresentationModal.should.have.been.called;
        done();
      }, 10);
    });
  });

  describe('state apps.editor.workspace:',function(){
    it('should register state',function(){
      var state = $state.get('apps.editor.workspace');
      expect(state).to.be.ok;
      expect(state.url).to.equal('/editor/workspace/:presentationId/:copyPresentation');
      expect(state.controller).to.be.ok;
      expect(state.abstract).to.be.true;
    });

    it('should only check access once', function(done) {
      $state.get('apps.editor.workspace').resolve.presentationInfo[4](canAccessApps, editorFactory, {}, $location);
      setTimeout(function() {
        canAccessApps.should.have.been.called.once;
        canAccessApps.should.have.been.calledWith();

        done();
      }, 10);
    });

    it('should redirect to signup for templates', function(done) {
      var $stateParams = {
        presentationId: 'new'
      }
      sinon.stub($location, 'search').returns({copyOf: 'templateId'});

      $state.get('apps.editor.workspace').resolve.presentationInfo[4](canAccessApps, editorFactory, $stateParams, $location);
      setTimeout(function() {
        canAccessApps.should.have.been.calledWith(true);

        done();
      }, 10);
    });

    describe('states: ', function() {
      it('should copy presentation', function(done) {
        var $stateParams = {
          copyPresentation: true
        };

        $state.get('apps.editor.workspace').resolve.presentationInfo[4](canAccessApps, editorFactory, $stateParams, $location)
          .then(function(stateResolve) {
            expect(stateResolve).to.equal('copyPresentation');

            done();
          });
      });

      it('should retrieve existing presentation', function(done) {
        var $stateParams = {
          presentationId: 'presentationId'
        };

        $state.get('apps.editor.workspace').resolve.presentationInfo[4](canAccessApps, editorFactory, $stateParams, $location)
          .then(function() {
            editorFactory.getPresentation.should.have.been.calledWith('presentationId');

            done();
          });
      });

      it('should copy template', function(done) {
        var $stateParams = {
          presentationId: 'new'
        };
        sinon.stub($location, 'search').returns({copyOf: 'templateId'});

        $state.get('apps.editor.workspace').resolve.presentationInfo[4](canAccessApps, editorFactory, $stateParams, $location)
          .then(function() {
            editorFactory.copyTemplate.should.have.been.calledWith(null, 'templateId');

            done();
          });
      });

      it('should add new presentation', function(done) {
        var $stateParams = {};

        $state.get('apps.editor.workspace').resolve.presentationInfo[4](canAccessApps, editorFactory, $stateParams, $location)
          .then(function() {
            editorFactory.newPresentation.should.have.been.called;

            done();
          });
      });
    });
  });

  describe('state apps.editor.workspace.artboard:',function(){
    it('should register state',function(){
      var state = $state.get('apps.editor.workspace.artboard');
      expect(state).to.be.ok;
      expect(state.url).to.equal('');
      expect(state.controller).to.be.ok;
      expect(state.reloadOnSearch).to.be.false;
    });
  });


  describe('state apps.editor.workspace.htmleditor:',function(){
    it('should register state',function(){
      var state = $state.get('apps.editor.workspace.htmleditor');
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
      var state = $state.get('apps.launcher.signup');
      expect(state).to.be.ok;
      expect(state.url).to.equal('/signup');
      expect(state.controller).to.be.ok;
    });

    it('should redirect to home',function(done){
      var canAccessApps = function() {
        return Q.resolve();
      };
      var $location = {
        search: function() { 
          return {};
        }
      };

      sinon.spy($state,'go');
      
      $state.get('apps.launcher.signup').controller[4]($location, $state, canAccessApps, plansFactory);
      setTimeout(function() {
        $state.go.should.have.been.calledWith('apps.launcher.home');

        done();
      }, 10);
    });

    it('should redirect to store product if signed in',function(done){
      var STORE_URL = "https://store.risevision.com/";
      var IN_RVA_PATH = "product/productId/?cid=companyId";

      var userState = {
        getSelectedCompanyId: function() {
          return 'cid123'
        }
      };
      var canAccessApps = function() {
        return Q.resolve()
      };
      var $location = {search: function() {return {show_product:123}}};
      var $window = {location:{}}

      $state.get('apps.launcher.signup').controller[4]($location, $state, canAccessApps, plansFactory);
      setTimeout(function() {
        expect(plansFactory.showPlansModal).to.have.been.called;
        done();
      }, 10);
    });

    it('should not redirect to store product if not signed in',function(done){
      var canAccessApps = function() {
        return Q.reject();
      };

      var $location = {
        search: sinon.spy()
      };

      sinon.spy($state,'go');
      $state.get('apps.launcher.signup').controller[4]($location, $state, canAccessApps, plansFactory);

      setTimeout(function() {
        $location.search.should.not.have.been.called;
        $state.go.should.not.have.been.called;

        done();
      }, 10);
    });
  });
  
});
