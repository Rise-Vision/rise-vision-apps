'use strict';

angular.module('risevision.common.components.canva-type-picker.services', [
    'ui.bootstrap'
  ])
  .factory('canvaTypePicker', ['$modal',
    function ($modal) {
      return function () {
        var options = {
          templateUrl: 'partials/components/canva-type-picker/canva-type-picker.html',
          controller: 'canvaTypePickerController',
          windowClass: 'madero-style centered-modal',
          size: 'sm'          
        };
        return $modal.open(options).result;
      };
    }
  ]);
