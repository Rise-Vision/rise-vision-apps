import { Injectable } from '@angular/core';
import * as angular from 'angular';
import { downgradeInjectable } from '@angular/upgrade/static';
import { AjsState, CreateFirstScheduleService, PresentationService, PresentationTracker, ProcessErrorCode, ScheduleFactory, ScheduleSelectorFactory, UserState } from 'src/app/ajs-upgraded-providers';
import { BroadcasterService } from 'src/app/shared/services/broadcaster.service';
import { TemplateEditorUtilsService } from './template-editor-utils.service';
import { BlueprintService } from './blueprint.service';
import { PromiseUtilsService } from 'src/app/shared/services/promise-utils.service';
import { BrandingService } from '../template-components/services/branding.service';

@Injectable({
  providedIn: 'root'
})
export class TemplateEditorService {

  static readonly HTML_TEMPLATE_DOMAIN = 'https://widgets.risevision.com';
  static readonly REVISION_STATUS_PUBLISHED = 'Published';
  static readonly REVISION_STATUS_REVISED = 'Revised';
  static readonly HTML_PRESENTATION_TYPE = 'HTML Template';

  hasUnsavedChanges = false;
  presentation;
  loadingPresentation;
  savingPresentation;
  errorMessage;
  apiError;

  constructor(private $state: AjsState, 
    private broadcaster: BroadcasterService,
    private presentationService: PresentationService,
    private processErrorCode: ProcessErrorCode,
    private userState: UserState,
    private createFirstSchedule: CreateFirstScheduleService,
    private templateEditorUtils: TemplateEditorUtilsService,
    private brandingFactory: BrandingService,
    private blueprintFactory: BlueprintService,
    private scheduleFactory: ScheduleFactory,
    private presentationTracker: PresentationTracker,
    private scheduleSelectorFactory: ScheduleSelectorFactory,
    private promiseUtils: PromiseUtilsService) { 
      this._init();
    }

    hasContentEditorRole() {
      return this.userState.hasRole('ce');
    };

    _parseJSON(json) {
      try {
        return JSON.parse(json);
      } catch (err) {
        console.error('Invalid JSON: ' + err);
        return null;
      }
    };

    _setPresentation(presentation, isUpdate?) {

      if (isUpdate) {
        this.presentation.id = presentation.id;
        this.presentation.companyId = presentation.companyId;
        this.presentation.revisionStatus = presentation.revisionStatus;
        this.presentation.revisionStatusName = presentation.revisionStatusName;
        this.presentation.creationDate = presentation.creationDate;
        this.presentation.changeDate = presentation.changeDate;
        this.presentation.changedBy = presentation.changedBy;
      } else {
        presentation.templateAttributeData =
          this._parseJSON(presentation.templateAttributeData) || {};

        this.presentation = presentation;
      }

      this.broadcaster.emit('presentationUpdated');
    };

    _getPresentationForUpdate() {
      var presentationVal = JSON.parse(JSON.stringify(this.presentation));

      presentationVal.templateAttributeData =
        JSON.stringify(presentationVal.templateAttributeData);

      return presentationVal;
    };

    addFromProduct(productDetails) {
      this._clearMessages();

      this.presentation = {
        id: undefined,
        productCode: productDetails.productCode,
        name: 'Copy of ' + productDetails.name,
        presentationType: TemplateEditorService.HTML_PRESENTATION_TYPE,
        templateAttributeData: {},
        revisionStatusName: undefined,
        isTemplate: false,
        isStoreProduct: false
      };

      this.presentationTracker('HTML Template Copied', productDetails.productCode, productDetails.name);

      return this.blueprintFactory.getBlueprintCached(this.presentation.productCode)
        .then(this.save.bind(this))
        .then(null, (e) => {
          this._showErrorMessage('add', e);
          return Promise.reject(e);
        });
    };

    addPresentation() {
      var presentationVal = this._getPresentationForUpdate();

      return this.presentationService.add(presentationVal)
        .then( (resp) => {
          if (resp && resp.item && resp.item.id) {
            this.broadcaster.emit('presentationCreated');

            this._setPresentation(resp.item);

            this.presentationTracker('Presentation Created', resp.item.id, resp.item.name, {
              presentationType: 'HTML Template',
              sharedTemplate: resp.item.productCode
            });

            this.$state.go('apps.editor.templates.edit', {
              presentationId: resp.item.id,
              productId: undefined,
            }, {
              location: 'replace'
            });

            return Promise.resolve(resp.item.id);
          }
        });
    };

    updatePresentation() {
      if (!this.hasUnsavedChanges) {
        //Factory has no Changes.
        return Promise.resolve();
      }

      var presentationVal = this._getPresentationForUpdate();

      return this.presentationService.update(presentationVal.id, presentationVal)
        .then( (resp) => {
          this.presentationTracker('Presentation Updated', resp.item.id, resp.item.name);

          this._setPresentation(resp.item, true);

          return Promise.resolve(resp.item.id);
        });
    };

    isUnsaved() {
      return !!(this.hasUnsavedChanges || this.brandingFactory.hasUnsavedChanges);
    };

