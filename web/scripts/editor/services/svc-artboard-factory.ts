'use strict';

angular.module('risevision.editor.services')
  .constant('PRESENTATION_BORDER_SIZE', 12)
  .constant('PRESENTATION_MARGIN_TOP', 0)
  .constant('PRESENTATION_SIDEBAR_SIZE', 290)
  .factory('artboardFactory', ['$state', 'editorFactory', 'placeholderFactory',
    'PRESENTATION_BORDER_SIZE', 'PRESENTATION_MARGIN_TOP',
    'PRESENTATION_SIDEBAR_SIZE',
    function ($state, editorFactory, placeholderFactory,
      PRESENTATION_BORDER_SIZE, PRESENTATION_MARGIN_TOP,
      PRESENTATION_SIDEBAR_SIZE) {
      var factory = {};
      // Need to account for sidebar size when switching from 
      // HTML mode to artboard
      var sidebarTransition = false;

      factory.zoomLevel = 0.5;
      if ($state.current.name === 'apps.editor.workspace.htmleditor') {
        factory.designMode = false;
      } else {
        factory.designMode = true;
      }

      factory.showArtboard = function () {
        return editorFactory.validatePresentation()
          .then(function () {
            sidebarTransition = !factory.fullArtboard;

            factory.designMode = true;
            $state.go('apps.editor.workspace.artboard');
          });
      };

      factory.showHtmlEditor = function () {
        factory.designMode = false;
        $state.go('apps.editor.workspace.htmleditor');
      };

      factory.compressArtboard = function () {
        factory.fullArtboard = false;
      };

      factory.expandArtboard = function () {
        factory.fullArtboard = true;

        placeholderFactory.clearPlaceholder();
      };

      factory.isFullArtboard = function () {
        return factory.fullArtboard && !placeholderFactory.placeholder;
      };

      factory.hideSidebar = function () {
        return !factory.designMode || factory.isFullArtboard();
      };

      factory.canZoomIn = function () {
        return factory.zoomLevel <= 1.99;
      };

      factory.canZoomOut = function () {
        return factory.zoomLevel >= 0.21;
      };

      factory.zoomIn = function () {
        if (factory.canZoomIn()) {
          factory.zoomLevel = Math.floor(factory.zoomLevel * 10 + 1) / 10;
        }
      };

      factory.zoomOut = function () {
        if (factory.canZoomOut()) {
          factory.zoomLevel = Math.ceil(factory.zoomLevel * 10 - 1) / 10;
        }
      };

      factory.zoomFit = function () {
        if (!factory.getWorkspaceElement) {
          return;
        }

        var workspaceElement = factory.getWorkspaceElement();
        var workspaceWidth = workspaceElement.clientWidth -
          (sidebarTransition ? PRESENTATION_SIDEBAR_SIZE : 0);
        var workspaceHeight = workspaceElement.clientHeight - PRESENTATION_MARGIN_TOP;
        var artboardWidth = editorFactory.presentation.width + 2 * PRESENTATION_BORDER_SIZE;
        var artboardHeight = editorFactory.presentation.height + 2 * PRESENTATION_BORDER_SIZE;

        var fitWidth = workspaceWidth / artboardWidth;
        var fitHeight = workspaceHeight / artboardHeight;
        var fitRatio = Math.min(fitWidth, fitHeight);
        fitRatio = Math.min(2, fitRatio);
        fitRatio = Math.max(0.2, fitRatio);

        sidebarTransition = false;
        factory.zoomLevel = fitRatio;
      };

      factory.zoomPercent = function (argument) {
        factory.zoomLevel = argument / 100;
      };

      return factory;
    }
  ]);
