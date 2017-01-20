'use strict';

angular.module('risevision.editor.directives')
  .directive('workspaceElement', ['placeholdersFactory',
    function (placeholdersFactory) {
      return {
        restrict: 'A',
        link: function ($scope, $element) {
          // Used to determine new placeholder placement based on 
          // workspace size & scroll location
          placeholdersFactory.getWorkspaceElement = function () {
            return $element[0];
          };
        }
      };
    }
  ]);
