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
    .constant('LOCALES_PREFIX', 'locales/translation_')
    .constant('LOCALES_SUFIX', '.json');

  angular.module('risevision.common.config')
    .value('CORE_URL', 'https://rvacore-test.appspot.com/_ah/api'); // override default core value

  angular.module('risevision.apps.config', [])
    .value('STORAGE_API_ROOT',
      'https://storage-dot-rvacore-test.appspot.com/_ah/api')
    .value('STORE_ENDPOINT_URL',
      'https://store-dot-rvacore-test.appspot.com/_ah/api') // override default Store server value
    .value('STORE_SERVER_URL', 'https://store-dot-rvacore-test.appspot.com/')
    .value('RVA_URL', 'http://rva-test.appspot.com')
    .value('VIEWER_URL', 'http://rvaviewer-test.appspot.com')
    .value('ALERTS_WS_URL',
      'https://rvacore-test.appspot.com/alerts/cap')
    .value('RENDER_WIDGETS', {
      // test widgets
      'TEXT_WIDGET': '64cc543c-c2c6-49ab-a4e9-40ceba48a253',
      'IMAGE_WIDGET': '2707fc05-5051-4d7b-bcde-01fafd6eaa5e',
      'TIME_AND_DATE_WIDGET': '23e390be-8abb-4569-9084-e89722038895',
      'RSS_WIDGET': 'b656647d-757e-448d-ab3d-b819b4244dcf',
      'WEB_PAGE_WIDGET': 'aab933d7-ec65-499d-8c6f-e0081b8ea2ee',
      // production widgets
      'TEXT_WIDGET_PROD': '32d460d1-a727-4765-a8e9-587f7915ab05',
      'TEXT_WIDGET_PROD_OLD': 'ba0da120-7c67-437f-9caf-73585bd30c74',
      'IMAGE_WIDGET_PROD': '5233a598-35ce-41a4-805c-fd2147f144a3',
      'TIME_AND_DATE_WIDGET_PROD': '8b984369-f83c-4eca-add6-e431d338eaff',
      'RSS_WIDGET_PROD': '82e64a53-c863-4c69-b8a2-add30580ff53',
      'WEB_PAGE_WIDGET_PROD': 'df887785-3614-4f05-86c7-fce07b8745dc'
    })
    .value('VIDEO_WIDGET', '4bf6fb3d-1ead-4bfb-b66f-ae1fcfa3c0c6')
    .value('VIDEO_WIDGET_PROD', 'a7261343-1b0b-4150-a051-25d6e1b45136')

  .value('STORAGE_ENDPOINT_URL',
    'https://storage-dot-rvacore-test.appspot.com/_ah/api');

})(angular);
