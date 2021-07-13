import { Injectable } from '@angular/core';
import * as angular from 'angular';
import { downgradeInjectable } from '@angular/upgrade/static';

@Injectable({
  providedIn: 'root'
})
export class ComponentUtilsService {

  constructor() { }

  isValidUrl(value) {
    // Ported regular expression from url-field directive used in several widget settings (RSS, Spreadsheet, Web Page Widget, etc)
    // https://github.com/Rise-Vision/widget-settings-ui-components/blob/master/src/_angular/url-field/dtv-url-field.js#L66-L86
    var urlRegExp =
      /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u00a1-\uffff][a-z0-9\u00a1-\uffff_-]{0,62})?[a-z0-9\u00a1-\uffff]\.)+(?:[a-z\u00a1-\uffff]{2,}\.?))(?::\d{2,5})?(?:[/?#]\S*)?$/i;

    // Add http:// if no protocol parameter exists
    if (value.indexOf('://') === -1) {
      value = 'http://' + value;
    }

    return urlRegExp.test(value);
  };

}

angular.module('risevision.template-editor.services')
  .factory('componentUtils', downgradeInjectable(ComponentUtilsService));