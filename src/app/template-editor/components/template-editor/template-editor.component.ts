import { Component, HostListener } from '@angular/core';
import { KeyValueChanges, KeyValueDiffer, KeyValueDiffers } from '@angular/core';

import * as angular from 'angular';
import { downgradeComponent } from '@angular/upgrade/static';
import { AjsState, AjsTransitions, ComponentsFactory, TemplateEditorFactory, AutoSaveService, PresentationUtils } from 'src/app/ajs-upgraded-providers';

@Component({
  selector: 'app-template-editor',
  templateUrl: './template-editor.component.html',
  styleUrls: ['./template-editor.component.scss']
})
export class TemplateEditorComponent {
  private presentationDiffer: KeyValueDiffer<string, any>;

  private autoSaveService;
  private _bypassUnsaved = false;
  private _initializing = false;

  @HostListener('window:beforeunload')
  checkUnsaved() {
    if (this.templateEditorFactory.isUnsaved()) {
      return 'Do you want to save changes before leaving?';
    }
  }

  constructor(
    private differs: KeyValueDiffers,
    private $state: AjsState,
    private $transitions: AjsTransitions,
    public componentsFactory: ComponentsFactory,
    private templateEditorFactory: TemplateEditorFactory,
    private AutoSaveService: AutoSaveService,
    private presentationUtils: PresentationUtils) {
    const that = this;

    this.presentationDiffer = this.differs.find(this.templateEditorFactory.presentation).create();
    this.autoSaveService = this.AutoSaveService(this.templateEditorFactory.save);

    this.templateEditorFactory.hasUnsavedChanges = false;

    this.$transitions.onStart({
      to: (state: any) => state.name.indexOf('apps.editor.templates') === -1
    }, function (trans: any) {
      if (that._bypassUnsaved) {
        that._bypassUnsaved = false;
        return;
      }

      trans.abort();

      that.autoSaveService.clearSaveTimeout();
  
      var savePromise = that.templateEditorFactory.isUnsaved() && that.templateEditorFactory.hasContentEditorRole() ? that.templateEditorFactory.save() :
        Promise.resolve();
  
      savePromise
        .finally(function () {
          that._bypassUnsaved = true;
          that.$state.go(trans.to().name, trans.to().params);
        });
    });
  }

  customerChanged(changes: KeyValueChanges<string, any>) {
    console.log('changes', changes);
    /* If you want to see details then use
      changes.forEachRemovedItem((record) => ...);
      changes.forEachAddedItem((record) => ...);
      changes.forEachChangedItem((record) => ...);
    */
  }

  ngDoCheck(): void {
      const changes = this.presentationDiffer.diff(this.templateEditorFactory.presentation);
      if (changes) {
        this.customerChanged(changes);
      }
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


  // $scope.$watch('templateEditorFactory.presentation', function (newValue, oldValue) {
  //   if (!this.templateEditorFactory.hasContentEditorRole()) {
  //     return;
  //   }
  //   var ignoredFields = [
  //     'id', 'companyId', 'revisionStatus', 'revisionStatusName',
  //     'changeDate', 'changedBy', 'creationDate', 'publish', 'layout'
  //   ];
  // 
  //   if (!newValue.id) {
  //     this.templateEditorFactory.save();
  //     return;
  //   }
  //   if (this.templateEditorFactory.hasUnsavedChanges) {
  //     return;
  //   }
  // 
  //   if (_initializing) {
  //     $timeout(function () {
  //       _initializing = false;
  //     });
  //   } else {
  //     if (!_.isEqual(_.omit(newValue, ignoredFields), _.omit(oldValue, ignoredFields))) {
  //       _setUnsavedChanges(true);
  //     }
  //   }
  // }, true);
  // 
  // $scope.$on('presentationCreated', _setUnsavedChangesAsync.bind(null, false));
  // $scope.$on('presentationUpdated', _setUnsavedChangesAsync.bind(null, false));
  // $scope.$on('presentationDeleted', _setUnsavedChanges.bind(null, false));
  // $scope.$on('presentationPublished', _setUnsavedChangesAsync.bind(null, false));
  // 
  // $scope.$on('risevision.template-editor.brandingUnsavedChanges', _setUnsavedChangesAsync.bind(null, true));
  // 


}

angular.module('risevision.template-editor.controllers')
  .directive(
    'ngTemplateEditor', 
    downgradeComponent({
      component: TemplateEditorComponent
    }) as angular.IDirectiveFactory
  );
