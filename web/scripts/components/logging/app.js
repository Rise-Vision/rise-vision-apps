(function (angular) {
  'use strict';

  try {
    angular.module('risevision.common.config');
  } catch (err) {
    angular.module('risevision.common.config', []);
  }

  angular.module('risevision.common.config')
    .value('ENABLE_EXTERNAL_LOGGING', true);

  angular.module('risevision.common.components.logging', [
    'risevision.common.components.scrolling-list'
  ]);

})(angular);
