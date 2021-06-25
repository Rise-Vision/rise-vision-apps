'use strict';

angular.module('risevision.editor.controllers')
  .controller('PlaylistItemModalController', ['$scope',
    'placeholderPlaylistFactory', 'settingsFactory', 'gadgetFactory', '$modalInstance',
    'item', 'editorFactory', 'userState', 'environment',
    function ($scope, placeholderPlaylistFactory, settingsFactory, gadgetFactory,
      $modalInstance, item, editorFactory, userState, environment) {
      $scope.PREVIOUS_EDITOR_URL = environment.RVA_URL + '/#/PRESENTATION_MANAGE' + ((
          editorFactory.presentation.id) ? '/id=' + editorFactory.presentation
        .id : '') + '?cid=' + userState.getSelectedCompanyId();
      $scope.item = angular.copy(item);

      if (item.type === 'presentation') {
        $scope.widgetName = 'editor-app.playlistItem.presentation.name';
      } else if (!item.objectReference && item.settingsUrl) {
        $scope.widgetName = item.name;
      } else if (item.objectReference && item.type === 'widget') {
        gadgetFactory.getGadgetById(item.objectReference)
          .then(function (gadget) {
            $scope.widgetName = gadget.name;
          });
      }

      $scope.showSettingsModal = function () {
        settingsFactory.showSettingsModal($scope.item, true);
      };

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
