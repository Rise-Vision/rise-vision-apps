'use strict';

angular.module('risevision.editor.services')
  .value('TEMPLATE_LIBRARY_PRODUCT_CODE', '61dd6aa64152a228522ddf5950e5abb526416f27')
  .factory('checkTemplateAccess', ['$modal', 'subscriptionStatusFactory', 'plansFactory',
    'TEMPLATE_LIBRARY_PRODUCT_CODE',
    function ($modal, subscriptionStatusFactory, plansFactory, TEMPLATE_LIBRARY_PRODUCT_CODE) {
      var _openExpiredModal = function (isHtmlTemplate) {
        var modalObject = {
          controller: 'confirmModalController',
          resolve: {
            confirmationTitle: function () {
              return 'Display License Required';
            },
            confirmationMessage: function () {
              return 'This Presentation or Template will require a Display License to show on your Display(s). Please subscribe or contact <a href="mailto:sales@risevision.com">sales@risevision.com</a> for a quote.';
            },
            confirmationButton: function () {
              return 'Subscribe';
            },
            cancelButton: function () {
              return 'Close';
            }
          }
        };

        if (isHtmlTemplate) {
          modalObject.templateUrl = 'partials/components/confirm-modal/madero-confirm-modal.html';
          modalObject.windowClass = 'madero-style centered-modal display-license-required-message';
        } else {
          modalObject.templateUrl = 'partials/components/confirm-modal/confirm-modal.html';
          modalObject.windowClass = 'display-license-required-message';
        }

        var modalInstance = $modal.open(modalObject);

        return modalInstance.result
          .then(function () {
            modalInstance.dismiss();
            plansFactory.showPlansModal();
          })
          .catch(function () {});
      };

      return function (isHtmlTemplate) {
        return subscriptionStatusFactory.check(TEMPLATE_LIBRARY_PRODUCT_CODE)
          .catch(function () {
            return _openExpiredModal(isHtmlTemplate);
          });
      };
    }
  ]);
