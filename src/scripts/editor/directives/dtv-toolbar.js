'use strict';

angular.module('risevision.editor.directives')
  .directive('toolbar', ['artboardFactory', 'editorFactory',
    'placeholdersFactory',
    function (artboardFactory, editorFactory, placeholdersFactory) {
      return {
        restrict: 'E',
        templateUrl: 'partials/editor/toolbar.html',
        link: function ($scope) {
          $scope.artboardFactory = artboardFactory;

          $scope.addNewPlaceholder = function () {
            placeholdersFactory.addNewPlaceholder();
          };

          $scope.openProperties = function () {
            editorFactory.openPresentationProperties();
          };
        } //link()
      };
    }
  ]);
