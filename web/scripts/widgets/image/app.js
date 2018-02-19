'use strict';

angular.module('risevision.widgets.image', [
    'risevision.widget.common.widget-button-toolbar',
    'risevision.widget.common.position-setting',
    'risevision.widget.common.tooltip',
    'risevision.widget.common.file-selector',
    'risevision.widgets.services'
  ])
  .run(['defaultSettings', function (defaultSettings) {
    defaultSettings.imageWidget = {
      'params': {},
      'additionalParams': {
        'selector': {},
        'storage': {},
        'resume': true,
        'scaleToFit': true,
        'position': 'middle-center',
        'duration': 10,
        'pause': 10,
        'autoHide': false,
        'url': '',
        'background': {}
      }
    };
  }]);
