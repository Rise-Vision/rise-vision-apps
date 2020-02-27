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

      });

      inject(function ($injector) {
        $state = $injector.get('$state');
        canAccessApps = $injector.get('canAccessApps');
        checkTemplateAccess = $injector.get('checkTemplateAccess');
        editorFactory = $injector.get('editorFactory');
        financialLicenseFactory = $injector.get('financialLicenseFactory');
        templateEditorFactory = $injector.get('templateEditorFactory');
      });
  });


  var $state, canAccessApps, checkTemplateAccess, editorFactory, financialLicenseFactory, templateEditorFactory;

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

});
