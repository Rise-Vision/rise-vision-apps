import { Injectable } from '@angular/core';
import { StorageService } from 'src/app/ajs-upgraded-providers';
import { TemplateEditorUtilsService } from '../../services/template-editor-utils.service';
import * as angular from 'angular';
import { downgradeInjectable } from '@angular/upgrade/static';

@Injectable({
  providedIn: 'root'
})
export class StorageManagerService {
  public static readonly SUPPORTED_IMAGE_TYPES = '.bmp, .gif, .jpeg, .jpg, .png, .svg, .webp';
  public static readonly SUPPORTED_VIDEO_TYPES = '.mp4, .webm';

  public fileType;
  public loadingFiles;
  isListView =true;
  folderItems = [];  
  constructor(
    private storage: StorageService,
    private templateEditorUtils: TemplateEditorUtilsService) { }

  
    _getValidExtensionsList() {
      var validExtensions = this.fileType === 'image' ? StorageManagerService.SUPPORTED_IMAGE_TYPES : StorageManagerService.SUPPORTED_VIDEO_TYPES;

      return validExtensions ? validExtensions.split(',') : [];
    };

    loadFiles(folderPath) {
      this.loadingFiles = true;

      return this.storage.files.get({
          folderPath: folderPath
        })
        .then( (items) => {
          if (items.files) {
            this.folderItems = items.files.filter((item) => {
              var isValid = this.templateEditorUtils.fileHasValidExtension(item.name, this._getValidExtensionsList());

              return item.name !== folderPath && (this.templateEditorUtils.isFolder(item.name) || isValid);
            });
          } else {
            this.folderItems = [];
          }

          return this.folderItems;
        })
        .catch( (err) => {
          console.log('Failed to load files', err);
        })
        .finally( () => {
          this.loadingFiles = false;
        });
    };
}

angular.module('risevision.template-editor.services')
  .factory('storageManagerFactory', downgradeInjectable(StorageManagerService));