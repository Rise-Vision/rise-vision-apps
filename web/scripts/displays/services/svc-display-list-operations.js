'use strict';

angular.module('risevision.displays.services')
  .service('DisplayListOperations', ['$q', 'displayFactory', 'enableCompanyProduct', 'playerLicenseFactory',
    'plansFactory', 'confirmModal', 'messageBox',
    function ($q, displayFactory, enableCompanyProduct, playerLicenseFactory, plansFactory,
      confirmModal, messageBox) {
      return function () {
        var _licenseDisplays = function(companyId, displays) {
          var displayIds = _.map(displays, 'id');

          return playerLicenseFactory.licenseDisplaysByCompanyId(companyId, displayIds)
            .then(function() {
              _.each(displays, function(display) {
                display.playerProAuthorized = true;
              });
            });
        };

        var listOperations = {
          name: 'Display',
          operations: [{
            name: 'Delete',
            actionCall: displayFactory.deleteDisplayByObject,
            requireRole: 'da'
          },
          {
            name: 'License',
            actionCall: function(selected) {
              return _licenseDisplays(selected.companyId, selected.items);
            },
            beforeBatchAction: function(selected) {
              if (!selected.length) {
                messageBox(
                  'Already licensed!',
                  'Please select some unlicensed displays to license.',
                  null, 
                  'madero-style centered-modal', 
                  'partials/template-editor/message-box.html',
                  'sm');
                return $q.reject();
              } else if (playerLicenseFactory.getProAvailableLicenseCount() < selected.length) {
                plansFactory.confirmAndPurchase();
                return $q.reject();
              } else {
                return confirmModal(
                  'Assign license?',
                  'Do you want to assign licenses to the selected displays?',
                  'Yes',
                  'No',
                  'madero-style centered-modal',
                  'partials/components/confirm-modal/madero-confirm-modal.html',
                  'sm');
              }
            },
            groupBy: 'companyId',
            filter: {
              playerProAuthorized: false
            }
          }]
        };

        return listOperations;
      };
    }
  ]);
