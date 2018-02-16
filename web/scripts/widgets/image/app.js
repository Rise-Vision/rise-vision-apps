angular.module('risevision.widget.image.settings', [
  'risevision.common.i18n',
  'risevision.widget.common',
  'risevision.widget.common.widget-button-toolbar',
  'risevision.widget.common.position-setting',
  'risevision.widget.common.tooltip',
  'risevision.widget.common.file-selector'
])
.run(['defaultSettings', function(defaultSettings) {
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
