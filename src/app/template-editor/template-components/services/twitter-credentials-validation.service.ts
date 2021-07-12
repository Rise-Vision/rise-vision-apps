import { HttpClient, HttpParams, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PromiseUtilsService } from 'src/app/shared/services/promise-utils.service';
import { environment } from 'src/environments/environment';
import * as angular from 'angular';
import { downgradeInjectable } from '@angular/upgrade/static';

@Injectable({
  providedIn: 'root'
})
export class TwitterCredentialsValidationService {
  public static readonly VERIFY_CREDENTIALS = 'verify-credentials';

  constructor(
    private promiseUtils: PromiseUtilsService,
    private httpClient: HttpClient
  ) { }

  verifyCredentials(companyId) {
    var deferred = this.promiseUtils.generateDeferredPromise();

    const request = new HttpRequest( 'GET',
      environment.TWITTER_SERVICE_URL + TwitterCredentialsValidationService.VERIFY_CREDENTIALS, {
        withCredentials: true,
        responseType: 'json',
        params: new HttpParams({fromObject:{
          companyId: companyId
        }})
      }
    );
    this.httpClient.request(request).toPromise().then((response: any) => {
      if (response && response.body) {
        deferred.resolve(response.body.success);
      }
    }).catch( (err) => {
      console.error('Failed to verify twitter credentials.', err);
      deferred.reject(err);
    });

    return deferred.promise;
  };

}

angular.module('risevision.template-editor.services')
  .factory('twitterCredentialsValidation', downgradeInjectable(TwitterCredentialsValidationService));