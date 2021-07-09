import { expect } from 'chai';
import { TestBed } from '@angular/core/testing';

import { TemplateEditorService } from './template-editor.service';
import { PromiseUtilsService } from 'src/app/shared/services/promise-utils.service';
import { AjsState, BrandingFactory, CreateFirstScheduleService, PresentationService, PresentationTracker, ProcessErrorCode, ScheduleFactory, ScheduleSelectorFactory, UserState } from 'src/app/ajs-upgraded-providers';
import { BroadcasterService } from 'src/app/shared/services/broadcaster.service';
import * as Q from 'q';
import { BlueprintService } from './blueprint.service';
import { TemplateEditorUtilsService } from './template-editor-utils.service';
import { assert } from 'sinon';

describe('TemplateEditorService', () => {
  let templateEditorFactory: TemplateEditorService;

  var sandbox = sinon.sandbox.create();
  var presentationTracker = sandbox.spy();
  var $state, userState, templateEditorUtils, blueprintFactory, presentation, processErrorCode, broadcasterService,
  createFirstSchedule, scheduleFactory, brandingFactory, scheduleSelectorFactory;


  beforeEach(() => {
    presentation =  {
      add : sinon.stub().resolves(),
      update : function() {},
      get: function() {},
      delete: function () {},
      publish: function () {}
    };
    
    $state = {
      go: sandbox.stub().resolves()
    };
    
    userState = {
      getUsername: function() {
        return 'testusername';
      }, 
      hasRole: sandbox.stub().returns(true),
      _restoreState: function() {}
    };
    
    processErrorCode = sandbox.spy(function() { return 'error'; });

    templateEditorUtils = {      
      showMessageWindow: sandbox.stub()
    };
    
    blueprintFactory = {
      blueprintData: {},
      getBlueprintCached: function() {
        return Promise.resolve(blueprintFactory.blueprintData);
      }
    };
    
    scheduleFactory = {
      hasSchedules: sandbox.stub().returns(true)
    };

    brandingFactory = {
      isRevised: sandbox.stub().returns(false),
      publishBranding: sandbox.stub(),
      saveBranding: sandbox.stub()
    };

    broadcasterService = {
      emit: sandbox.stub()
    };
    
    createFirstSchedule = sandbox.stub();

    scheduleSelectorFactory = {
      checkAssignedToSchedules: sandbox.stub().resolves(),
      loadSelectedSchedules: sandbox.stub().resolves()
    };

    TestBed.configureTestingModule({
      providers: [
        {provide: AjsState, useValue: $state},
        {provide: BroadcasterService, useValue: broadcasterService},
        {provide: PresentationService, useValue: presentation },
        {provide: ProcessErrorCode, useValue: processErrorCode},
        {provide: UserState, useValue: userState},
        {provide: CreateFirstScheduleService, useValue: createFirstSchedule},
        {provide: TemplateEditorUtilsService, useValue: templateEditorUtils },
        {provide: BrandingFactory, useValue: brandingFactory},
        {provide: BlueprintService, useValue: blueprintFactory},
        {provide: ScheduleFactory, useValue: scheduleFactory},
        {provide: PresentationTracker, useValue: presentationTracker},
        {provide: ScheduleSelectorFactory, useValue: scheduleSelectorFactory},
        {provide: PromiseUtilsService, useValue: new PromiseUtilsService()} 
      ]
    });
    templateEditorFactory = TestBed.inject(TemplateEditorService);
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

  describe('hasContentEditorRole:', function() {
    it('should check role and return result', function() {
      expect(templateEditorFactory.hasContentEditorRole()).to.be.true;

      userState.hasRole.should.have.been.calledWith('ce');
    });
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
        presentation.add.should.have.been.called;

        expect(templateEditorFactory.presentation.id).to.be.undefined;
        expect(templateEditorFactory.presentation.productCode).to.equal('test-id');
        expect(templateEditorFactory.presentation.name).to.equal('Copy of Test HTML Template');
        expect(templateEditorFactory.presentation.presentationType).to.equal(TemplateEditorService.HTML_PRESENTATION_TYPE);
        presentationTracker.should.have.been.calledWith('HTML Template Copied', 'test-id', 'Test HTML Template');

        done();
      });
    });

    it('should handle failure to create a new presentation', function(done) {
      sandbox.stub(blueprintFactory, 'getBlueprintCached').returns(Q.reject('error'));

      templateEditorFactory.addFromProduct({})
        .then(done)
        .catch(function (err) {
          console.log(err)

          expect(err).to.equal('error');

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
            assert.fail(err);
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
            assert.fail(err);
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
            assert.fail(err);
          })
          .then(null, done);

          templateEditorUtils.showMessageWindow.should.not.have.been.called;
          expect(templateEditorFactory.savingPresentation).to.be.true;
          expect(templateEditorFactory.loadingPresentation).to.be.true;
      });

      it('should show an error if fails to add the presentation', function(done) {
        presentation.add.returns(Q.reject());

        templateEditorFactory.save()
          .then(null, function(e) {
            expect(templateEditorFactory.errorMessage).to.be.ok;
            expect(templateEditorFactory.apiError).to.be.ok;
            templateEditorUtils.showMessageWindow.should.have.been.called;

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
            templateEditorUtils.showMessageWindow.should.have.been.called;

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
            $state.go.should.have.been.calledWith('apps.editor.templates.edit');
            expect(presentation.add.getCall(0).args[0].templateAttributeData).to.equal('{}');
            expect(templateEditorFactory.presentation.templateAttributeData).to.deep.equal({});
            presentationTracker.should.have.been.calledWith('Presentation Created', 'presentationId', 'Test Presentation', {
              presentationType: 'HTML Template',
              sharedTemplate: 'test-id'
            });

            done();
          })
          .then(null, function(err) {
            assert.fail(err);
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
            presentationTracker.should.have.been.calledWith('Presentation Updated', 'presentationId', 'Test Presentation');

            done();
          })
          .then(null, function(err) {
            assert.fail(err);
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
            templateEditorUtils.showMessageWindow.should.have.been.called;

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
        expect(templateEditorFactory.presentation).to.exist;
        expect(templateEditorFactory.presentation.name).to.equal('Test Presentation');
        expect(templateEditorFactory.presentation.templateAttributeData.attribute1).to.equal('value1');

        setTimeout(function() {
          expect(templateEditorFactory.loadingPresentation).to.be.false;
          $state.go.should.not.have.been.called;

          done();
        }, 10);
      })
      .then(null, function(err) {
        assert.fail(err);
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
        expect(templateEditorFactory.presentation).to.exist;
        expect(templateEditorFactory.presentation.templateAttributeData).to.exist;

        setTimeout(function() {
          done();
        }, 10);
      })
      .then(null, function(err) {
        assert.fail(err);
      })
      .then(null, done);
    });

    it('should handle failure to get presentation correctly', function(done) {
      sandbox.stub(presentation, 'get').returns(Q.reject({ name: 'Test Presentation' }));

      templateEditorFactory.getPresentation()
      .then(function(result:any) {
        assert.fail(result);
      })
      .then(null, function(e) {
        expect(e).to.be.ok;
        expect(templateEditorFactory.errorMessage).to.be.ok;
        expect(templateEditorFactory.errorMessage).to.equal('Failed to get Presentation.');

        processErrorCode.should.have.been.calledWith('Presentation', 'get', e);
        expect(templateEditorFactory.apiError).to.be.ok;
        templateEditorUtils.showMessageWindow.should.have.been.called;

        setTimeout(function() {
          expect(templateEditorFactory.loadingPresentation).to.be.false;
          $state.go.should.not.have.been.called;

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
        assert.fail('Should not succeed');
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
      sandbox.stub(presentation, 'delete').resolves();

      templateEditorFactory.getPresentation('presentationId')
        .then(templateEditorFactory.deletePresentation.bind(templateEditorFactory))
        .then(function() {
          templateEditorUtils.showMessageWindow.should.not.have.been.called;
          expect(templateEditorFactory.savingPresentation).to.be.true;
          expect(templateEditorFactory.loadingPresentation).to.be.true;

          setTimeout(function() {
            $state.go.should.have.been.calledWith('apps.editor.list');
            expect(presentation.delete.getCall(0).args[0]).to.equal('presentationId');
            expect(templateEditorFactory.savingPresentation).to.be.false;
            expect(templateEditorFactory.loadingPresentation).to.be.false;
            expect(templateEditorFactory.errorMessage).to.not.be.ok;
            expect(templateEditorFactory.apiError).to.not.be.ok;
            presentationTracker.should.have.been.calledWith('Presentation Deleted', 'presentationId', 'Test Presentation');

            done();
          },10);
        })
        .then(null, function(err) {
          assert.fail(err);
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
            processErrorCode.should.have.been.calledWith('Presentation', 'delete', e);
            templateEditorUtils.showMessageWindow.should.have.been.called;
            $state.go.should.not.have.been.called;
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
      createFirstSchedule.resolves();
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
        sandbox.stub(presentation, 'publish').resolves();
      });
      it('should not publish the presentation if it is not revised', function(done) {
        sandbox.stub(templateEditorFactory, 'isRevised').returns(false);

        templateEditorFactory.publish()
          .then(function() {
            presentation.publish.should.not.have.been.called;

            done();
          })
          .then(null, function(err) {
            assert.fail(err);
          })
          .then(null, done);
      });

      it('should publish the presentation', function(done) {
        var timeBeforePublish = new Date();

        templateEditorFactory.publish()
          .then(function() {
            templateEditorUtils.showMessageWindow.should.not.have.been.called;
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
              presentationTracker.should.have.been.calledWith('Presentation Published', 'presentationId', 'Test Presentation');

              done();
            },10);
          })
          .then(null, function(err) {
            assert.fail(err);
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
              templateEditorUtils.showMessageWindow.should.have.been.called;

              done();
            }, 10);
          });
      });

      describe('createFirstSchedule:', function() {
        it('should create first Schedule when publishing first presentation and show modal', function(done) {
          templateEditorFactory.publish()
            .then(function() {
              setTimeout(function() {
                createFirstSchedule.should.have.been.calledWith(templateEditorFactory.presentation);

                scheduleSelectorFactory.loadSelectedSchedules.should.have.been.called;

                done();
              });
            })
            .then(null, function(err) {
              assert.fail(err);
            })
            .then(null, done);
        });

        it('should create first Schedule and show modal even if not revised', function(done) {
          sandbox.stub(templateEditorFactory, 'isRevised').returns(false);

          templateEditorFactory.publish()
            .then(function() {
              setTimeout(function() {
                createFirstSchedule.should.have.been.calledWith(templateEditorFactory.presentation);

                scheduleSelectorFactory.loadSelectedSchedules.should.have.been.called;

                done();
              });
            })
            .then(null, function(err) {
              assert.fail(err);
            })
            .then(null, done);
        });        

        it('should handle case when a first schedule exists', function(done) {
          sandbox.stub(templateEditorFactory, 'isRevised').returns(false);
          createFirstSchedule.returns(Q.reject('Already have Schedules'));

          templateEditorFactory.publish()
            .then(function() {
              setTimeout(function() {
                createFirstSchedule.should.have.been.calledWith(templateEditorFactory.presentation);

                scheduleSelectorFactory.loadSelectedSchedules.should.not.have.been.called;

                done();
              });
            })
            .then(null, function(err) {
              assert.fail(err);
            })
            .then(null, done);
        }); 

        it('should handle failure to create first schedule', function(done) {
          sandbox.stub(templateEditorFactory, 'isRevised').returns(false);
          createFirstSchedule.returns(Q.reject());

          templateEditorFactory.publish()
            .then(function() {
              assert.fail('error')
            })
            .then(null, function(err) {
              createFirstSchedule.should.have.been.calledWith(templateEditorFactory.presentation);

              scheduleSelectorFactory.loadSelectedSchedules.should.not.have.been.called;

              done();
            });
        }); 
      });

      describe('checkAssignedToSchedules:', function() {
        it('should check schedule assignment on successful publish', function(done) {
          templateEditorFactory.publish()
            .then(function() {
              scheduleSelectorFactory.checkAssignedToSchedules.should.have.been.called;

              done();
            })
            .then(null, function(err) {
              assert.fail(err);
            })
            .then(null, done);
        });
      });

      it('should not check schedule assignment on publish errors', function(done) {
        presentation.publish.returns(Q.reject());

        templateEditorFactory.publish()
          .then(null, function(e) {
            setTimeout(function() {
              scheduleSelectorFactory.checkAssignedToSchedules.should.not.have.been.called;

              done();
            }, 10);
          });
      });
    });

    describe('publishBranding: ', function() {
      beforeEach(function() {
        sandbox.stub(presentation, 'publish').resolves();
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
              templateEditorUtils.showMessageWindow.should.have.been.called;

              done();
            }, 10);
          });
      });
    });    

  });
});
