'use strict';
angular.module('risevision.widgets.twitter', [
    'risevision.widgets.directives',
    'risevision.widgets.services'
  ])
  .run(['defaultSettings', function (defaultSettings) {
    defaultSettings.twitterWidget = {
      'params': {},
      'additionalParams': {
        'screenName': '',
        'componentId': ''
      }
    };
  }]);
