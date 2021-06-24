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
      STORE_ENDPOINT_URL: 'https://store-dot-rvacore-test.appspot.com/_ah/api',
      STORAGE_ENDPOINT_URL: 'https://storage-dot-rvacore-test.appspot.com/_ah/api'
    })
    .value('ENABLE_EXTERNAL_LOGGING', true)
    .value('STORE_URL', 'https://store.risevision.com/')
    .value('STORE_SERVER_URL',
      'https://store-dot-rvaserver2.appspot.com/')
    .value('APPS_URL', 'https://apps.risevision.com')
    .value('STRIPE_PROD_KEY', 'pk_live_31dWkTWQU125m2RcWpK4HQBR')
    .value('STRIPE_TEST_KEY', 'pk_test_GrMIAHSoqhaik4tcHepsxjOR');
})(angular);
