(function (angular) {
  'use strict';

  try {
    angular.module('risevision.common.config');
  } catch (err) {
    angular.module('risevision.common.config', []);
  }

  angular.module('risevision.common.config')
    .value('ENABLE_EXTERNAL_LOGGING', true)
    // Production API key
    .value('SEGMENT_API_KEY', 'pFutwqoxdVfhEF0J948V28YuzNLIP3MY');

  angular.module('risevision.common.components.logging', [
    'risevision.common.components.scrolling-list'
  ]);

})(angular);
