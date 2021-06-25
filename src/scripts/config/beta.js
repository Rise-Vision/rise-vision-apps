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
    .value('OAUTH_TOKEN_PROVIDER_URL', 'https://services.risevision.com/oauthtokenprovider/');

})(angular);
