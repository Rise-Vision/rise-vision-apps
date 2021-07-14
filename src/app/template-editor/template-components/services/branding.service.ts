import { Inject, Injectable } from '@angular/core';
import * as angular from 'angular';
import { downgradeInjectable } from '@angular/upgrade/static';
import { UpdateCompany, UserState } from 'src/app/ajs-upgraded-providers';
import { BroadcasterService } from 'src/app/shared/services/broadcaster.service';
import { BlueprintService } from '../../services/blueprint.service';
import { FileExistenceCheckService } from './file-existence-check.service';
import { LogoImageService } from './logo-image.service';
import { TemplateEditorService } from '../../services/template-editor.service';

@Injectable({
  providedIn: 'root'
})
export class BrandingService {

  private subscription: any;

  brandingComponent = {
    type: 'rise-branding'
  };
  
  brandingSettings = null;
  hasUnsavedChanges = false;

  constructor(
    private userState: UserState,
    private broadcaster: BroadcasterService,
    private blueprintFactory: BlueprintService,
    private updateCompany: UpdateCompany,
    private fileExistenceCheckService: FileExistenceCheckService ) {
      this.subscription = this.broadcaster.on('risevision.company.selectedCompanyChanged', () => {
        this._loadBranding(true);
      });
    }

    ngOnDestroy() {
      this.subscription.unsubscribe();
    }

    _refreshMetadata() {
      if (this.brandingSettings.logoFile) {
        this.fileExistenceCheckService.requestMetadataFor([this.brandingSettings.logoFile],LogoImageService.DEFAULT_IMAGE_THUMBNAIL)
          .then((metadata) => {
            this.brandingSettings.logoFileMetadata = metadata;
          })
          .catch( (error) => {
            console.error('Could not load metadata for: ' + this.brandingSettings.logoFile, error);
          });
      } else {
        this.brandingSettings.logoFileMetadata = [];
      }
    };

    _loadBranding(forceRefresh?) {
      if (!this.brandingSettings || forceRefresh) {
        var company = this.userState.getCopyOfSelectedCompany();
        var settings = company.settings || {};

        this.brandingSettings = {
          logoFile: settings.brandingDraftLogoFile,
          baseColor: settings.brandingDraftBaseColor,
          accentColor: settings.brandingDraftAccentColor
        };
        this.hasUnsavedChanges = false;
      }

      this._refreshMetadata();
    };

    

    getBrandingComponent() {
      this._loadBranding();

      return (this.blueprintFactory.hasBranding() ? this.brandingComponent : null);
    };

    _updateCompanySettings(settings) {
      var companyPatch = {
        settings: settings
      };
      return this.updateCompany(this.userState.getSelectedCompanyId(), companyPatch)
        .then( (updatedCompany) => {
          this.userState.updateCompanySettings(updatedCompany);
        });
    };

    publishBranding() {
      if (!this.isRevised()) {
        //Branding already published.
        return Promise.resolve();
      }

      var company = this.userState.getCopyOfSelectedCompany();

      return this._updateCompanySettings({
        brandingLogoFile: company.settings.brandingDraftLogoFile,
        brandingBaseColor: company.settings.brandingDraftBaseColor,
        brandingAccentColor: company.settings.brandingDraftAccentColor,
        brandingRevisionStatusName: TemplateEditorService.REVISION_STATUS_PUBLISHED
      });
    };

    saveBranding() {
      if (!this.hasUnsavedChanges || !this.blueprintFactory.hasBranding()) {
        return Promise.resolve();
      }

      return this._updateCompanySettings({
        brandingDraftBaseColor: this.brandingSettings.baseColor,
        brandingDraftAccentColor: this.brandingSettings.accentColor,
        brandingDraftLogoFile: this.brandingSettings.logoFile,
        brandingRevisionStatusName: TemplateEditorService.REVISION_STATUS_REVISED
      }).then(() => {
        this.hasUnsavedChanges = false;
      });
    };

    setUnsavedChanges() {
      this.broadcaster.emit('risevision.template-editor.brandingUnsavedChanges');

      this.hasUnsavedChanges = true;
    };

    isRevised() {
      if (!this.blueprintFactory.hasBranding()) {
        return false;
      }

      var company = this.userState.getCopyOfSelectedCompany();

      return !!(company.settings && company.settings.brandingRevisionStatusName === TemplateEditorService.REVISION_STATUS_REVISED);
    };

}

angular.module('risevision.template-editor.services')
  .factory('brandingFactory', downgradeInjectable(BrandingService));