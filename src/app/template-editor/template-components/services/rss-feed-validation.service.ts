import { Injectable } from '@angular/core';
import * as angular from 'angular';
import { downgradeInjectable } from '@angular/upgrade/static';
import { PromiseUtilsService } from 'src/app/shared/services/promise-utils.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RssFeedValidationService {
  public static readonly PROXY_URL = 'https://proxy.risevision.com/';
  public static readonly VALIDATOR_URL = 'https://validator.w3.org/feed/check.cgi?url=';
  public static readonly FEED_PARSER_URL = 'https://feed-parser.risevision.com/';

  constructor(
    private promiseUtils: PromiseUtilsService,
    private httpClient: HttpClient
  ) { } 

  isValid (url) {
    if (!url) {
      return Promise.resolve('');
    }

    var deferred = this.promiseUtils.generateDeferredPromise();

    this.httpClient.get(RssFeedValidationService.PROXY_URL + RssFeedValidationService.VALIDATOR_URL + url + '&output=soap12', { 
      responseType: 'text',
      observe: 'response'})
      .toPromise()
      .then( (response: any) => {
        var parsed,
          validationResponse,
          isValid;

        if (response && response.body) {
          parsed = (window as any).xmlToJSON.parseString(response.body);
          validationResponse = parsed.Envelope[0].Body[0].feedvalidationresponse[0];

          isValid = validationResponse.validity[0]._text;

          return isValid ? deferred.resolve('VALID') : deferred.resolve('INVALID_FEED');
        }

      }, (response) => {
        console.debug('Validation request failed with status code ' + response.status + ': ' + response
          .statusText);
        // assume it's valid
        return deferred.resolve('VALID');
      })
      .catch( (err) => {
        deferred.reject(err);
      });

    return deferred.promise;
  };

  isParsable(url) {
    if (!url) {
      return Promise.resolve('');
    }

    var deferred = this.promiseUtils.generateDeferredPromise();

    this.httpClient.get(RssFeedValidationService.FEED_PARSER_URL + url, { 
      responseType: 'text',
      observe: 'response'})
      .toPromise()
      .then( (response: any) => {        
        var error;

        if (response && response.body) {
          var data = JSON.parse(response.body);
          error = data.Error;

          if (!error) {
            return deferred.resolve('VALID');
          }

          if (error === '401 Unauthorized') {
            return deferred.resolve('UNAUTHORIZED');
          } else if (error === 'Not a feed') {
            return deferred.resolve('NON_FEED');
          } else if (error.indexOf('ENOTFOUND') !== -1 || error.indexOf('404') !== -1) {
            return deferred.resolve('NOT_FOUND');
          }

          // If neither of the errors above, assume the feed is parsable, as the error could regard a variety of reasons
          return deferred.resolve('VALID');
        }

        // assume it's parsable
        return deferred.resolve('VALID');

      }, (response) => {
        console.debug('Feed parser check failed with status code ' + response.status + ': ' + response
          .statusText);

        // assume it's parsable
        return deferred.resolve('VALID');
      })
      .catch( (err) => {
        deferred.reject(err);
      });

    return deferred.promise;
  };

}

angular.module('risevision.template-editor.services')
  .factory('rssFeedValidation', downgradeInjectable(RssFeedValidationService));
