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
      'tmp/locales/translation_')
    .constant('LOCALES_SUFIX', '.json');

  angular.module('risevision.common.config')
    .value('CORE_URL', 'https://rvacore-test.appspot.com/_ah/api'); // override default core value

  angular.module('risevision.apps.config', [])
    .value('APPS_ENV', 'TEST')
    .value('ENCODING_MASTER_SWITCH_URL',
      'https://storage.googleapis.com/risemedialibrary/encoding-switch-on')
    .value('STORAGE_API_ROOT',
      'https://storage-dot-rvacore-test.appspot.com/_ah/api')
    .value('STORE_ENDPOINT_URL',
      'https://store-dot-rvacore-test.appspot.com/_ah/api') // override default Store server value
    .value('STORE_SERVER_URL', 'https://store-dot-rvacore-test.appspot.com/')
    .value('RVA_URL', 'http://rva-test.appspot.com')
    .value('VIEWER_URL', 'https://widgets.risevision.com/viewer-stage-0')
    .value('SHARED_SCHEDULE_URL', 'https://widgets.risevision.com/viewer-stage-0/?type=sharedschedule&id=SCHEDULE_ID')
    .value('ALERTS_WS_URL',
      'https://rvacore-test.appspot.com/alerts/cap')
    .value('TAG_MANAGER_CONTAINER_ID', null)
    .value('TAG_MANAGER_AUTH', null)
    .value('TAG_MANAGER_ENV', null)
    .value('STORAGE_ENDPOINT_URL',
      'https://storage-dot-rvacore-test.appspot.com/_ah/api')
    .value('MESSAGING_PRIMUS_URL',
      'https://services-stage.risevision.com/messaging/primus?displayId=apps&machineId=1')
    .value('APPS_URL', '')
    .value('ENV_NAME', 'TEST')
    .value('OAUTH_TOKEN_PROVIDER_URL', 'https://services-stage.risevision.com/oauthtokenprovider/')
    .value('TWITTER_SERVICE_URL', 'https://services-stage.risevision.com/twitter/')
    .value('OAUTH_PUBLIC_KEY', 'EJMI-lB9hB55OYEsYmjXDNfRGoY')
    .value('STRIPE_PROD_KEY', 'pk_test_GrMIAHSoqhaik4tcHepsxjOR')
    .value('STRIPE_TEST_KEY', 'pk_test_GrMIAHSoqhaik4tcHepsxjOR')
    .value('HUBSPOT_ACCOUNT', '2939619')
    .value('HTML_TEMPLATE_URL', 'https://widgets.risevision.com/staging/templates/PRODUCT_CODE/src/template.html')
    .value('BLUEPRINT_URL', 'https://widgets.risevision.com/staging/templates/PRODUCT_CODE/blueprint.json');

})(angular);
