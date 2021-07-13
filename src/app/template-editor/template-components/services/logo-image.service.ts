import { Injectable } from '@angular/core';
import * as angular from 'angular';
import { downgradeInjectable } from '@angular/upgrade/static';
import { ModalService } from 'src/app/components/modals/modal.service';
import { PromiseUtilsService } from 'src/app/shared/services/promise-utils.service';
import { BrandingService } from './branding.service';

@Injectable({
  providedIn: 'root'
})
export class LogoImageService {
  public static readonly DEFAULT_IMAGE_THUMBNAIL = 'https://s3.amazonaws.com/Rise-Images/UI/storage-image-icon-no-transparency%402x.png';

  constructor(
    private brandingFactory: BrandingService,
    private ngModalService: ModalService,
    private promiseUtils: PromiseUtilsService) { }
  
    getImagesAsMetadata() {
      if (this.brandingFactory.brandingSettings.logoFile) {
        return this.brandingFactory.brandingSettings.logoFileMetadata ?
        this.brandingFactory.brandingSettings.logoFileMetadata : [{
            exists: true,
            file: this.brandingFactory.brandingSettings.logoFile,
            'thumbnail-url': LogoImageService.DEFAULT_IMAGE_THUMBNAIL,
            'time-created': '0'
          }];
      } else {
        return [];
      }
    };

    setDuration(duration) {
      return;
    };

    setTransition(transition) {
      return;
    };

    getHelpText() {
      return null;
    };

    updateMetadata(metadata) {
      if (metadata && metadata.length > 0) {
        var item = metadata[metadata.length - 1];
        this.brandingFactory.brandingSettings.logoFileMetadata = [item];
        this.brandingFactory.brandingSettings.logoFile = item.file;
      } else {
        this.brandingFactory.brandingSettings.logoFileMetadata = [];
        this.brandingFactory.brandingSettings.logoFile = '';
      }
      this.brandingFactory.setUnsavedChanges();
      return this.brandingFactory.brandingSettings.logoFileMetadata;
    };

    getAvailableAttributeData(key) {
      return null;
    };

    getBlueprintData(key) {
      return null;
    };

    areChecksCompleted() {
      return !!this.brandingFactory.brandingSettings.logoFileMetadata;
    };

    _canRemoveImage() {
      return this.ngModalService.confirmDanger('Are you sure you want to remove your logo?',
        'This will remove your logo from all Templates.',
        'Yes, Remove It',
        'No, Keep It'
      );
    };

    removeImage(image, currentMetadata) {
      var deferred = this.promiseUtils.generateDeferredPromise();

      this._canRemoveImage().then(() => {
        deferred.resolve(this.updateMetadata([]));
      }).catch(() => {
        deferred.resolve(currentMetadata);
      });

      return deferred.promise;
    };

}

angular.module('risevision.template-editor.services')
  .factory('logoImageFactory', downgradeInjectable(LogoImageService));