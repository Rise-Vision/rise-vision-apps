'use strict';

angular.module('risevision.editor.services')
  .factory('showLegacyWarning', ['$window', '$modal', 'RVA_URL',
    function ($window, $modal, RVA_URL) {
      return function (presentation) {
        var modalInstance = $modal.open({
          templateUrl: 'partials/components/confirm-modal/confirm-modal.html',
          controller: 'confirmModalController',
          windowClass: 'modal-custom',
          resolve: {
            confirmationTitle: function () {
              return 'editor-app.workspace.legacyWarning.title';
            },
            confirmationMessage: function () {
              return 'editor-app.workspace.legacyWarning.message';
            },
            confirmationButton: function () {
              var confirmation =
                'editor-app.workspace.legacyWarning.confirmation';
              return confirmation;
            },
            cancelButton: null
          }
        });

        return modalInstance.result
          .then(function () {
            $window.location.href = RVA_URL +
              '/#/PRESENTATION_MANAGE/id=' + presentation.id +
              '?cid=' + presentation.companyId;
          })
          .catch(function () {});
      };

    }
  ]);
