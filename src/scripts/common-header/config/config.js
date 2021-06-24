/*
 * App Configuration File
 * Put environment-specific global variables in this file.
 *
 * In general, if you put an variable here, you will want to
 * make sure to put an equivalent variable in all three places:
 * dev.js, stage.js & prod.js
 *
 */
(function (angular) {
  'use strict';

  try {
    angular.module('risevision.common.config');
  } catch (err) {
    angular.module('risevision.common.config', []);
  }

  angular.module('risevision.common.i18n.config', [])
    .constant('LOCALES_PREFIX', 'locales/translation_')
    .constant('LOCALES_SUFIX', '.json');

  angular.module('risevision.common.config')
    .value('environment', {
      CORE_URL: 'https://rvaserver2.appspot.com/_ah/api',
      STORE_SERVER_URL: 'https://store-dot-rvaserver2.appspot.com/',
      STORE_ENDPOINT_URL: 'https://store-dot-rvacore-test.appspot.com/_ah/api',
      STORAGE_ENDPOINT_URL: 'https://storage-dot-rvacore-test.appspot.com/_ah/api',
      APPS_URL: '',
      ENV_NAME: '',
    })
    .value('ENABLE_EXTERNAL_LOGGING', true);
})(angular);
