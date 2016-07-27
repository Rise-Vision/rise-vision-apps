'use strict';

angular.module('risevision.editor.controllers')
  .controller('PlaylistItemModalController', ['$scope',
    'placeholderPlaylistFactory', 'widgetModalFactory', 'gadgetFactory',
    '$modalInstance', 'item', 'editorFactory', 'userState', 'RVA_URL',
    function ($scope, placeholderPlaylistFactory, widgetModalFactory,
      gadgetFactory, $modalInstance, item, editorFactory, userState, 
      RVA_URL) {
      $scope.PREVIOUS_EDITOR_URL = RVA_URL + '/#/PRESENTATION_MANAGE' + ((
          editorFactory.presentation.id) ? '/id=' + editorFactory.presentation
        .id : '') + '?cid=' + userState.getSelectedCompanyId();
      $scope.widgetModalFactory = widgetModalFactory;
      $scope.item = angular.copy(item);

      if (!item.objectReference && item.settingsUrl) {
        $scope.widgetName = item.name;
      } else {
        if (item.objectReference && item.type === 'widget') {
          gadgetFactory.getGadget(item.objectReference).then(function (gadget) {
            $scope.widgetName = gadget.name;
          });
        }
      }

      $scope.save = function () {
        angular.copy($scope.item, item);

        placeholderPlaylistFactory.updateItem(item);

        $scope.dismiss();
      };

      $scope.dismiss = function () {
        $modalInstance.dismiss();
      };
    }
  ]); //ctr
