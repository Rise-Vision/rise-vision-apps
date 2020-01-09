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

        $provide.factory('financialLicenseFactory', function() {
          return {
            needsFinancialDataLicense: sinon.stub().returns(false),
            showFinancialDataLicenseRequiredMessage: sinon.spy()
          };
        });

        $provide.service('templateEditorFactory',function(){
          return {
            addFromProduct: sinon.spy(),
            createFromProductId: sinon.spy(),
            getPresentation: sinon.spy()
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
        checkTemplateAccess = $injector.get('checkTemplateAccess');
        editorFactory = $injector.get('editorFactory');
        financialLicenseFactory = $injector.get('financialLicenseFactory');
        templateEditorFactory = $injector.get('templateEditorFactory');
        displayFactory = $injector.get('displayFactory');
        plansFactory = $injector.get('plansFactory');
        $rootScope = $injector.get('$rootScope');
        $location = $injector.get('$location');
      });
  });


  var $state, canAccessApps, checkTemplateAccess, editorFactory, financialLicenseFactory, templateEditorFactory, displayFactory, plansFactory, $rootScope, $location;

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

  describe('state apps.editor.templates.edit:',function(){
    it('should register state',function(){
      var state = $state.get('apps.editor.templates.edit');
      expect(state).to.be.ok;
      expect(state.url).to.equal('/edit/:presentationId/:productId');
      expect(state.controller).to.be.ok;
      expect(state.params).to.be.ok;
    });

    it('should only check access once', function(done) {
      $state.get('apps.editor.templates.edit').resolve.presentationInfo[6]({}, canAccessApps, editorFactory, templateEditorFactory, checkTemplateAccess, financialLicenseFactory);
      setTimeout(function() {
        canAccessApps.should.have.been.called.once;
        canAccessApps.should.have.been.calledWith();

        done();
      }, 10);
    });

    describe('subscription warnings:', function() {
      describe('showFinancialDataLicenseRequiredMessage:', function() {
        it('should show financial license required message', function(done) {
          financialLicenseFactory.needsFinancialDataLicense.returns(true);
          var $stateParams = {
            presentationId: 'new'
          }

          $state.get('apps.editor.templates.edit').resolve.presentationInfo[6]($stateParams, canAccessApps, editorFactory, templateEditorFactory, checkTemplateAccess, financialLicenseFactory);
          setTimeout(function() {
            financialLicenseFactory.needsFinancialDataLicense.should.have.been.called;
            financialLicenseFactory.showFinancialDataLicenseRequiredMessage.should.have.been.called;

            checkTemplateAccess.should.not.have.been.called;

            done();
          }, 10);
        });

        it('should not show financial license required message if no financial components exist', function(done) {
          financialLicenseFactory.needsFinancialDataLicense.returns(false);
          var $stateParams = {
            presentationId: 'new'
          }

          $state.get('apps.editor.templates.edit').resolve.presentationInfo[6]($stateParams, canAccessApps, editorFactory, templateEditorFactory, checkTemplateAccess, financialLicenseFactory);
          setTimeout(function() {
            financialLicenseFactory.needsFinancialDataLicense.should.have.been.called;
            financialLicenseFactory.showFinancialDataLicenseRequiredMessage.should.not.have.been.called;

            checkTemplateAccess.should.have.been.called;

            done();
          }, 10);
        });

        it('should not show financial license required message for existing templates', function(done) {
          financialLicenseFactory.needsFinancialDataLicense.returns(true);
          var $stateParams = {
            presentationId: 'existing id'
          }

          $state.get('apps.editor.templates.edit').resolve.presentationInfo[6]($stateParams, canAccessApps, editorFactory, templateEditorFactory, checkTemplateAccess, financialLicenseFactory);
          setTimeout(function() {
            financialLicenseFactory.needsFinancialDataLicense.should.not.have.been.called;
            financialLicenseFactory.showFinancialDataLicenseRequiredMessage.should.not.have.been.called;

            checkTemplateAccess.should.have.been.called;

            done();
          }, 10);

        });

      });

      describe('checkTemplateAccess:', function() {
        it('should check access', function(done) {
          $state.get('apps.editor.templates.edit').resolve.presentationInfo[6]({}, canAccessApps, editorFactory, templateEditorFactory, checkTemplateAccess, financialLicenseFactory);
          setTimeout(function() {
            financialLicenseFactory.needsFinancialDataLicense.should.not.have.been.called;
            financialLicenseFactory.showFinancialDataLicenseRequiredMessage.should.not.have.been.called;

            checkTemplateAccess.should.have.been.called;

            done();
          }, 10);
        });

        it('should not check access if the parameter is true', function(done) {
          var $stateParams = {
            skipAccessNotice: true
          }

          $state.get('apps.editor.templates.edit').resolve.presentationInfo[6]($stateParams, canAccessApps, editorFactory, templateEditorFactory, checkTemplateAccess, financialLicenseFactory);
          setTimeout(function() {
            financialLicenseFactory.needsFinancialDataLicense.should.not.have.been.called;
            financialLicenseFactory.showFinancialDataLicenseRequiredMessage.should.not.have.been.called;

            checkTemplateAccess.should.not.have.been.called;

            done();
          }, 10);
        });

      });
    });

    it('should redirect to signup for templates', function(done) {
      var $stateParams = {
        presentationId: 'new',
        productId: 'productId'
      }

      $state.get('apps.editor.templates.edit').resolve.presentationInfo[6]($stateParams, canAccessApps, editorFactory, templateEditorFactory, checkTemplateAccess, financialLicenseFactory);
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

        $state.get('apps.editor.templates.edit').resolve.presentationInfo[6]($stateParams, canAccessApps, editorFactory, templateEditorFactory, checkTemplateAccess, financialLicenseFactory)
          .then(function() {
            templateEditorFactory.getPresentation.should.have.been.calledWith('presentationId');

            done();
          });
      });

      it('should copy an already loaded template by productDetails', function(done) {
        var $stateParams = {
          presentationId: 'new',
          productId: 'presentationId',
          productDetails: 'productDetails'
        };

        $state.get('apps.editor.templates.edit').resolve.presentationInfo[6]($stateParams, canAccessApps, editorFactory, templateEditorFactory, checkTemplateAccess, financialLicenseFactory)
          .then(function() {
            templateEditorFactory.addFromProduct.should.have.been.calledWith('productDetails');

            done();
          });
      });

      it('should copy template by template id', function(done) {
        var $stateParams = {
          presentationId: 'new',
          productId: 'templateId'
        };

        $state.get('apps.editor.templates.edit').resolve.presentationInfo[6]($stateParams, canAccessApps, editorFactory, templateEditorFactory, checkTemplateAccess, financialLicenseFactory)
          .then(function() {
            editorFactory.addFromProductId.should.have.been.calledWith('templateId');

            done();
          });
      });

    });
  });

  it('should open add display modal when addDisplay event is sent',function(){
    var spy = sinon.spy(displayFactory,'addDisplayModal');

    $rootScope.$broadcast('distributionSelector.addDisplay');

    spy.should.have.been.called;
  });

  describe('state common.auth.signup:',function(){
    it('should register state',function(){
      var state = $state.get('common.auth.signup');
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
      
      $state.get('common.auth.signup').controller[4]($location, $state, canAccessApps, plansFactory);
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

      $state.get('common.auth.signup').controller[4]($location, $state, canAccessApps, plansFactory);
      setTimeout(function() {
        expect(plansFactory.showPlansModal).to.have.been.called;
        done();
      }, 10);
    });

    it('should not redirect to store product if not signed in',function(done){
      var canAccessApps = function() {
        return Q.reject();
      };

      var $location = {search: function() {return {show_product:123}}};

      sinon.spy($state,'go');
      $state.get('common.auth.signup').controller[4]($location, $state, canAccessApps, plansFactory);

      setTimeout(function() {
        $state.go.should.not.have.been.called;

        done();
      }, 10);
    });
  });

  describe('state common.auth.signin:',function(){
    it('should register state',function(){
      var state = $state.get('common.auth.signin');
      expect(state).to.be.ok;
      expect(state.url).to.equal('/signin');
      expect(state.controller).to.be.ok;
    });

    it('should redirect to home',function(done){
      var canAccessApps = function() {
        return Q.resolve();
      };

      sinon.spy($state,'go');
      
      $state.get('common.auth.signin').controller[2]($state, canAccessApps);
      setTimeout(function() {
        $state.go.should.have.been.calledWith('apps.launcher.home');

        done();
      }, 10);
    });

    it('should not redirect to home if not signed in',function(done){
      var canAccessApps = function() {
        return Q.reject();
      };

      sinon.spy($state,'go');
      $state.get('common.auth.signin').controller[2]($state, canAccessApps);

      setTimeout(function() {
        $state.go.should.not.have.been.called;

        done();
      }, 10);
    });
  });
  
  describe('state apps.launcher:', function() {
    it('should register launcher state',function(){
      var state = $state.get('apps.launcher');
      expect(state).to.be.ok;
      expect(state.abstract).to.be.true;
      expect(state.template).to.equal('<div class="container app-launcher" ui-view></div>');
      expect(state.url).to.equal('?cid');
    });

    describe('launcher.home:', function() {
      it('should register launcher.home state',function(){
        var state = $state.get('apps.launcher.home');
        expect(state).to.be.ok;
        expect(state.url).to.equal('/');
        expect(state.controller).to.equal('HomeCtrl');
      });

      it('should redirect to onboarding', function(done) {
        var canAccessApps = function() {
          return Q.resolve();
        };
        var onboardingFactory = {
          isOnboarding: function() {
            return true;
          }
        };

        var $location = {
          replace: sinon.spy()
        };

        sinon.spy($state, 'go');
        $state.get('apps.launcher.home').resolve.canAccessApps[4]($state, $location, canAccessApps, onboardingFactory);

        setTimeout(function() {
          $location.replace.should.have.been.called;
          $state.go.should.have.been.calledWith('apps.launcher.onboarding');

          done();
        }, 10);
      });

      it('should not redirect to onboarding if not required', function(done) {
        var canAccessApps = function() {
          return Q.resolve();
        };
        var onboardingFactory = {
          isOnboarding: function() {
            return false;
          }
        };

        var $location = {
          replace: sinon.spy()
        };

        sinon.spy($state, 'go');
        $state.get('apps.launcher.home').resolve.canAccessApps[4]($state, $location, canAccessApps, onboardingFactory);

        setTimeout(function() {
          $location.replace.should.not.have.been.called;
          $state.go.should.not.have.been.called;

          done();
        }, 10);
      });

    });

    describe('launcher.onboarding:', function() {
      it('should register launcher.onboarding state',function(){
        var state = $state.get('apps.launcher.onboarding');
        expect(state).to.be.ok;
        expect(state.url).to.equal('/onboarding');
        expect(state.controller).to.equal('OnboardingCtrl');
      });

      it('should redirect to home if not showing onboarding', function(done) {
        var canAccessApps = function() {
          return Q.resolve();
        };
        var onboardingFactory = {
          isOnboarding: function() {
            return false;
          }
        };

        var $location = {
          replace: sinon.spy()
        };

        sinon.spy($state, 'go');
        $state.get('apps.launcher.onboarding').resolve.canAccessApps[4]($state, $location, canAccessApps, onboardingFactory);

        setTimeout(function() {
          $location.replace.should.have.been.called;
          $state.go.should.have.been.calledWith('apps.launcher.home');

          done();
        }, 10);
      });

      it('should not redirect to home', function(done) {
        var canAccessApps = function() {
          return Q.resolve();
        };
        var onboardingFactory = {
          isOnboarding: function() {
            return true;
          }
        };

        var $location = {
          replace: sinon.spy()
        };

        sinon.spy($state, 'go');
        $state.get('apps.launcher.onboarding').resolve.canAccessApps[4]($state, $location, canAccessApps, onboardingFactory);

        setTimeout(function() {
          $location.replace.should.not.have.been.called;
          $state.go.should.not.have.been.called;

          done();
        }, 10);
      });
    });
  });

  describe('showWhiteBackground:', function(){
    it('should show white background for onboarding page',function() {
      $rootScope.$broadcast('$stateChangeSuccess', {name:'apps.launcher.onboarding'});
      $rootScope.$digest();
      expect($rootScope.showWhiteBackground).to.be.true;
    });

    it('should not show white background for other pages',function() {
      $rootScope.$broadcast('$stateChangeSuccess', {name:'apps.launcher.home'});
      $rootScope.$digest();
      expect($rootScope.showWhiteBackground).to.be.false;
    });

  });
});
