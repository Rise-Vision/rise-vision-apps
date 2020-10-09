'use strict';

angular.module('risevision.displays.services')
  .service('DisplayListOperations', ['displayFactory', 'enableCompanyProduct', 'playerLicenseFactory',
    'PLAYER_PRO_PRODUCT_CODE',
    function (displayFactory, enableCompanyProduct, playerLicenseFactory, PLAYER_PRO_PRODUCT_CODE) {
      return function () {
        var _licenseDisplays = function(companyId, displays) {
          var apiParams = {};

          _.each(displays, function(display) {
            var playerProAuthorized = display.playerProAuthorized;

            apiParams[display.id] = !playerProAuthorized;                
          });

          return enableCompanyProduct(companyId, PLAYER_PRO_PRODUCT_CODE, apiParams)
            .then(function () {
              _.each(displays, function(display) {
                display.playerProAuthorized = !display.playerProAuthorized;

                playerLicenseFactory.toggleDisplayLicenseLocal(display.playerProAuthorized);
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
              _licenseDisplays(selected.companyId, selected.items);
            },
            // TODO: Check selected Displays and show appropriate modals:
            // beforeBatchAction: function(selected) {
            //   if (!selected.length) {
            //     You did not select any unlicensed displays
            //   } else if (not enough licenses) {
            //     You do not have sufficient licenses; purchase more
            //   } else {
            //     You are licensing displays; please confirm
            //   }
            // },
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
