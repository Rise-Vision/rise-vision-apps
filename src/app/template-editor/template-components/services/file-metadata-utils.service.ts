import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import * as angular from 'angular';
import { downgradeInjectable } from '@angular/upgrade/static';
import { TemplateEditorUtilsService } from '../../services/template-editor-utils.service';
import { StorageUtils } from 'src/app/ajs-upgraded-providers';

@Injectable({
  providedIn: 'root'
})
export class FileMetadataUtilsService {

  constructor(
    private templateEditorUtils: TemplateEditorUtilsService,
    private storageUtils: StorageUtils
  ) { }


  _addFileToSet(selectedImages, defaultThumbnailUrl, file, alwaysAppend) {
    if (!file.bucket) {
      file.bucket = this.storageUtils.getBucketName();
    }

    var filePath = file.bucket + '/' + file.name;
    var initialLength = selectedImages.length;
    var timeCreated = this.timeCreatedFor(file);
    var thumbnail = this.thumbnailFor(file, defaultThumbnailUrl);

    var newFile = {
      file: filePath,
      exists: true,
      'time-created': timeCreated,
      'thumbnail-url': thumbnail
    };

    this.templateEditorUtils.addOrReplaceAll(selectedImages, {
      file: filePath
    }, newFile);

    if (alwaysAppend && initialLength === selectedImages.length) {
      selectedImages.push(newFile);
    }
  }

  thumbnailFor(item, defaultThumbnailUrl) {
    if (item.metadata && item.metadata.thumbnail) {
      return item.metadata.thumbnail + '?_=' + this.timeCreatedFor(item);
    } else {
      return defaultThumbnailUrl;
    }
  };

  timeCreatedFor(item) {
    return item.timeCreated && item.timeCreated.value;
  };

  extractFileNamesFrom(metadata) {
    return _.map(metadata, (entry) => {
      return entry.file;
    });
  };

  filesAttributeFor(metadata) {
    return this.extractFileNamesFrom(metadata).join('|');
  };

  filesAttributeToArray(files) {
    var fileNames;

    if (files) {
      fileNames = Array.isArray(files) ?
        angular.copy(files) : files.split('|');
    } else {
      fileNames = [];
    }

    return fileNames;
  };

  metadataWithFile(previousMetadata, defaultThumbnailUrl, files, alwaysAppend) {
    var metadata = _.cloneDeep(previousMetadata);

    files.forEach((file) => {
      this._addFileToSet(metadata, defaultThumbnailUrl, file, alwaysAppend);
    });

    return metadata;
  };

  metadataWithFileRemoved(previousMetadata, entry) {
    var idx = previousMetadata.indexOf(entry);
    var metadata = _.cloneDeep(previousMetadata);

    if (idx >= 0) {
      metadata.splice(idx, 1);

      return metadata;
    }
  };

  getUpdatedFileMetadata(currentMetadata, newMetadata) {
    if (!currentMetadata) {
      return newMetadata;
    } else {
      var atLeastOneOriginalEntryIsStillSelected = false;
      var metadataCopy = angular.copy(currentMetadata);

      _.each(newMetadata, (entry) => {
        var currentEntry = _.find(metadataCopy, {
          file: entry.file
        });

        if (currentEntry) {
          atLeastOneOriginalEntryIsStillSelected = true;
          currentEntry.exists = entry.exists;
          currentEntry['thumbnail-url'] = entry['thumbnail-url'];
          currentEntry['time-created'] = entry['time-created'];
        }
      });

      return atLeastOneOriginalEntryIsStillSelected ? metadataCopy : null;
    }
  };

}

angular.module('risevision.template-editor.services')
  .factory('fileMetadataUtilsService', downgradeInjectable(FileMetadataUtilsService));