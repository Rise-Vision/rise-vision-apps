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
        editorFactory = $injector.get('editorFactory');
        financialLicenseFactory = $injector.get('financialLicenseFactory');
        templateEditorFactory = $injector.get('templateEditorFactory');
      });
  });


  var $state, canAccessApps, editorFactory, financialLicenseFactory, templateEditorFactory;

  describe('state apps.editor.templates.edit:',function(){
    it('should register state',function(){
      var state = $state.get('apps.editor.templates.edit');
      expect(state).to.be.ok;
      expect(state.url).to.equal('/edit/:presentationId/:productId');
      expect(state.component).to.equal('ngTemplateEditor');
      expect(state.params).to.be.ok;
    });

    it('should only check access once', function(done) {
      $state.get('apps.editor.templates.edit').resolve.presentationInfo[5]({}, canAccessApps, editorFactory, templateEditorFactory, financialLicenseFactory);
      setTimeout(function() {
        canAccessApps.should.have.been.called.once;
        canAccessApps.should.have.been.calledWith();

        done();
      }, 10);
    });

    describe('showFinancialDataLicenseRequiredMessage:', function() {
      it('should show financial license required message', function(done) {
        financialLicenseFactory.needsFinancialDataLicense.returns(true);
        var $stateParams = {
          presentationId: 'new'
        }

        $state.get('apps.editor.templates.edit').resolve.presentationInfo[5]($stateParams, canAccessApps, editorFactory, templateEditorFactory, financialLicenseFactory);
        setTimeout(function() {
          financialLicenseFactory.needsFinancialDataLicense.should.have.been.called;
          financialLicenseFactory.showFinancialDataLicenseRequiredMessage.should.have.been.called;

          done();
        }, 10);
      });

      it('should not show financial license required message if no financial components exist', function(done) {
        financialLicenseFactory.needsFinancialDataLicense.returns(false);
        var $stateParams = {
          presentationId: 'new'
        }

        $state.get('apps.editor.templates.edit').resolve.presentationInfo[5]($stateParams, canAccessApps, editorFactory, templateEditorFactory, financialLicenseFactory);
        setTimeout(function() {
          financialLicenseFactory.needsFinancialDataLicense.should.have.been.called;
          financialLicenseFactory.showFinancialDataLicenseRequiredMessage.should.not.have.been.called;

          done();
        }, 10);
      });

      it('should not show financial license required message for existing templates', function(done) {
        financialLicenseFactory.needsFinancialDataLicense.returns(true);
        var $stateParams = {
          presentationId: 'existing id'
        }

        $state.get('apps.editor.templates.edit').resolve.presentationInfo[5]($stateParams, canAccessApps, editorFactory, templateEditorFactory, financialLicenseFactory);
        setTimeout(function() {
          financialLicenseFactory.needsFinancialDataLicense.should.not.have.been.called;
          financialLicenseFactory.showFinancialDataLicenseRequiredMessage.should.not.have.been.called;

          done();
        }, 10);

      });

    });

    it('should redirect to signup for templates', function(done) {
      var $stateParams = {
        presentationId: 'new',
        productId: 'productId'
      }

      $state.get('apps.editor.templates.edit').resolve.presentationInfo[5]($stateParams, canAccessApps, editorFactory, templateEditorFactory, financialLicenseFactory);
      setTimeout(function() {
        canAccessApps.should.have.been.calledWith(true);

        done();
      }, 10);
    });

    describe('states: ', function() {
      it('should retrieve presentation by id', function(done) {
        var $stateParams = {
          presentationId: 'presentationId'
        };

        $state.get('apps.editor.templates.edit').resolve.presentationInfo[5]($stateParams, canAccessApps, editorFactory, templateEditorFactory, financialLicenseFactory)
          .then(function() {
            templateEditorFactory.getPresentation.should.have.been.calledWith('presentationId');

            done();
          });
      });

      it('should not retrieve existing presentation', function(done) {
        var $stateParams = {
          presentationId: 'presentationId'
        };
        templateEditorFactory.presentation = {
          id: 'presentationId'
        };

        $state.get('apps.editor.templates.edit').resolve.presentationInfo[5]($stateParams, canAccessApps, editorFactory, templateEditorFactory, financialLicenseFactory)
          .then(function() {
            templateEditorFactory.getPresentation.should.not.have.been.called;

            done();
          });
      });

      it('should retrieve a different presentation', function(done) {
        var $stateParams = {
          presentationId: 'otherPresentationId'
        };
        templateEditorFactory.presentation = {
          id: 'presentationId'
        };

        $state.get('apps.editor.templates.edit').resolve.presentationInfo[5]($stateParams, canAccessApps, editorFactory, templateEditorFactory, financialLicenseFactory)
          .then(function() {
            templateEditorFactory.getPresentation.should.have.been.calledWith('otherPresentationId');

            done();
          });
      });

      it('should copy an already loaded template by productDetails', function(done) {
        var $stateParams = {
          presentationId: 'new',
          productId: 'presentationId',
          productDetails: 'productDetails'
        };

        $state.get('apps.editor.templates.edit').resolve.presentationInfo[5]($stateParams, canAccessApps, editorFactory, templateEditorFactory, financialLicenseFactory)
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

        $state.get('apps.editor.templates.edit').resolve.presentationInfo[5]($stateParams, canAccessApps, editorFactory, templateEditorFactory, financialLicenseFactory)
          .then(function() {
            editorFactory.addFromProductId.should.have.been.calledWith('templateId');

            done();
          });
      });

    });
  });

});
