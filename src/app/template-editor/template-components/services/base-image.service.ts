import { Injectable } from '@angular/core';
import * as angular from 'angular';
import { downgradeInjectable } from '@angular/upgrade/static';
import { FileMetadataUtilsService } from './file-metadata-utils.service';
import { BlueprintService } from '../../services/blueprint.service';
import { AttributeDataService } from '../../services/attribute-data.service';

@Injectable({
  providedIn: 'root'
})
export class BaseImageService {

  componentId = null;
  checksCompleted;

  constructor(
    private fileMetadataUtilsService: FileMetadataUtilsService,
    private blueprintFactory: BlueprintService,
    private attributeDataFactory: AttributeDataService
  ) { }

  getImagesAsMetadata() {
    return this._getAttributeData('metadata');
  };

  setDuration(duration) {
    this._setAttributeData('duration', duration);
  };

  setTransition(transition) {
    this._setAttributeData('transition', transition);
  };

  getHelpText() {
    return this.blueprintFactory.getHelpText(this.componentId);
  };

  getBlueprintData(key) {
    return this.blueprintFactory.getBlueprintData(this.componentId, key);
  };

  areChecksCompleted() {
    return !!this.checksCompleted && this.checksCompleted[this.componentId] !== false;
  };

  isSetAsLogo() {
    return this.getBlueprintData('is-logo') === 'true' && this._getAttributeData('isLogo') !== false;
  };

  removeImage(image, currentMetadata) {
    var metadata = this.fileMetadataUtilsService.metadataWithFileRemoved(currentMetadata, image);

    if (metadata) {
      return Promise.resolve(this.updateMetadata(metadata));
    } else {
      return Promise.resolve([]);
    }
  };

  updateMetadata(metadata) {
    var selectedImages = angular.copy(metadata);
    var filesAttribute = this.fileMetadataUtilsService.filesAttributeFor(selectedImages);

    this._setAttributeData('metadata', selectedImages);
    this._setAttributeData('files', filesAttribute);

    // Check default isLogo===true value; if the user makes changes to the component
    // revert it to isLogo=false
    if (this.getBlueprintData('is-logo') === 'true') {
      this._setAttributeData('isLogo', false);
    }

    return selectedImages;
  };

  getAvailableAttributeData(key) {
    return this.attributeDataFactory.getAvailableAttributeData(this.componentId, key);
  };

  _getAttributeData(key) {
    return this.attributeDataFactory.getAttributeData(this.componentId, key);
  };

  _setAttributeData(key, value) {
    this.attributeDataFactory.setAttributeData(this.componentId, key, value);
  };
}


angular.module('risevision.template-editor.services')
  .factory('baseImageFactory', downgradeInjectable(BaseImageService));

