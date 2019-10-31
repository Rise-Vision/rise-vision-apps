(function () {
  'use strict';

  angular.module('risevision.common.components.subscription-status.service')
    .service('subscriptionStatusService', ['$http', '$q', 'storeProduct', 'STORE_SERVER_URL',
      'AUTH_PATH_URL',
      function ($http, $q, storeProduct, STORE_SERVER_URL, AUTH_PATH_URL) {
        var _MS_PER_DAY = 1000 * 60 * 60 * 24;

        // a and b are javascript Date objects
        function dateDiffInDays(a, b) {
          return Math.ceil((b.getTime() - a.getTime()) / _MS_PER_DAY);
        }

        var checkAuthorizedStatus = function (productCode, companyId) {
          var deferred = $q.defer();

          var url = STORE_SERVER_URL +
            AUTH_PATH_URL.replace('companyId', companyId) +
            productCode;

          $http.get(url).then(function (response) {
            if (response && response.data) {
              deferred.resolve(response.data.authorized);
            } else {
              deferred.resolve(false);
            }
          });

          return deferred.promise;
        };

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

          subscriptionStatus.subscribed = isSubscribed(subscriptionStatus.status);
          subscriptionStatus.isSubscribed = isSubscribed(subscriptionStatus.status);

          if (subscriptionStatus.statusCode === 'not-subscribed' &&
            subscriptionStatus.trialPeriod && subscriptionStatus.trialPeriod > 0) {
            subscriptionStatus.statusCode = 'trial-available';
            subscriptionStatus.subscribed = true;
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

        var checkSubscriptionStatus = function (productCodes) {
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
        };

        this.get = function (productCode, companyId) {
          return checkSubscriptionStatus([productCode])
            .then(function (statusList) {
              var subscriptionStatus = statusList[0];

              if (subscriptionStatus.subscribed === false) {
                // double check store authorization in case they're authorized
                return checkAuthorizedStatus(productCode, companyId)
                  .then(function (authorized) {
                    subscriptionStatus.subscribed = authorized;

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
