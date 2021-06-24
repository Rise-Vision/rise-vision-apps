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
      // override default Store server value
      STORE_SERVER_URL: 'https://store-dot-rvacore-test.appspot.com/',
      RVA_URL: 'http://rva-test.appspot.com',
      VIEWER_URL: 'https://widgets.risevision.com/viewer-stage-0',
      SHARED_SCHEDULE_URL: 'https://widgets.risevision.com/viewer-stage-0/?type=sharedschedule&id=SCHEDULE_ID',
      ALERTS_WS_URL: 'https://rvacore-test.appspot.com/alerts/cap',
      TAG_MANAGER_CONTAINER_ID: null,
      TAG_MANAGER_AUTH: null,
      TAG_MANAGER_ENV: null,
      MESSAGING_PRIMUS_URL: 'https://services-stage.risevision.com/messaging/primus?displayId=apps&machineId=1',
      APPS_URL: '',
      ENV_NAME: 'TEST',
      OAUTH_TOKEN_PROVIDER_URL: 'https://services-stage.risevision.com/oauthtokenprovider/',
      TWITTER_SERVICE_URL: 'https://services-stage.risevision.com/twitter/',
      OAUTH_PUBLIC_KEY: 'EJMI-lB9hB55OYEsYmjXDNfRGoY',
      HUBSPOT_ACCOUNT: '2939619',
      HTML_TEMPLATE_URL: 'https://widgets.risevision.com/staging/templates/PRODUCT_CODE/src/template.html'
    })
    .value('STORE_SERVER_URL', 'https://store-dot-rvacore-test.appspot.com/')
    .value('RVA_URL', 'http://rva-test.appspot.com')
    .value('VIEWER_URL', 'https://widgets.risevision.com/viewer-stage-0')
    .value('SHARED_SCHEDULE_URL', 'https://widgets.risevision.com/viewer-stage-0/?type=sharedschedule&id=SCHEDULE_ID')
    .value('ALERTS_WS_URL',
      'https://rvacore-test.appspot.com/alerts/cap')
    .value('TAG_MANAGER_CONTAINER_ID', null)
    .value('TAG_MANAGER_AUTH', null)
    .value('TAG_MANAGER_ENV', null)
    .value('MESSAGING_PRIMUS_URL',
      'https://services-stage.risevision.com/messaging/primus?displayId=apps&machineId=1')
    .value('APPS_URL', '')
    .value('ENV_NAME', 'TEST')
    .value('OAUTH_TOKEN_PROVIDER_URL', 'https://services-stage.risevision.com/oauthtokenprovider/')
    .value('TWITTER_SERVICE_URL', 'https://services-stage.risevision.com/twitter/')
    .value('OAUTH_PUBLIC_KEY', 'EJMI-lB9hB55OYEsYmjXDNfRGoY')
    .value('HUBSPOT_ACCOUNT', '2939619')
    .value('HTML_TEMPLATE_URL', 'https://widgets.risevision.com/staging/templates/PRODUCT_CODE/src/template.html');

})(angular);
