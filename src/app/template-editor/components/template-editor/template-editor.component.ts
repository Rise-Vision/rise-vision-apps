import { Component, DoCheck, OnDestroy } from '@angular/core';

import * as _ from 'lodash';
import * as angular from 'angular';
import { downgradeComponent } from '@angular/upgrade/static';
import { AjsState, AjsTransitions, ComponentsFactory, TemplateEditorFactory, AutoSaveService, PresentationUtils } from 'src/app/ajs-upgraded-providers';
import { BroadcasterService } from 'src/app/shared/services/broadcaster.service';

@Component({
  selector: 'app-template-editor',
  templateUrl: './template-editor.component.html',
  styleUrls: ['./template-editor.component.scss']
})
export class TemplateEditorComponent implements DoCheck, OnDestroy {
  private subscription: any;
  private _oldPresentation: any;

  private autoSaveService: any;
  private _bypassUnsaved = false;

  constructor(
    private $state: AjsState,
    private $transitions: AjsTransitions,
    private broadcaster: BroadcasterService,
    public componentsFactory: ComponentsFactory,
    private templateEditorFactory: TemplateEditorFactory,
    private AutoSaveService: AutoSaveService,
    private presentationUtils: PresentationUtils) {
    const that = this;

    this.autoSaveService = this.AutoSaveService(this.templateEditorFactory.save);

    this.templateEditorFactory.hasUnsavedChanges = false;

    this.$transitions.onStart({
      to: (state: any) => state.name.indexOf('apps.editor.templates') === -1
    }, function (trans: any) {
      if (that._bypassUnsaved) {
        that._bypassUnsaved = false;
        return;
      }

      that.autoSaveService.clearSaveTimeout();
  
      if (that.templateEditorFactory.isUnsaved() && that.templateEditorFactory.hasContentEditorRole()) {
        trans.abort();

        that.templateEditorFactory.save()
          .finally(function () {
            that._bypassUnsaved = true;
            that.$state.go(trans.to().name, trans.to().params);
          });  
      }
    });

    window.onbeforeunload = (e: Event) => {
      if (that.templateEditorFactory.isUnsaved()) {
        // Cancel the event
        e.preventDefault(); // If you prevent default behavior in Mozilla Firefox prompt will always be shown
        // Chrome requires returnValue to be set
        e.returnValue = true;
      }
    };

    this.subscription = this.broadcaster.subscribe({
      next: (event: String) => {
        switch (event) {
        case 'presentationCreated':
        case 'presentationUpdated':
        case 'presentationPublished':
          that._setUnsavedChangesAsync(false);
          break;
        case 'presentationDeleted':
          that._setUnsavedChanges(false);
          break;
        case 'risevision.template-editor.brandingUnsavedChanges':
          that._setUnsavedChangesAsync(true);
          break;
        case 'presentationUnsavedChanges':
          that._setUnsavedChangesAsync(true);
          break;
        default:
          return;
        }
      }
    });

  }

  _checkPresentationChanged() {
    if (!this.templateEditorFactory.hasContentEditorRole()) {
      return;
    }

    var ignoredFields = [
      'id', 'companyId', 'revisionStatus', 'revisionStatusName',
      'changeDate', 'changedBy', 'creationDate', 'publish', 'layout'
    ];
    
    if (!_.isEqual(_.omit(this.templateEditorFactory.presentation, ignoredFields), _.omit(this._oldPresentation, ignoredFields))) {
      this._oldPresentation = _.cloneDeep(this.templateEditorFactory.presentation);

      if (!this.templateEditorFactory.hasUnsavedChanges) {
        this._setUnsavedChanges(true);
      }
    }

  }

  ngDoCheck(): void {
    if (!this.templateEditorFactory.presentation) {
      return;
    } else if (!this._oldPresentation) {
      this._oldPresentation = _.cloneDeep(this.templateEditorFactory.presentation);
    } else {
      this._checkPresentationChanged();
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();

    window.onbeforeunload = undefined;
  }

  considerChromeBarHeight() {
    const userAgent = window.navigator.userAgent;

    // Firefox and Samsung browser require desktop rule
    return this.presentationUtils.isMobileBrowser() &&
      !(/Firefox|SamsungBrowser/i.test(userAgent));
  }

  _setUnsavedChanges = function (state: any) {
    this.templateEditorFactory.hasUnsavedChanges = state;

    if (this.templateEditorFactory.hasUnsavedChanges && this.templateEditorFactory.hasContentEditorRole()) {
      this.autoSaveService.save();
    }
  };

  _setUnsavedChangesAsync = function (state: any) {
    const that = this;

    setTimeout(function () {
      that._setUnsavedChanges(state);
    });
  };

}

angular.module('risevision.template-editor.controllers')
  .directive(
    'ngTemplateEditor', 
    downgradeComponent({
      component: TemplateEditorComponent
    }) as angular.IDirectiveFactory
  );
