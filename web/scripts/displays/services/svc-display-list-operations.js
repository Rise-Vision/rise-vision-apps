'use strict';

angular.module('risevision.displays.services')
  .service('DisplayListOperations', ['displayFactory', 'playerActionsFactory', 'confirmModal', '$q',
    function (displayFactory, playerActionsFactory, confirmModal, $q) {
      return function () {
        var _checkLicenses = function(selectedItems) {
          //TODO
          return $q.resolve();
        };

        var _confirmRestart = function(selectedItems) {
          var suffix = selectedItems.length > 1? 's' : '';
          return _checkLicenses(selectedItems).then(function() {
            return confirmModal('Restart Rise Player'+ suffix +'?',
              'Rise Player'+ suffix +' will restart and the content showing on your display'+ suffix +' will be interrupted. Do you wish to proceed?',
              'Yes', 'No', 'madero-style centered-modal',
              'partials/components/confirm-modal/madero-confirm-modal.html','sm');
          });
        };

        var _confirmReboot = function(selectedItems) {
          var suffix = selectedItems.length > 1? 's' : '';
          return _checkLicenses(selectedItems).then(function() {
            return confirmModal('Reboot media player'+ suffix +'?',
              'The media player'+ suffix +' will reboot and the content showing on your display'+ suffix +' will be interrupted. Do you wish to proceed?',
              'Yes', 'No', 'madero-style centered-modal',
              'partials/components/confirm-modal/madero-confirm-modal.html','sm');
          });
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