    save() {
      var deferred = this.promiseUtils.generateDeferredPromise(),
        saveFunction;

      if (this.presentation.id) {
        saveFunction = this.updatePresentation.bind(this);
      } else {
        saveFunction = this.addPresentation.bind(this);
      }

      this._clearMessages();

      //show spinner
      this.loadingPresentation = true;
      this.savingPresentation = true;

      Promise.all([this.brandingFactory.saveBranding(), saveFunction()])
        .then( () => {
          deferred.resolve();
        })
        .then(null, (e) => {
          // If adding, and there is a Presentation Id it means save was successful
          // and the failure was to update Branding
          this._showErrorMessage(this.presentation.id ? 'update' : 'add', e);

          deferred.reject(e);
        })
        .finally( () => {
          this.loadingPresentation = false;
          this.savingPresentation = false;
        });

      return deferred.promise;
    };

    getPresentation(presentationId?) {
      var deferred = this.promiseUtils.generateDeferredPromise();

      this._clearMessages();

      //show loading spinner
      this.loadingPresentation = true;

      this.presentationService.get(presentationId)
        .then( (result) => {
          this._setPresentation(result.item);

          return this.blueprintFactory.getBlueprintCached(this.presentation.productCode);
        })
        .then( () => {
          deferred.resolve();
        })
        .then(null, (e) => {
          this._showErrorMessage('get', e);
          this.presentation = null;
          this.blueprintFactory.blueprintData = null;

          deferred.reject(e);
        })
        .finally( () => {
          this.loadingPresentation = false;
        });

      return deferred.promise;
    };

    deletePresentation() {
      var deferred = this.promiseUtils.generateDeferredPromise();

      this._clearMessages();

      //show spinner
      this.loadingPresentation = true;
      this.savingPresentation = true;

      this.presentationService.delete(this.presentation.id)
        .then( () => {
          this.presentationTracker('Presentation Deleted', this.presentation.id, this.presentation.name);

          this.broadcaster.emit('presentationDeleted');

          this.presentation = {};

          this.$state.go('apps.editor.list');
          deferred.resolve();
        })
        .then(null, (e) => {
          this._showErrorMessage('delete', e);
          deferred.reject(e);
        })
        .finally( () => {
          this.loadingPresentation = false;
          this.savingPresentation = false;
        });

      return deferred.promise;
    };

    isRevised() {
      return this.presentation.revisionStatusName === TemplateEditorService.REVISION_STATUS_REVISED;
    };

    isPublishDisabled() {
      var isNotRevised = !this.isRevised() && !this.brandingFactory.isRevised() &&
      this.scheduleFactory.hasSchedules();

      return this.savingPresentation || this.isUnsaved() || isNotRevised;
    };

    publish() {
      return this._publish().then(this.scheduleSelectorFactory.checkAssignedToSchedules);
    };

    _publish() {
      var deferred = this.promiseUtils.generateDeferredPromise();

      this._clearMessages();

      //show spinner
      this.loadingPresentation = true;
      this.savingPresentation = true;

      Promise.all([this.brandingFactory.publishBranding(), this._publishPresentation()])
        .then( () => {
          deferred.resolve();
        })
        .then(null, (e) => {
          this._showErrorMessage('publish', e);

          deferred.reject();
        })
        .finally( () => {
          this.loadingPresentation = false;
          this.savingPresentation = false;
        });

      return deferred.promise;
    };

    _publishPresentation() {
      if (!this.isRevised()) {
        // template is already published
        return this._createFirstSchedule();
      }

      return this.presentationService.publish(this.presentation.id)
        .then( () => {
          this.presentationTracker('Presentation Published', this.presentation.id, this.presentation.name);

          this.presentation.revisionStatusName = TemplateEditorService.REVISION_STATUS_PUBLISHED;
          this.presentation.changeDate = new Date();
          this.presentation.changedBy = this.userState.getUsername();
          this.broadcaster.emit('presentationPublished');

          return this._createFirstSchedule();
        });
    };

    _createFirstSchedule() {
      return this.createFirstSchedule(this.presentation)
        .then(this.scheduleSelectorFactory.loadSelectedSchedules)
        .catch( (err) => {
          return err === 'Already have Schedules' ? Promise.resolve() : Promise.reject(err);
        });
    };

    _showErrorMessage(action, e) {
      this.errorMessage = 'Failed to ' + action + ' Presentation.';
      this.apiError = this.processErrorCode('Presentation', action, e);

      console.error(this.errorMessage, e);

      this.templateEditorUtils.showMessageWindow(this.errorMessage, this.apiError);
    };

    _clearMessages() {
      this.loadingPresentation = false;
      this.savingPresentation = false;

      this.errorMessage = '';
      this.apiError = '';
    };

    _init() {
      this.presentation = {};

      this._clearMessages();
    };
    
}

angular.module('risevision.template-editor.services')
  .constant('HTML_TEMPLATE_DOMAIN', TemplateEditorService.HTML_TEMPLATE_DOMAIN)
  .factory('templateEditorFactory', downgradeInjectable(TemplateEditorService));