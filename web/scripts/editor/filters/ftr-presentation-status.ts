'use strict';

// Revision Status Filter
angular.module('risevision.editor.filters')
  .filter('presentationStatus', ['translateFilter',
    function (translateFilter) {
      return function (revisionStatusName) {
        if (revisionStatusName === 'Published') {
          return translateFilter(
            'editor-app.details.published'
          );
        } else if (revisionStatusName === 'Revised') {
          return translateFilter(
            'editor-app.details.revised'
          );
        } else {
          return 'N/A';
        }
      };
    }
  ]);
