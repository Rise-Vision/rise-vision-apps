'use strict';

describe('service: templateEditorFactory:', function() {
  var sandbox = sinon.sandbox.create();
  var presentationTracker = sandbox.spy();

  beforeEach(module('risevision.template-editor.services'));

  beforeEach(module(function ($provide) {
    $provide.service('$q', function() {return Q;});

    $provide.service('presentation',function () {
      return {
        add : sinon.stub().returns(Q.resolve()),
        update : function() {},
        get: function() {},
        delete: function () {},
        publish: function () {}
      };
    });

    $provide.service('$state',function() {
      return {
        go: sandbox.stub().returns(Q.resolve())
      };
    });

    $provide.service('userState', function() {
      return {
        getUsername: function() {
          return 'testusername';
        },
        _restoreState: function() {}
      };
    });

    $provide.service('processErrorCode', function() {
      return sandbox.spy(function() { return 'error'; });
    });

    $provide.factory('templateEditorUtils', function() {
      return {
        showMessageWindow: sandbox.stub()
      };
    });

    $provide.factory('blueprintFactory', function() {
      return blueprintFactory = {
        blueprintData: {},
        getBlueprintCached: function() {
          return Q.resolve(blueprintFactory.blueprintData);
        }
      };
    });

    $provide.factory('scheduleFactory', function() {
      return {
        hasSchedules: sandbox.stub().returns(true)
      };
    });

    $provide.factory('brandingFactory', function() {
      return {
        isRevised: sandbox.stub().returns(false),
        publishBranding: sandbox.stub(),
        saveBranding: sandbox.stub()
      };
    });

    $provide.factory('presentationTracker', function() {
      return presentationTracker;
    });

    $provide.service('createFirstSchedule', function() {
      return sandbox.stub();
    });

    $provide.factory('scheduleSelectorFactory', function() {
      return {
        checkAssignedToSchedules: sandbox.stub().returns(Q.resolve())
      };
    });

  }));

  var $state, templateEditorFactory, templateEditorUtils, blueprintFactory, presentation, processErrorCode,
    HTML_PRESENTATION_TYPE, storeProduct, createFirstSchedule, scheduleFactory, brandingFactory, scheduleSelectorFactory;

  beforeEach(function() {
    inject(function($injector) {
      $state = $injector.get('$state');
      templateEditorFactory = $injector.get('templateEditorFactory');

      presentation = $injector.get('presentation');
      createFirstSchedule = $injector.get('createFirstSchedule');
      scheduleFactory = $injector.get('scheduleFactory');
      brandingFactory = $injector.get('brandingFactory');
      storeProduct = $injector.get('storeProduct');
      templateEditorUtils = $injector.get('templateEditorUtils');
      processErrorCode = $injector.get('processErrorCode');
      scheduleSelectorFactory = $injector.get('scheduleSelectorFactory');
      HTML_PRESENTATION_TYPE = $injector.get('HTML_PRESENTATION_TYPE');
    });
  });

  afterEach(function() {
    sandbox.restore();
  });

  it('should initialize', function() {
    expect(templateEditorFactory).to.be.ok;

    expect(templateEditorFactory.presentation).to.be.a('object');
    expect(templateEditorFactory.loadingPresentation).to.be.false;
    expect(templateEditorFactory.savingPresentation).to.be.false;
    expect(templateEditorFactory.apiError).to.not.be.ok;

    expect(templateEditorFactory.getPresentation).to.be.a('function');
    expect(templateEditorFactory.addPresentation).to.be.a('function');
  });

  describe('addFromProduct:', function() {
    it('should create a new presentation', function(done) {
      blueprintFactory.blueprintData.components = [
        {
          type: 'rise-image',
          id: 'rise-image-01',
          attributes: {}
        }
      ];

      templateEditorFactory.addFromProduct({ productCode: 'test-id', name: 'Test HTML Template' }).then(function () {
        expect(presentation.add).to.have.been.called;

        expect(templateEditorFactory.presentation.id).to.be.undefined;
        expect(templateEditorFactory.presentation.productCode).to.equal('test-id');
        expect(templateEditorFactory.presentation.name).to.equal('Copy of Test HTML Template');
        expect(templateEditorFactory.presentation.presentationType).to.equal(HTML_PRESENTATION_TYPE);
        expect(presentationTracker).to.have.been.calledWith('HTML Template Copied', 'test-id', 'Test HTML Template');

        done();
      });
    });
  });

  describe('isUnsaved: ', function() {
    it('should return false if neither factory hasUnsavedChanges', function() {
      expect(templateEditorFactory.isUnsaved()).to.be.false;
    });

    it('should return true if this factory hasUnsavedChanges', function() {
      templateEditorFactory.hasUnsavedChanges = true;

      expect(templateEditorFactory.isUnsaved()).to.be.true;
    });

    it('should return true if branding hasUnsavedChanges', function() {
      brandingFactory.hasUnsavedChanges = true;

      expect(templateEditorFactory.isUnsaved()).to.be.true;
    });

    it('should return true if both factories have UnsavedChanges', function() {
      templateEditorFactory.hasUnsavedChanges = true;
      brandingFactory.hasUnsavedChanges = true;

      expect(templateEditorFactory.isUnsaved()).to.be.true;
    });
  });

  describe('save: ', function() {
    beforeEach(function() {
      presentation.add.returns(Q.resolve({
        item: {
          name: 'Test Presentation',
          id: 'presentationId',
          productCode: 'test-id'
        }
      }));

      sandbox.stub(presentation, 'update').returns(Q.resolve({
        item: {
          name: 'Test Presentation',
          id: 'presentationId'
        }
      }));

      templateEditorFactory.presentation.templateAttributeData = {};
    });

    it('should wait for both promises to resolve', function(done) {
      var addTemplateDeferred = Q.defer();
      var saveBrandingDeferred = Q.defer();
      presentation.add.returns(addTemplateDeferred.promise);
      brandingFactory.saveBranding.returns(saveBrandingDeferred.promise);

      templateEditorFactory.save();

      presentation.add.should.have.been.called;
      brandingFactory.saveBranding.should.have.been.called;

      expect(templateEditorFactory.savingPresentation).to.be.true;

      addTemplateDeferred.resolve({
        item: {
          name: 'Test Presentation',
          id: 'presentationId'
        }
      });

      setTimeout(function() {
        expect(templateEditorFactory.savingPresentation).to.be.true;  

        saveBrandingDeferred.resolve();
        
        setTimeout(function() {
          expect(templateEditorFactory.savingPresentation).to.be.false;  

          done();
        });
      });
    });

    describe('save Template: ', function() {
      it('should add the presentation if it is new', function(done) {
        templateEditorFactory.save()
          .then(function() {
            presentation.add.should.have.been.called;
            presentation.update.should.not.have.been.called;

            done();
          })
          .then(null, function(err) {
            done(err);
          })
          .then(null, done);
      });

      it('should update the presentation if it is existing', function(done) {
        templateEditorFactory.presentation.id = 'presentationId';
        templateEditorFactory.hasUnsavedChanges = true;

        templateEditorFactory.save()
          .then(function() {
            presentation.add.should.not.have.been.called;
            presentation.update.should.have.been.called;

            done();
          })
          .then(null, function(err) {
            done(err);
          })
          .then(null, done);
      });

      it('should save the presentation', function(done) {
        templateEditorFactory.save()
          .then(function() {
            presentation.add.should.have.been.called;

            setTimeout(function() {
              expect(templateEditorFactory.savingPresentation).to.be.false;
              expect(templateEditorFactory.loadingPresentation).to.be.false;
              expect(templateEditorFactory.errorMessage).to.not.be.ok;
              expect(templateEditorFactory.apiError).to.not.be.ok;

              done();
            },10);
          })
          .then(null, function(err) {
            done(err);
          })
          .then(null, done);

          expect(templateEditorUtils.showMessageWindow).to.not.have.been.called;
          expect(templateEditorFactory.savingPresentation).to.be.true;
          expect(templateEditorFactory.loadingPresentation).to.be.true;
      });

      it('should show an error if fails to add the presentation', function(done) {
        presentation.add.returns(Q.reject());

        templateEditorFactory.save()
          .then(null, function(e) {
            expect(templateEditorFactory.errorMessage).to.be.ok;
            expect(templateEditorFactory.apiError).to.be.ok;
            expect(templateEditorUtils.showMessageWindow).to.have.been.called;

            setTimeout(function() {
              expect(templateEditorFactory.savingPresentation).to.be.false;
              expect(templateEditorFactory.loadingPresentation).to.be.false;

              done();
            }, 10);
          });
      });

      it('should show an error if fails to update the presentation', function(done) {
        templateEditorFactory.presentation.id = 'presentationId';
        templateEditorFactory.hasUnsavedChanges = true;

        presentation.update.returns(Q.reject());

        templateEditorFactory.save()
          .then(null, function(e) {
            expect(templateEditorFactory.errorMessage).to.be.ok;
            expect(templateEditorFactory.apiError).to.be.ok;
            expect(templateEditorUtils.showMessageWindow).to.have.been.called;

            setTimeout(function() {
              expect(templateEditorFactory.savingPresentation).to.be.false;
              expect(templateEditorFactory.loadingPresentation).to.be.false;

              done();
            }, 10);
          });
      });

    });

    describe('addPresentation:',function(){
      it('should add the presentation',function(done){
        templateEditorFactory.addPresentation()
          .then(function() {
            expect($state.go).to.have.been.calledWith('apps.editor.templates.edit');
            expect(presentation.add.getCall(0).args[0].templateAttributeData).to.equal('{}');
            expect(templateEditorFactory.presentation.templateAttributeData).to.deep.equal({});
            expect(presentationTracker).to.have.been.calledWith('Presentation Created', 'presentationId', 'Test Presentation', {
              presentationType: 'HTML Template',
              sharedTemplate: 'test-id'
            });

            done();
          })
          .then(null, function(err) {
            done(err);
          })
          .then(null, done);
      });

    });

    describe('updatePresentation:',function(){
      it('should not update the presentation if it does not have unsaved changes',function(){
        templateEditorFactory.updatePresentation();
        
        presentation.update.should.not.have.been.called;
      });

      it('should still resolve it does not have unsaved changes',function(done){
        templateEditorFactory.updatePresentation().then(function() {
          presentation.update.should.not.have.been.called;

          done();
        });      
      });

      it('should update the presentation if it has unsaved changes',function(){
        templateEditorFactory.hasUnsavedChanges = true;
        templateEditorFactory.updatePresentation();
        
        presentation.update.should.have.been.called;
      });

      it('should update the presentation',function(done){
        templateEditorFactory.hasUnsavedChanges = true;
        templateEditorFactory.updatePresentation()
          .then(function() {
            expect(presentation.update.getCall(0).args[1].templateAttributeData).to.equal('{}');
            expect(templateEditorFactory.presentation.templateAttributeData).to.deep.equal({});
            expect(presentationTracker).to.have.been.calledWith('Presentation Updated', 'presentationId', 'Test Presentation');

            done();
          })
          .then(null, function(err) {
            done(err);
          })
          .then(null, done);
      });

    });

    describe('saveBranding: ', function() {
      it('should save the branding settings', function() {
        templateEditorFactory.save();

        brandingFactory.saveBranding.should.have.been.called;
      });

      it('should show an error if fails to save the branding', function(done) {
        brandingFactory.saveBranding.returns(Q.reject());

        templateEditorFactory.save()
          .then(null, function(e) {
            expect(templateEditorFactory.errorMessage).to.be.ok;
            expect(templateEditorFactory.apiError).to.be.ok;
            expect(templateEditorUtils.showMessageWindow).to.have.been.called;

            setTimeout(function() {
              expect(templateEditorFactory.savingPresentation).to.be.false;
              expect(templateEditorFactory.loadingPresentation).to.be.false;

              done();
            }, 10);
          });
      });
    });    

  });

  describe('getPresentation:', function() {
    it('should get the presentation', function(done) {
      sandbox.stub(presentation, 'get').returns(Q.resolve({
        item: {
          name: 'Test Presentation',
          productCode: 'test-id',
          templateAttributeData: '{ "attribute1": "value1" }'
        }
      }));

      blueprintFactory.blueprintData.components = [
        {
          type: 'rise-image',
          id: 'rise-image-01',
          attributes: {}
        }
      ];

      templateEditorFactory.getPresentation('presentationId')
      .then(function() {
        expect(templateEditorFactory.presentation).to.be.truely;
        expect(templateEditorFactory.presentation.name).to.equal('Test Presentation');
        expect(templateEditorFactory.presentation.templateAttributeData.attribute1).to.equal('value1');

        setTimeout(function() {
          expect(templateEditorFactory.loadingPresentation).to.be.false;
          expect($state.go).to.not.have.been.called;

          done();
        }, 10);
      })
      .then(null, function(err) {
        done(err);
      })
      .then(null, done);
    });

    it('should get the presentation with invalid JSON data', function(done) {
      sandbox.stub(presentation, 'get').returns(Q.resolve({
        item: {
          templateAttributeData: '\\',
          productCode: 'test-id'
        }
      }));

      templateEditorFactory.getPresentation('presentationId')
      .then(function() {
        expect(templateEditorFactory.presentation).to.be.truely;
        expect(templateEditorFactory.presentation.templateAttributeData).to.be.truely;

        setTimeout(function() {
          done();
        }, 10);
      })
      .then(null, function(err) {
        done(err);
      })
      .then(null, done);
    });

    it('should handle failure to get presentation correctly', function(done) {
      sandbox.stub(presentation, 'get').returns(Q.reject({ name: 'Test Presentation' }));

      templateEditorFactory.getPresentation()
      .then(function(result) {
        done(result);
      })
      .then(null, function(e) {
        expect(e).to.be.ok;
        expect(templateEditorFactory.errorMessage).to.be.ok;
        expect(templateEditorFactory.errorMessage).to.equal('Failed to get Presentation.');

        processErrorCode.should.have.been.calledWith('Presentation', 'get', e);
        expect(templateEditorFactory.apiError).to.be.ok;
        expect(templateEditorUtils.showMessageWindow).to.have.been.called;

        setTimeout(function() {
          expect(templateEditorFactory.loadingPresentation).to.be.false;
          expect($state.go).to.not.have.been.called;

          done();
        }, 10);
      })
      .then(null, done);
    });

    it('should handle failure to load blueprint.json correctly', function(done) {
      sandbox.stub(presentation, 'get').returns(Q.resolve({
        item: {
          name: 'Test Presentation',
          productCode: 'test-id',
          templateAttributeData: '{ "attribute1": "value1" }'
        }
      }));
      sandbox.stub(blueprintFactory, 'getBlueprintCached').rejects();

      templateEditorFactory.getPresentation('presentationId')
      .then(function() {
        done('Should not succeed');
      })
      .then(null, function(err) {
        setTimeout(function() {
          expect(templateEditorFactory.presentation).to.not.be.ok;

          done();
        });
      });
    });

  });

  describe('deletePresentation:', function() {
    beforeEach(function () {
      sandbox.stub(presentation, 'get').returns(Q.resolve({
        item: {
          id: 'presentationId',
          name: 'Test Presentation',
          productCode: 'test-id'
        }
      }));
    });

    it('should delete the presentation', function(done) {
      sandbox.stub(presentation, 'delete').returns(Q.resolve());

      templateEditorFactory.getPresentation('presentationId')
        .then(templateEditorFactory.deletePresentation.bind(templateEditorFactory))
        .then(function() {
          expect(templateEditorUtils.showMessageWindow).to.not.have.been.called;
          expect(templateEditorFactory.savingPresentation).to.be.true;
          expect(templateEditorFactory.loadingPresentation).to.be.true;

          setTimeout(function() {
            expect($state.go).to.have.been.calledWith('apps.editor.list');
            expect(presentation.delete.getCall(0).args[0]).to.equal('presentationId');
            expect(templateEditorFactory.savingPresentation).to.be.false;
            expect(templateEditorFactory.loadingPresentation).to.be.false;
            expect(templateEditorFactory.errorMessage).to.not.be.ok;
            expect(templateEditorFactory.apiError).to.not.be.ok;
            expect(presentationTracker).to.have.been.calledWith('Presentation Deleted', 'presentationId', 'Test Presentation');

            done();
          },10);
        })
        .then(null, function(err) {
          done(err);
        })
        .then(null, done);
    });

    it('should fail to delete the presentation', function(done) {
      sandbox.stub(presentation, 'delete').returns(Q.reject());

      templateEditorFactory.getPresentation('presentationId')
        .then(function () {
          return templateEditorFactory.deletePresentation();
        })
        .then(null, function(e) {
          setTimeout(function() {
            expect(presentation.delete.getCall(0).args[0]).to.equal('presentationId');
            expect(processErrorCode).to.have.been.calledWith('Presentation', 'delete', e);
            expect(templateEditorUtils.showMessageWindow).to.have.been.called;
            expect($state.go).to.not.have.been.called;
            expect(templateEditorFactory.apiError).to.be.ok;
            expect(templateEditorFactory.savingPresentation).to.be.false;
            expect(templateEditorFactory.loadingPresentation).to.be.false;

            done();
          }, 10);
        });
    });
  });

  describe('isRevised:', function() {
    beforeEach(function() {
      templateEditorFactory.presentation = {};
    });

    it('should default to false', function() {
      expect(templateEditorFactory.isRevised()).to.be.false;
    });

    it('should not be revised if published', function() {
      templateEditorFactory.presentation.revisionStatusName = 'Published';

      expect(templateEditorFactory.isRevised()).to.be.false;
    });

    it('should be revised with revision status Revised', function() {
      templateEditorFactory.presentation.revisionStatusName = 'Revised';

      expect(templateEditorFactory.isRevised()).to.be.true;
    });
  });

  describe('isPublishDisabled: ', function() {
    beforeEach(function() {
      templateEditorFactory.presentation.revisionStatusName = 'Published';
      templateEditorFactory.savingPresentation = false;
      templateEditorFactory.hasUnsavedChanges = false;
    });

    it('should return true if neither factory isRevised', function() {
      expect(templateEditorFactory.isPublishDisabled()).to.be.true;
    });

    it('should return false if this factory hasUnsavedChanges', function() {
      templateEditorFactory.presentation.revisionStatusName = 'Revised';

      expect(templateEditorFactory.isPublishDisabled()).to.be.false;
    });

    it('should return false if branding hasUnsavedChanges', function() {
      brandingFactory.isRevised.returns(true);

      expect(templateEditorFactory.isPublishDisabled()).to.be.false;
    });

    it('should return false if both factories have UnsavedChanges', function() {
      templateEditorFactory.presentation.revisionStatusName = 'Revised';
      brandingFactory.isRevised.returns(true);

      expect(templateEditorFactory.isPublishDisabled()).to.be.false;
    });

    it('should return true if factory hasUnsavedChanges', function() {
      templateEditorFactory.presentation.revisionStatusName = 'Revised';
      brandingFactory.isRevised.returns(true);

      templateEditorFactory.hasUnsavedChanges = true;

      expect(templateEditorFactory.isPublishDisabled()).to.be.true;
    });

    it('should return true if factory is saving', function() {
      templateEditorFactory.presentation.revisionStatus = 'Revised';
      brandingFactory.isRevised.returns(true);

      templateEditorFactory.savingPresentation = true;

      expect(templateEditorFactory.isPublishDisabled()).to.be.true;
    });

  });

  describe('publish: ', function() {
    beforeEach(function (done) {
      createFirstSchedule.returns(Q.resolve());
      sandbox.stub(presentation, 'get').returns(Q.resolve({
        item: {
          id: 'presentationId',
          name: 'Test Presentation',
          productCode: 'test-id',
          revisionStatusName: 'Revised'
        }
      }));

      templateEditorFactory.getPresentation('presentationId').then(function() {
        // allow get.finally to execute so flags are reset
        setTimeout(done);
      });
    });

    it('should wait for both promises to resolve', function(done) {
      var publishTemplateDeferred = Q.defer();
      var publishBrandingDeferred = Q.defer();
      sandbox.stub(presentation, 'publish').returns(publishTemplateDeferred.promise);
      brandingFactory.publishBranding.returns(publishBrandingDeferred.promise);

      templateEditorFactory.publish();
      setTimeout(function() {
        presentation.publish.should.have.been.called;
        brandingFactory.publishBranding.should.have.been.called;

        expect(templateEditorFactory.savingPresentation).to.be.true;

        publishTemplateDeferred.resolve();

        setTimeout(function() {
          expect(templateEditorFactory.savingPresentation).to.be.true;  

          publishBrandingDeferred.resolve();
          
          setTimeout(function() {
            expect(templateEditorFactory.savingPresentation).to.be.false;  

            done();
          });
        });
      });

    });

    describe('publishTemplate: ', function() {
      beforeEach(function() {
        sandbox.stub(presentation, 'publish').returns(Q.resolve());
      });
      it('should not publish the presentation if it is not revised', function(done) {
        sandbox.stub(templateEditorFactory, 'isRevised').returns(false);

        templateEditorFactory.publish()
          .then(function() {
            presentation.publish.should.not.have.been.called;

            done();
          })
          .then(null, function(err) {
            done(err);
          })
          .then(null, done);
      });

      it('should publish the presentation', function(done) {
        var timeBeforePublish = new Date();

        templateEditorFactory.publish()
          .then(function() {
            expect(templateEditorUtils.showMessageWindow).to.not.have.been.called;
            expect(templateEditorFactory.savingPresentation).to.be.true;
            expect(templateEditorFactory.loadingPresentation).to.be.true;

            setTimeout(function() {
              expect(templateEditorFactory.presentation.revisionStatusName).to.equal('Published');
              expect(templateEditorFactory.presentation.changeDate).to.be.gte(timeBeforePublish);
              expect(templateEditorFactory.presentation.changedBy).to.equal("testusername");
              expect(templateEditorFactory.savingPresentation).to.be.false;
              expect(templateEditorFactory.loadingPresentation).to.be.false;
              expect(templateEditorFactory.errorMessage).to.not.be.ok;
              expect(templateEditorFactory.apiError).to.not.be.ok;
              expect(presentationTracker).to.have.been.calledWith('Presentation Published', 'presentationId', 'Test Presentation');

              done();
            },10);
          })
          .then(null, function(err) {
            done(err);
          })
          .then(null, done);
      });

      it('should show an error if fails to publish the presentation', function(done) {
        presentation.publish.returns(Q.reject());

        templateEditorFactory.publish()
          .then(null, function(e) {
            setTimeout(function() {
              expect(templateEditorFactory.savingPresentation).to.be.false;
              expect(templateEditorFactory.loadingPresentation).to.be.false;
              expect(templateEditorFactory.errorMessage).to.be.ok;
              expect(templateEditorFactory.apiError).to.be.ok;
              expect(templateEditorUtils.showMessageWindow).to.have.been.called;

              done();
            }, 10);
          });
      });

      it('should create first Schedule when publishing first presentation and show modal', function(done) {
        templateEditorFactory.publish()
          .then(function() {
            setTimeout(function() {
              createFirstSchedule.should.have.been.calledWith(templateEditorFactory.presentation);

              done();
            });
          })
          .then(null, function(err) {
            done(err);
          })
          .then(null, done);
      });

      it('should create first Schedule and show modal even if not revised', function(done) {
        sandbox.stub(templateEditorFactory, 'isRevised').returns(false);

        templateEditorFactory.publish()
          .then(function() {
            setTimeout(function() {
              createFirstSchedule.should.have.been.calledWith(templateEditorFactory.presentation);

              done();
            });
          })
          .then(null, function(err) {
            done(err);
          })
          .then(null, done);
      });

    });

    describe('publishBranding: ', function() {
      beforeEach(function() {
        sandbox.stub(presentation, 'publish').returns(Q.resolve());
      });

      it('should publish the branding settings', function(done) {
        templateEditorFactory.publish().then(function(){
          brandingFactory.publishBranding.should.have.been.called;
          done();
        });
      });

      it('should show an error if fails to publish the presentation', function(done) {
        brandingFactory.publishBranding.returns(Q.reject());

        templateEditorFactory.publish()
          .then(null, function(e) {
            setTimeout(function() {
              expect(templateEditorFactory.savingPresentation).to.be.false;
              expect(templateEditorFactory.loadingPresentation).to.be.false;
              expect(templateEditorFactory.errorMessage).to.be.ok;
              expect(templateEditorFactory.apiError).to.be.ok;
              expect(templateEditorUtils.showMessageWindow).to.have.been.called;

              done();
            }, 10);
          });
      });
    });    

  });


  describe('getAttributeData', function () {

    beforeEach(function(){
      templateEditorFactory.presentation = { templateAttributeData: {} };
    });

    it('should get empty attribute data',function() {
      var data = templateEditorFactory.getAttributeData('test-id');

      expect(data).to.deep.equal({ id: 'test-id' });
    });

    it('should not update templateAttributeData on get',function() {
      templateEditorFactory.getAttributeData('test-id');

      expect(templateEditorFactory.presentation.templateAttributeData).to.deep.equal({});
    });

    it('should get undefined attribute data value',function() {
      var data = templateEditorFactory.getAttributeData('test-id', 'symbols');

      expect(data).to.not.be.ok;
    });

  });

  describe('setAttributeData', function () {

    beforeEach(function(){
      templateEditorFactory.presentation = { templateAttributeData: {} };
    });

    it('should set an attribute data value',function() {
      templateEditorFactory.setAttributeData('test-id', 'symbols', 'CADUSD=X|MXNUSD=X');

      expect(templateEditorFactory.presentation.templateAttributeData).to.deep.equal({
        components: [
          {
            id: 'test-id',
            symbols: 'CADUSD=X|MXNUSD=X'
          }
        ]
      });
    });

    it('should get an attribute data value',function() {
      templateEditorFactory.setAttributeData('test-id', 'symbols', 'CADUSD=X|MXNUSD=X');

      var data = templateEditorFactory.getAttributeData('test-id', 'symbols');

      expect(data).to.equal('CADUSD=X|MXNUSD=X');
    });

    it('should get attribute data',function() {
      templateEditorFactory.setAttributeData('test-id', 'symbols', 'CADUSD=X|MXNUSD=X');

      var data = templateEditorFactory.getAttributeData('test-id');

      expect(data).to.deep.equal({
        id: 'test-id',
        symbols: 'CADUSD=X|MXNUSD=X'
      });
    });

  });
  
});
