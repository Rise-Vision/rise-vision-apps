(function (angular) {
  'use strict';

  try {
    angular.module('risevision.common.config');
  } catch (err) {
    angular.module('risevision.common.config', []);
  }

  angular.module('risevision.common.config')
    .value('ENABLE_EXTERNAL_LOGGING', true)
    // Google Tag Manager Stage environment
    .value('TAG_MANAGER_CONTAINER_ID', 'GTM-MZJ2NQX')

  angular.module('risevision.common.components.logging', [
    'risevision.common.components.scrolling-list'
  ]);

})(angular);
