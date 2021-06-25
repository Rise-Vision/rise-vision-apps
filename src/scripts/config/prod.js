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
    .value('SHARED_SCHEDULE_URL', 'https://widgets.risevision.com/viewer/?type=sharedschedule&id=SCHEDULE_ID')
    .value('ALERTS_WS_URL',
      'https://rvaserver2.appspot.com/alerts/cap')
    .value('TAG_MANAGER_CONTAINER_ID', 'GTM-MMTK3JH')
    .value('TAG_MANAGER_AUTH', null)
    .value('TAG_MANAGER_ENV', null)
    .value('MESSAGING_PRIMUS_URL',
      'https://services.risevision.com/messaging/primus?displayId=apps&machineId=1')
    .value('OAUTH_TOKEN_PROVIDER_URL', 'https://services.risevision.com/oauthtokenprovider/')
    .value('TWITTER_SERVICE_URL',
      'https://services.risevision.com/twitter/')
    .value('OAUTH_PUBLIC_KEY', 'EJMI-lB9hB55OYEsYmjXDNfRGoY')
    .value('HUBSPOT_ACCOUNT', '2700250')
    .value('HTML_TEMPLATE_URL', 'https://widgets.risevision.com/stable/templates/PRODUCT_CODE/src/template.html');

})(angular);
