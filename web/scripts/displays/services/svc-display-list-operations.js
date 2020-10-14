'use strict';

angular.module('risevision.displays.services')
  .service('DisplayListOperations', ['$q', 'displayFactory', 'enableCompanyProduct', 'playerLicenseFactory',
    'plansFactory', 'confirmModal', 'messageBox', 'playerActionsFactory', '$modal',
    function ($q, displayFactory, enableCompanyProduct, playerLicenseFactory, plansFactory,
      confirmModal, messageBox, playerActionsFactory, $modal) {
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
            baseMessage += ' You have '+ availableLicenses +' available license' + (availableLicenses !== 1 ? 's' : '');

            if (availableLicenses >= notAuthorized.length) {
              return confirmModal('Almost there!', 
                baseMessage + '. Do you want to assign '+notAuthorized.length+ (notAuthorized.length > 1 ? ' to these displays?' : ' to this display?'),
                'Yes', 'No', 'madero-style centered-modal',
                'partials/components/confirm-modal/madero-confirm-modal.html','sm').then(function() {
                  var licenseOperation = _.find(listOperations.operations, function(o) { return o.name === 'License'; });
                  return licenseOperation.onClick(true);
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

        var _confirmSetMonitoring = function(selectedItems) {
          return _confirmDisplayUpdate(selectedItems, 'Set Monitoring', 
            'partials/displays/edit-monitoring.html', {
              monitoringEnabled: true,
              monitoringEmails: null,
              monitoringSchedule: null
          });
        };

        var _confirmSetRebootTime = function(selectedItems) {
          return _confirmDisplayUpdate(selectedItems, 'Set Reboot Time', 
            'partials/displays/edit-reboot-time.html', {
              restartEnabled: true,
              restartTime: '02:00',
          });
        };

        var _confirmSetAddress = function(selectedItems) {
          return _confirmDisplayUpdate(selectedItems, 'Set Address', 
            'partials/displays/edit-address.html', {
              useCompanyAddress: false,
              addressDescription: '',
              street: '',
              unit: '',
              city: '',
              country: '',
              province: '',
              postalCode: '',
              timeZoneOffset: null
          });
        };

        var _confirmDisplayUpdate = function(selectedItems, title, partial, baseModel) {
          return _checkLicenses(selectedItems).then(function() {
            return $modal.open({
              templateUrl: 'partials/common/bulk-edit-modal.html',
              controller: 'BulkEditModalCtrl',
              windowClass: 'madero-style centered-modal',
              size: 'md',
              resolve: {
                baseModel: function() {
                  return baseModel;
                },
                title: function() {
                  return title;
                },
                partial: function() {
                  return partial;
                }
              }
            }).result;
          });
        };

        var listOperations = {
          name: 'Display',
          operations: [{
            name: 'Restart Rise Player',
            beforeBatchAction: _confirmRestart,
            actionCall: playerActionsFactory.restartByObject,
            requireRole: 'da'
          },
          {
            name: 'Reboot Media Player',
            beforeBatchAction: _confirmReboot,
            actionCall: playerActionsFactory.rebootByObject,
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
            },
            requireRole: 'da'
          },
          {
            name: 'Set Monitoring',
            beforeBatchAction: _confirmSetMonitoring,
            actionCall: displayFactory.applyFields,
            requireRole: 'da'
          },
          {
            name: 'Set Reboot Time',
            beforeBatchAction: _confirmSetRebootTime,
            actionCall: displayFactory.applyFields,
            requireRole: 'da'
          },
          {
            name: 'Set Address',
            beforeBatchAction: _confirmSetAddress,
            actionCall: displayFactory.applyFields,
            requireRole: 'da'
          },
          {
            name: 'Delete',
            actionCall: displayFactory.deleteDisplayByObject,
            requireRole: 'da'
          }]
        };

        return listOperations;
      };
    }
  ]);
