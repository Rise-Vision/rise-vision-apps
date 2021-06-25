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

  angular.module('risevision.common.config')
    // Mock Angular environment variable
    .value('environment', {
      APPS_ENV: 'TEST',
      TAG_MANAGER_CONTAINER_ID: null,
      TAG_MANAGER_AUTH: null,
      TAG_MANAGER_ENV: null,
      APPS_URL: '',
      ENV_NAME: 'TEST',
      HTML_TEMPLATE_URL: 'https://widgets.risevision.com/staging/templates/PRODUCT_CODE/src/template.html'
    });

})(angular);
