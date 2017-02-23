'use strict';

angular.module('risevision.editor.directives')
  .directive('toolbar', ['editorFactory', 'placeholdersFactory', '$modal', '$state', 'messageBox',
    function (editorFactory, placeholdersFactory, $modal, $state, messageBox) {
      return {
        restrict: 'E',
        templateUrl: 'partials/editor/toolbar.html',
        link: function ($scope) {
          $scope.addNewPlaceholder = function () {
            placeholdersFactory.addNewPlaceholder();
          };

          $scope.openProperties = function () {
            editorFactory.openPresentationProperties();
          };

          $scope.showArtboard = function () {
            if(editorFactory.validatePresentation().jsonParseError) {
              messageBox('editor-app.json-error.title', 'editor-app.json-error.message');
            }
            else {
              $scope.designMode = true;
              $state.go('apps.editor.workspace.artboard');
            }
          };

          $scope.showHtmlEditor = function () {
            $scope.designMode = false;
            $state.go('apps.editor.workspace.htmleditor');
          };
        } //link()
      };
    }
  ]);
