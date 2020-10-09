'use strict';

angular.module('risevision.displays.services')
  .service('DisplayListOperations', ['displayFactory', 'playerActionsFactory', 'confirmModal', '$q', 'plansFactory', 'playerLicenseFactory',
    function (displayFactory, playerActionsFactory, confirmModal, $q, plansFactory, playerLicenseFactory) {
      return function () {
        var _checkLicenses = function(selectedItems) {
          var notAuthorized = [];
          angular.forEach(selectedItems, function(display) {
            if (!display.playerProAuthorized) {
              notAuthorized.push(display.id);
            }
          });
          if (notAuthorized.length > 0) {
            var availableLicenses = playerLicenseFactory.getProAvailableLicenseCount();
            var baseMessage = notAuthorized.length > 1 ? 
              notAuthorized.length + ' of your selected displays are not licensed and to perform this action they need to be.' :
              '1 of your selected displays is not licensed and to perform this action it needs to be.';
            baseMessage += ' You have '+ availableLicenses +' available license' + (availableLicenses > 1 ? 's' : '');

            if (availableLicenses >= notAuthorized.length) {
              return confirmModal('Almost there!', 
                baseMessage + '. Do you want to assign '+notAuthorized.length+ (notAuthorized.length > 1 ? ' to these displays?' : ' to this display?'),
                'Yes', 'No', 'madero-style centered-modal',
                'partials/components/confirm-modal/madero-confirm-modal.html','sm').then(function() {
                  // TODO: bulk assign
                });
            } else {
              return confirmModal('Almost there!', 
                baseMessage + ' and you need to subscribe for '+ (notAuthorized.length - availableLicenses) +' more to license ' + (notAuthorized.length > 1 ? 'these displays.' : 'this display.') ,
                'Subscribe', 'Cancel', 'madero-style centered-modal',
                'partials/components/confirm-modal/madero-confirm-modal.html','sm').then(function() {
                   plansFactory.showPurchaseOptions();
                   return $q.reject();
                });
            }
          }
          return $q.resolve();
        };

        var _confirmPlayerAction = function(selectedItems, isRestart) {         
          var suffix = selectedItems.length > 1? 's' : '';
          var title = isRestart ? 'Restart Rise Player'+ suffix +'?' :  'Reboot media player'+ suffix +'?';
          var message = isRestart ? 'Rise Player'+ suffix +' will restart' : 'The media player'+ suffix +' will reboot';
          message += ' and the content showing on your display'+ suffix +' will be interrupted. Do you wish to proceed?';

          return _checkLicenses(selectedItems).then(function() {
            return confirmModal(title, message, 'Yes', 'No', 'madero-style centered-modal',
              'partials/components/confirm-modal/madero-confirm-modal.html','sm');
          });
        };

        var _confirmRestart = function(selectedItems) {
          return _confirmPlayerAction(selectedItems, true);
        };

        var _confirmReboot = function(selectedItems) {
          return _confirmPlayerAction(selectedItems, false);
        };

        var listOperations = {
          name: 'Display',
          operations: [{
            name: 'Restart Rise Player',
            beforeBatchAction: _confirmRestart,
            actionCall: playerActionsFactory.restartByObject,
            requireRole: 'da'
          },{
            name: 'Reboot Media Player',
            beforeBatchAction: _confirmReboot,
            actionCall: playerActionsFactory.rebootByObject,
            requireRole: 'da'
          },{
            name: 'Delete',
            actionCall: displayFactory.deleteDisplayByObject,
            requireRole: 'da'
          }]
        };

        return listOperations;
      };
    }
  ]);
