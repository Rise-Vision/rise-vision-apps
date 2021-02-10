'use strict';

angular.module('risevision.common.components.distribution-selector.services', [
  'risevision.common.gapi'
]);

angular.module('risevision.common.components.distribution-selector', [
  'risevision.common.components.distribution-selector.services',
  'risevision.common.components.scrolling-list',
  'risevision.common.components.loading',
  'ui.bootstrap'
]);
