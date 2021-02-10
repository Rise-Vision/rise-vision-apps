'use strict';

angular.module('risevision.editor.filters')
  .filter('presentationLink', ['presentationUtils',
    function (presentationUtils) {
      return function (presentation) {
        if (!presentationUtils.isHtmlPresentation(presentation)) {
          return 'apps.editor.workspace.artboard({ presentationId: presentation.id })';
        } else {
          return 'apps.editor.templates.edit({ presentationId: presentation.id })';
        }
      };
    }
  ]);
