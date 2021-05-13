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

          $scope.registerDirective = componentsFactory.registerDirective;
          $scope.editComponent = componentsFactory.editComponent;
          $scope.showPreviousPage = componentsFactory.showPreviousPage;
          $scope.resetPanelHeader = componentsFactory.resetPanelHeader;
          $scope.setPanelIcon = componentsFactory.setPanelIcon;
          $scope.setPanelTitle = componentsFactory.setPanelTitle;
        }
      };
    }
  ]);
