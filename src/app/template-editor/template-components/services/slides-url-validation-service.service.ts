import { Injectable } from '@angular/core';
import * as angular from 'angular';
import { downgradeInjectable } from '@angular/upgrade/static';
import { PromiseUtilsService } from 'src/app/shared/services/promise-utils.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SlidesUrlValidationServiceService {

  private static readonly PROXY_URL = 'https://proxy.risevision.com/';

  constructor(
    private promiseUtils: PromiseUtilsService,
    private httpClient: HttpClient
  ) { } 

  validate(url) {
    if (!url) {
      return Promise.resolve('VALID');
    }

    var deferred = this.promiseUtils.generateDeferredPromise();

    this.httpClient.get( SlidesUrlValidationServiceService.PROXY_URL + url, { 
      responseType: 'text',
      observe: 'response'})
    .toPromise()
    .then((response: any) => {
      var finalUrl = response.headers.get('x-final-url');
      if (finalUrl !== url) {
        return deferred.resolve('NOT_PUBLIC');
      }

      return deferred.resolve('VALID');
    }, (response) => {
      if (response.status === 401) {
        return deferred.resolve('NOT_PUBLIC');
      }
      return deferred.resolve('DELETED');
    })
    .catch( (err) => {
      deferred.reject(err);
    });

    return deferred.promise;
  };

}

angular.module('risevision.template-editor.services')
  .factory('slidesUrlValidationService', downgradeInjectable(SlidesUrlValidationServiceService));
