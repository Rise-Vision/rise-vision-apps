'use strict';
angular.module('risevision.editor.controllers')
  .controller('SharedTemplatesModalController', ['$scope',
    'ScrollingListService', 'template', 'editorFactory', '$loading',
    '$filter', '$modalInstance',
    function ($scope, ScrollingListService, template, editorFactory,
      $loading, $filter, $modalInstance) {
      $scope.search = {
        sortBy: 'name',
        reverse: false
      };

      $scope.factory = new ScrollingListService(template.list,
        $scope.search);
      $scope.editorFactory = editorFactory;

      $scope.filterConfig = {
        placeholder: $filter('translate')(
          'editor-app.sharedTemplates.search'),
        id: 'templateSearchInput'
      };

      $scope.$watch('factory.loadingItems', function (loading) {
        if (loading) {
          $loading.start('template-list-loader');
        } else {
          $loading.stop('template-list-loader');
        }
      });

      $scope.select = function (templateId) {
        $modalInstance.close(templateId);
      };

      $scope.dismiss = function () {
        $modalInstance.dismiss();
      };
    }
  ]);
