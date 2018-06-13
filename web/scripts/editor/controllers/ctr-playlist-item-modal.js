'use strict';

angular.module('risevision.editor.controllers')
  .controller('PlaylistItemModalController', ['$scope',
    'placeholderPlaylistFactory', 'settingsFactory', 'gadgetFactory', '$modalInstance',
    'item', 'editorFactory', 'userState', 'plansFactory', 'RVA_URL', 'EMBEDDED_PRESENTATIONS_CODE',
    function ($scope, placeholderPlaylistFactory, settingsFactory, gadgetFactory,
      $modalInstance, item, editorFactory, userState, plansFactory, RVA_URL, EMBEDDED_PRESENTATIONS_CODE) {
      var plansProductCodes = [EMBEDDED_PRESENTATIONS_CODE];

      $scope.PREVIOUS_EDITOR_URL = RVA_URL + '/#/PRESENTATION_MANAGE' + ((
          editorFactory.presentation.id) ? '/id=' + editorFactory.presentation
        .id : '') + '?cid=' + userState.getSelectedCompanyId();
      $scope.item = angular.copy(item);
      $scope.showPlansModal = plansFactory.showPlansModal;

      if (item.type === 'presentation') {
        $scope.widgetName = 'editor-app.playlistItem.presentation.name';
      } else if (!item.objectReference && item.settingsUrl) {
        $scope.widgetName = item.name;
      } else {
        if (item.objectReference && item.type === 'widget') {
          if (item.gadget && plansProductCodes.indexOf(item.gadget.productCode) >= 0) {
            $scope.isPlansProductCode = true;
          }

          gadgetFactory.getGadgetById(item.objectReference)
            .then(function (gadget) {
              $scope.widgetName = gadget.name;
            });
        }
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
