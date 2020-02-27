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

        $provide.service('checkTemplateAccess',function(){
          return sinon.spy(function() {
            return Q.resolve();
          })
        });

        $provide.service('editorFactory',function(){
          return {
            presentation: 'copyPresentation',
            addPresentationModal: sinon.spy(),
            addFromProductId: sinon.spy(),
            getPresentation: sinon.spy(),
            copyTemplate: sinon.spy(),
            newPresentation: sinon.spy()
          };
        });

      });

      inject(function ($injector) {
        $state = $injector.get('$state');
        canAccessApps = $injector.get('canAccessApps');
        checkTemplateAccess = $injector.get('checkTemplateAccess');
        editorFactory = $injector.get('editorFactory');
        $location = $injector.get('$location');
      });
  });


  var $state, canAccessApps, checkTemplateAccess, editorFactory, $location;

  describe('state apps.editor.add:',function(){

    it('should register state',function(){
      var state = $state.get('apps.editor.add');
      expect(state).to.be.ok;
      expect(state.url).to.equal('/editor/add/:productId');
      expect(state.controller).to.be.ok;
    });

    it('should init add presentation modal',function(done){
      $state.get('apps.editor.add').controller[5]($state, {}, $location, canAccessApps, editorFactory);
      setTimeout(function() {
        canAccessApps.should.have.been.called;

        editorFactory.addPresentationModal.should.have.been.called;
        done();
      }, 10);
    });

    it('should add by productId',function(done){
      $state.get('apps.editor.add').controller[5]($state, { productId: 'productId' }, $location, canAccessApps, editorFactory);
      setTimeout(function() {
        canAccessApps.should.have.been.called;

        editorFactory.addFromProductId.should.have.been.calledWith('productId');
        done();
      }, 10);
    });
  });

  describe('state apps.editor.workspace:',function(){
    it('should register state',function(){
      var state = $state.get('apps.editor.workspace');
      expect(state).to.be.ok;
      expect(state.url).to.equal('/editor/workspace/:presentationId?copyOf');
      expect(state.controller).to.be.ok;
      expect(state.params).to.be.ok;
      expect(state.abstract).to.be.true;
    });

    it('should only check access once', function(done) {
      $state.get('apps.editor.workspace').resolve.presentationInfo[4](canAccessApps, editorFactory, {}, checkTemplateAccess);
      setTimeout(function() {
        canAccessApps.should.have.been.called.once;
        canAccessApps.should.have.been.calledWith();

        done();
      }, 10);
    });

    describe('checkTemplateAccess:', function() {
      it('should check access', function(done) {
        $state.get('apps.editor.workspace').resolve.presentationInfo[4](canAccessApps, editorFactory, {}, checkTemplateAccess);
        setTimeout(function() {
          checkTemplateAccess.should.have.been.called;

          done();
        }, 10);
      });

      it('should not check access if the parameter is true', function(done) {
        var $stateParams = {
          skipAccessNotice: true
        }

        $state.get('apps.editor.workspace').resolve.presentationInfo[4](canAccessApps, editorFactory, $stateParams, checkTemplateAccess);
        setTimeout(function() {
          checkTemplateAccess.should.not.have.been.called;

          done();
        }, 10);
      });

    });

    it('should redirect to signup for templates', function(done) {
      var $stateParams = {
        presentationId: 'new',
        copyOf: 'templateId'
      }

      $state.get('apps.editor.workspace').resolve.presentationInfo[4](canAccessApps, editorFactory, $stateParams, checkTemplateAccess);
      setTimeout(function() {
        canAccessApps.should.have.been.calledWith(true);

        done();
      }, 10);
    });

    describe('states: ', function() {
      it('should retrieve existing presentation', function(done) {
        var $stateParams = {
          presentationId: 'presentationId'
        };

        $state.get('apps.editor.workspace').resolve.presentationInfo[4](canAccessApps, editorFactory, $stateParams, checkTemplateAccess)
          .then(function() {
            editorFactory.getPresentation.should.have.been.calledWith('presentationId');

            done();
          });
      });

      it('should copy an already loaded presentation', function(done) {
        var $stateParams = {
          presetationId: 'new',
          copyOf: 'presentationId',
          isLoaded: true
        };

        $state.get('apps.editor.workspace').resolve.presentationInfo[4](canAccessApps, editorFactory, $stateParams, checkTemplateAccess)
          .then(function(stateResolve) {
            expect(stateResolve).to.equal('copyPresentation');

            done();
          });
      });

      it('should copy an already loaded presentation (works without new)', function(done) {
        var $stateParams = {
          copyOf: 'presentationId',
          isLoaded: true
        };

        $state.get('apps.editor.workspace').resolve.presentationInfo[4](canAccessApps, editorFactory, $stateParams, checkTemplateAccess)
          .then(function(stateResolve) {
            expect(stateResolve).to.equal('copyPresentation');

            done();
          });
      });

      it('should copy template', function(done) {
        var $stateParams = {
          presentationId: 'new',
          copyOf: 'templateId'
        };

        $state.get('apps.editor.workspace').resolve.presentationInfo[4](canAccessApps, editorFactory, $stateParams, checkTemplateAccess)
          .then(function() {
            editorFactory.copyTemplate.should.have.been.calledWith('templateId');

            done();
          });
      });

      it('should copy template (works without new)', function(done) {
        var $stateParams = {
          copyOf: 'templateId'
        };

        $state.get('apps.editor.workspace').resolve.presentationInfo[4](canAccessApps, editorFactory, $stateParams, checkTemplateAccess)
          .then(function() {
            editorFactory.copyTemplate.should.have.been.calledWith('templateId');

            done();
          });
      });

      it('should add new presentation', function(done) {
        var $stateParams = {};

        $state.get('apps.editor.workspace').resolve.presentationInfo[4](canAccessApps, editorFactory, $stateParams, checkTemplateAccess)
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

});
