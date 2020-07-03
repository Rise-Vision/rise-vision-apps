(function () {
  'use strict';

  angular.module('risevision.common.components.subscription-status.service')
    .service('subscriptionStatusService', ['$http', '$q', 'currentPlanFactory', 'storeProduct', 'storeAuthorization',
      function ($http, $q, currentPlanFactory, storeProduct, storeAuthorization) {
        var _MS_PER_DAY = 1000 * 60 * 60 * 24;

        // a and b are javascript Date objects
        function dateDiffInDays(a, b) {
          return Math.ceil((b.getTime() - a.getTime()) / _MS_PER_DAY);
        }

        var isSubscribed = function (subscriptionStatus) {
          switch (subscriptionStatus) {
          case 'On Trial':
          case 'Subscribed':
          case 'Free':
            return true;
          case 'Not Subscribed':
          case 'Trial Expired':
          case 'Cancelled':
          case 'Suspended':
          case 'Product Not Found':
          case 'Company Not Found':
          case 'Error':
            return false;
          default:
            return false;
          }
        };

        var updateStatus = function (subscriptionStatus) {
          subscriptionStatus.plural = '';

          if (!subscriptionStatus.status) {
            subscriptionStatus.status = 'N/A';
            subscriptionStatus.statusCode = 'na';
          } else {
            subscriptionStatus.statusCode = subscriptionStatus.status.toLowerCase().replace(' ', '-');
          }

          subscriptionStatus.isSubscribed = isSubscribed(subscriptionStatus.status);

          if (subscriptionStatus.statusCode === 'not-subscribed' &&
            subscriptionStatus.trialPeriod && subscriptionStatus.trialPeriod > 0) {
            subscriptionStatus.statusCode = 'trial-available';
            subscriptionStatus.trialAvailable = true;
          }

          if (subscriptionStatus.expiry && subscriptionStatus.statusCode ===
            'on-trial') {
            subscriptionStatus.expiry = new Date(subscriptionStatus.expiry);

            if (subscriptionStatus.expiry instanceof Date &&
              !isNaN(subscriptionStatus.expiry.valueOf())) {
              subscriptionStatus.expiry = dateDiffInDays(new Date(),
                subscriptionStatus.expiry);
            }

            if (subscriptionStatus.expiry === 0) {
              subscriptionStatus.plural = '-zero';
            } else if (subscriptionStatus.expiry > 1) {
              subscriptionStatus.plural = '-many';
            }
          }
        };

        var mapPlanStatus = function (planStatus) {
          var status = 'Not Subscribed';

          if (currentPlanFactory.isCancelled()) {
            // Cancelled or CancelledActive
            status = 'Cancelled';
          } else if (currentPlanFactory.isSubscribed()) {
            status = 'Subscribed';
          } else if (currentPlanFactory.isOnTrial()) {
            status = 'On Trial';
            // Unreachable cases
            // } else if (currentPlanFactory.isFree()) {
            //   status = 'Free';
            // } else if (currentPlanFactory.isTrialExpired()) {
            //   status = 'Trial Expired';
            // } else if (currentPlanFactory.isSuspended()) {
            //   status = 'Suspended';
          }

          return status;
        };

        var mapCurrentPlan = function (productCodes) {
          var statusList = [];
          for (var i = 0; i < productCodes.length; i++) {
            var subscriptionStatus = {
              pc: productCodes[i],
              status: mapPlanStatus(currentPlanFactory.currentPlan.status),
              expiry: currentPlanFactory.currentPlan.trialExpiryDate
            };

            updateStatus(subscriptionStatus);

            statusList.push(subscriptionStatus);
          }

          return statusList;
        };

        var checkSubscriptionStatus = function (productCodes) {
          if (currentPlanFactory.isPlanActive()) {
            return $q.resolve(mapCurrentPlan(productCodes));
          } else {
            return storeProduct.status(productCodes)
              .then(function (result) {
                if (result && result.items) {
                  var statusList = [];

                  for (var i = 0; i < result.items.length; i++) {
                    var subscriptionStatus = result.items[i];

                    updateStatus(subscriptionStatus);

                    statusList.push(subscriptionStatus);
                  }

                  return $q.resolve(statusList);
                } else {
                  return $q.reject('No results.');
                }
              })
              .catch(function (e) {
                console.error('Failed to get status of products.', e);
                return $q.reject(e);
              });
          }
        };

        this.get = function (productCode) {
          return checkSubscriptionStatus([productCode])
            .then(function (statusList) {
              var subscriptionStatus = statusList[0];

              if (subscriptionStatus.isSubscribed === false) {
                // double check store authorization in case they're authorized
                return storeAuthorization.check(productCode)
                  .then(function (authorized) {
                    subscriptionStatus.isSubscribed = authorized;

                    return subscriptionStatus;
                  }, function (authorized) {
                    // storeAuthorization rejects if authorized=FALSE
                    // In case of error, fail gracefully
                    return subscriptionStatus;
                  });
              } else {
                return subscriptionStatus;
              }
            });
        };

        this.list = function (productCodes) {
          return checkSubscriptionStatus(productCodes);
        };

      }
    ]);
}());
