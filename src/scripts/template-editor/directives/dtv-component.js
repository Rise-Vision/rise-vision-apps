'use strict';

angular.module('risevision.template-editor.directives')
  .directive('templateComponent', ['componentsFactory', 'storageManagerFactory',
    function (componentsFactory, storageManagerFactory) {
      return {
        restrict: 'E',
        scope: {},
        templateUrl: 'partials/template-editor/component.html',
        link: function ($scope) {
          $scope.componentsFactory = componentsFactory;
          $scope.storageManagerFactory = storageManagerFactory;
        }
      };
    }
  ]);
