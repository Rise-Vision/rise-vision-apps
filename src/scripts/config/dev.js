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
    .constant('LOCALES_PREFIX', 'tmp/locales/translation_')
    .constant('LOCALES_SUFIX', '.json');

})(angular);
