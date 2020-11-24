(function () {
  'use strict';
  /*jshint camelcase: false */

  angular.module('risevision.store.services')
    .service('storeService', ['$q', '$log', '$http', 'storeAPILoader',
      function ($q, $log, $http, storeAPILoader) {

        var _getResult = function (resp) {
          if (resp.result !== null && typeof resp.result === 'object') {
            return resp.result;
          } else {
            return resp;
          }
        };

        var service = {
          validateAddress: function (addressObject) {
            var obj = {
              'street': addressObject.street,
              'unit': addressObject.unit,
              'city': addressObject.city,
              'country': addressObject.country,
              'postalCode': addressObject.postalCode,
              'province': addressObject.province,
            };

            return storeAPILoader()
              .then(function (storeApi) {
                return storeApi.company.validateAddress(obj);
              })
              .then(function (resp) {
                var result = _getResult(resp);
                $log.debug('validateAddress result: ', result);

                if (result.code !== -1) {
                  return $q.resolve(result);
                } else {
                  return $q.reject(result);
                }
              });
          },
          calculateTaxes: function (companyId, planId, planQty, addonId, addonQty,
            shippingAddress, couponCode) {
            var deferred = $q.defer();
            var obj = {
              companyId: companyId,
              couponCode: couponCode,
              shipToId: shippingAddress.id,
              planId: planId,
              planQty: planQty,
              addonId: addonId,
              addonQty: addonQty,
              line1: shippingAddress.street,
              line2: shippingAddress.unit,
              city: shippingAddress.city,
              country: shippingAddress.country,
              state: shippingAddress.province,
              zip: shippingAddress.postalCode
            };

            storeAPILoader().then(function (storeApi) {
                return storeApi.tax.estimate(obj);
              })
              .then(function (resp) {
                if (resp.result && !resp.result.error && resp.result.result === true) {
                  $log.debug('tax estimate resp', resp);
                  deferred.resolve(resp.result);
                } else {
                  console.error('Failed to get tax estimate.', resp.result);

                  deferred.reject(resp.result);
                }
              })
              .then(null, function (resp) {
                console.error('Failed to get tax estimate.', resp);

                deferred.reject(resp && resp.result && resp.result.error);
              });
            return deferred.promise;
          },
          preparePurchase: function (jsonData) {
            var deferred = $q.defer();
            storeAPILoader().then(function (storeAPI) {
                var obj = {
                  jsonData: jsonData
                };
                return storeAPI.purchase.prepare(obj);
              })
              .then(function (resp) {
                if (resp && resp.result && !resp.result.error) {
                  $log.debug('prepare purchase resp', resp);
                  deferred.resolve(resp.result);
                } else {
                  deferred.reject(resp && resp.result && resp.result.error);
                }
              })
              .then(null, function (resp) {
                console.error('Failed to prepare Purchase.', resp);

                deferred.reject(resp && resp.result && resp.result.error);
              });
            return deferred.promise;
          },
          purchase: function (jsonData) {
            var deferred = $q.defer();
            storeAPILoader().then(function (storeAPI) {
                var obj = {
                  jsonData: jsonData
                };
                return storeAPI.purchase.put2(obj);
              })
              .then(function (resp) {
                if (resp && resp.result && !resp.result.error) {
                  $log.debug('purchase resp', resp);
                  deferred.resolve(resp.result);
                } else {
                  deferred.reject(resp && resp.result && resp.result.error);
                }
              })
              .then(null, function (resp) {
                console.error('Failed to get Purchase.', resp);

                deferred.reject(resp && resp.result && resp.result.error);
              });
            return deferred.promise;
          },
          preparePayment: function (paymentMethodId, invoiceId, companyId) {
            var deferred = $q.defer();
            storeAPILoader().then(function (storeAPI) {
                var obj = {
                  paymentMethodId: paymentMethodId,
                  invoiceId: invoiceId,
                  companyId: companyId
                };
                return storeAPI.payment.prepare(obj);
              })
              .then(function (resp) {
                if (resp && resp.result && !resp.result.error) {
                  $log.debug('prepare payment resp', resp);
                  deferred.resolve(resp.result);
                } else {
                  deferred.reject(resp && resp.result && resp.result.error);
                }
              })
              .then(null, function (resp) {
                console.error('Failed to prepare Payment.', resp);

                deferred.reject(resp && resp.result && resp.result.error);
              });
            return deferred.promise;
          },
          collectPayment: function (paymentIntentId, invoiceId, companyId) {
            var deferred = $q.defer();
            storeAPILoader().then(function (storeAPI) {
                var obj = {
                  paymentIntentId: paymentIntentId,
                  invoiceId: invoiceId,
                  companyId: companyId
                };
                return storeAPI.payment.collect(obj);
              })
              .then(function (resp) {
                if (resp && resp.result && !resp.result.error) {
                  $log.debug('purchase resp', resp);
                  deferred.resolve(resp.result);
                } else {
                  deferred.reject(resp && resp.result && resp.result.error);
                }
              })
              .then(null, function (resp) {
                console.error('Failed to get Purchase.', resp);

                deferred.reject(resp && resp.result && resp.result.error);
              });
            return deferred.promise;
          },
          createSession: function (companyId) {
            var deferred = $q.defer();

            var obj = {
              'companyId': companyId
            };

            storeAPILoader().then(function (storeApi) {
                return storeApi.customer_portal.createSession(obj);
              })
              .then(function (resp) {
                $log.debug('customer_portal.createSession resp', resp);
                deferred.resolve(JSON.parse(resp.result.result));
              })
              .then(null, function (e) {
                console.error('Failed to create Customer Portal Session.', e);
                deferred.reject(e);
              });
            return deferred.promise;
          },
          addTaxExemption: function (companyId, taxExemption, blobKey) {
            var deferred = $q.defer();
            // var expiryDateString = $filter('date')(taxExemption.expiryDate, 'yyyy-MM-dd');

            storeAPILoader().then(function (storeAPI) {
              var obj = {
                'companyId': companyId,
                // 'country': taxExemption.country,
                // 'state': taxExemption.province,
                'blobKey': blobKey,
                'number': taxExemption.number,
                // 'expiryDate': expiryDateString
              };
              var request = storeAPI.taxExemption.add(obj);
              request.execute(function (resp) {
                if (resp.error) {
                  $log.error('Error adding tax exemption: ', resp.message);
                  deferred.reject(resp.error);
                } else {
                  deferred.resolve(resp);
                }
              });
            });
            return deferred.promise;
          },
          uploadTaxExemptionCertificate: function (file) {
            var deferred = $q.defer();

            var formData = new FormData();

            formData.append('file', file);

            storeAPILoader().then(function (storeAPI) {
              var request = storeAPI.taxExemption.getUploadUrl();
              request.execute(function (resp) {
                if (resp.error) {
                  $log.error('Error getting upload url: ', resp.message);
                  deferred.reject(resp.error);
                } else {
                  $http.post(resp.result.result, formData, {
                      withCredentials: true,
                      headers: {
                        'Content-Type': undefined
                      },
                      transformRequest: angular.identity
                    })
                    .then(function (response) {
                        deferred.resolve(response.data);
                      },
                      function (error) {
                        $log.error('Error uploading file: ', error);
                        deferred.reject(error);
                      });
                }
              });
            });
            return deferred.promise;
          }
        };

        return service;
      }
    ]);
})();
