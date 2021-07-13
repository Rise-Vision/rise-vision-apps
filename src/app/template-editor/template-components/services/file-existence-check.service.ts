import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import * as angular from 'angular';
import { downgradeInjectable } from '@angular/upgrade/static';
import { FileMetadataUtilsService } from './file-metadata-utils.service';
import { StorageAPILoader } from 'src/app/ajs-upgraded-providers';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FileExistenceCheckService {

  constructor(
    private storageAPILoader: StorageAPILoader,
    private fileMetadataUtilsService: FileMetadataUtilsService) { }


    _requestFileData(companyId, file) {
      var search = {
        'companyId': companyId,
        'file': file
      };

      return this.storageAPILoader()
        .then((storageApi) => {
          return storageApi.files.get(search);
        });
    }

    _isDefaultImageOnTestAppsEnvironment(fileName) {
      if (environment.production) {
        return false;
      }

      // all default files for Rise Vision templates are defined under this GCS bucket
      var regex = /^risemedialibrary-7fa5ee92-7deb-450b-a8d5-e5ed648c575f[/]Template Library[/].+/;

      return regex.test(fileName);
    }

    _getThumbnailDataFor(fileName, defaultThumbnailUrl) {
      var invalidThumbnailData = {
        exists: false,
        timeCreated: '',
        url: ''
      };
      var regex = /risemedialibrary-([0-9a-f-]{36})[/](.+)/g;
      var match = regex.exec(fileName);

      if (!match) {
        console.error('Filename is not a valid Rise Storage path: ' + fileName);

        return Promise.resolve(invalidThumbnailData);
      } else if (this._isDefaultImageOnTestAppsEnvironment(fileName)) {
        return Promise.resolve({
          exists: true,
          timeCreated: '',
          url: defaultThumbnailUrl
        });
      }

      return this._requestFileData(match[1], match[2])
        .then( (resp) => {
          var file = resp && resp.result && resp.result.result &&
            resp.result.files && resp.result.files[0];

          if (!file) {
            return invalidThumbnailData;
          }

          var url = this.fileMetadataUtilsService.thumbnailFor(file, defaultThumbnailUrl);

          return {
            exists: !!url,
            timeCreated: this.fileMetadataUtilsService.timeCreatedFor(file),
            url: url
          };
        })
        .catch( (error) => {
          console.error(error);

          return invalidThumbnailData;
        });
    }

    _loadMetadata(fileNames, defaultThumbnailUrl) {
      var promises = _.map(fileNames, (fileName) => {
        return this._getThumbnailDataFor(fileName, defaultThumbnailUrl)
          .then( (data) => {
            return {
              file: fileName,
              exists: data.exists,
              'time-created': data.timeCreated,
              'thumbnail-url': data.url
            };
          })
          .catch( (error) => {
            console.error(error);
          });
      });

      return Promise.all(promises).then((results) => {
        var metadata = [];

        _.reject(results, _.isNil).forEach( (file) => {
          metadata.push(file);
        });

        return metadata;
      });
    }

    requestMetadataFor(files, defaultThumbnailUrl) {
      var fileNames = this.fileMetadataUtilsService.filesAttributeToArray(files);

      return this._loadMetadata(fileNames, defaultThumbnailUrl);
    };
}

angular.module('risevision.template-editor.services')
  .factory('fileExistenceCheckService', downgradeInjectable(FileExistenceCheckService));