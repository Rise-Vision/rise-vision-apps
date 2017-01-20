/*
 * App Configuration File
 * Put environment-specific global variables in this file.
 *
 * In general, if you put an variable here, you will want to
 * make sure to put an equivalent variable in all three places:
 * dev.js, test.js & prod.js
 *
 */

(function (angular) {

  'use strict';

  angular.module('risevision.common.i18n.config', [])
    .constant('LOCALES_PREFIX',
      'bower_components/rv-common-i18n/dist/locales/translation_')
    .constant('LOCALES_SUFIX', '.json');

  angular.module('risevision.common.config')
    .value('CORE_URL', 'https://rvacore-test.appspot.com/_ah/api'); // override default core value   

  angular.module('risevision.apps.config', [])
    .value('APPS_ENV', 'TEST')
    .value('STORAGE_API_ROOT',
      'https://storage-dot-rvacore-test.appspot.com/_ah/api')
    .value('STORE_ENDPOINT_URL',
      'https://store-dot-rvacore-test.appspot.com/_ah/api') // override default Store server value
    .value('STORE_SERVER_URL', 'https://store-dot-rvacore-test.appspot.com/')
    .value('RVA_URL', 'http://rva-test.appspot.com')
    .value('VIEWER_URL', 'http://rvaviewer-test.appspot.com')
    .value('ALERTS_WS_URL',
      'https://rvacore-test.appspot.com/alerts/cap')
    .value('SEGMENT_API_KEY', null)
    .value('STORAGE_ENDPOINT_URL',
      'https://storage-dot-rvacore-test.appspot.com/_ah/api')
    .value('MESSAGING_URL',
      'https://display-messaging-staging.risevision.com')
    .value('APPS_URL', '');

})(angular);
