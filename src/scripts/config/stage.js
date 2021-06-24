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
    .value('STORE_SERVER_URL', 'https://store-dot-rvacore-test.appspot.com/')
    .value('RVA_URL', 'http://rva-test.appspot.com')
    .value('VIEWER_URL', 'https://widgets.risevision.com/viewer-stage-0')
    .value('SHARED_SCHEDULE_URL', 'https://widgets.risevision.com/viewer-stage-0/?type=sharedschedule&id=SCHEDULE_ID')
    .value('ALERTS_WS_URL',
      'https://rvacore-test.appspot.com/alerts/cap')
    .value('TAG_MANAGER_CONTAINER_ID', 'GTM-MMTK3JH')
    .value('TAG_MANAGER_AUTH', 'Ry3lxk_Xrlx2qhbXmLA-Pg')
    .value('TAG_MANAGER_ENV', 'env-254')
    .value('MESSAGING_PRIMUS_URL',
      'https://services-stage.risevision.com/messaging/primus?displayId=apps&machineId=1')
    .value('APPS_URL', '')
    .value('ENV_NAME', 'STAGE')
    .value('OAUTH_TOKEN_PROVIDER_URL', 'https://services-stage.risevision.com/oauthtokenprovider/')
    .value('TWITTER_SERVICE_URL', 'https://services-stage.risevision.com/twitter/')
    .value('OAUTH_PUBLIC_KEY', 'EJMI-lB9hB55OYEsYmjXDNfRGoY')
    .value('HUBSPOT_ACCOUNT', '2939619')
    .value('HTML_TEMPLATE_URL', 'https://widgets.risevision.com/staging/templates/PRODUCT_CODE/src/template.html');

})(angular);
