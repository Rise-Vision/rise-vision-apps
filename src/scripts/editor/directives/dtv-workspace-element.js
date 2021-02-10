'use strict';

angular.module('risevision.editor.directives')
  .directive('workspaceElement', ['artboardFactory',
    function (artboardFactory) {
      return {
        restrict: 'A',
        link: function ($scope, $element) {
          // Used to determine new placeholder placement based on 
          // workspace size & scroll location
          artboardFactory.getWorkspaceElement = function () {
            return $element[0];
          };
        }
      };
    }
  ]);
