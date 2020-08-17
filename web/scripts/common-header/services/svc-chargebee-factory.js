'use strict';
/*jshint camelcase: false */

angular.module('risevision.store.services')
  .factory('getChargebeeInstance', ['$q', '$window', '$loading', 'storeService', 'userState',
    'CHARGEBEE_TEST_SITE', 'CHARGEBEE_PROD_SITE',
    function ($q, $window, $loading, storeService, userState, CHARGEBEE_TEST_SITE, CHARGEBEE_PROD_SITE) {
      var currentCompanyId = null;
      var currentInstance = null;
      var currentSessionExpiration = 0;

      function _isSessionExpired() {
        // Leaves a 1 minute buffer to avoid expiration on call
        return currentSessionExpiration - Date.now() < 60000;
      }

      function _createChargebeeInstance(session) {
        var cbInstance = {};

        cbInstance.instance = $window.Chargebee.init({
          site: userState.isTestCompanySelected() ? CHARGEBEE_TEST_SITE : CHARGEBEE_PROD_SITE
        });
        cbInstance.instance.logout();
        cbInstance.instance.setPortalSession(function () {
          return $q.resolve(session);
        });
        cbInstance.portal = cbInstance.instance.createChargebeePortal();

        return cbInstance;
      }

      return function (companyId) {
        if (currentCompanyId === companyId && !_isSessionExpired()) {
          return $q.resolve(currentInstance);
        } else {
          var deferred = $q.defer();

          $loading.startGlobal('chargebee-session');

          storeService.createSession(companyId)
            .then(function (session) {
              console.log('Chargebee session for companyId', companyId, 'is', session);

              currentInstance = _createChargebeeInstance(session);
              currentCompanyId = companyId;
              // Chargebee expiration fields are expressed in seconds, while Date.now() is in milliseconds
              var sessionDuration = (Number(session.expires_at) - Number(session.created_at)) * 1000;
              currentSessionExpiration = Date.now() + sessionDuration;

              $loading.stopGlobal('chargebee-session');
              deferred.resolve(currentInstance);
            })
            .catch(function (err) {
              console.log('Error creating Customer Portal session for company id', companyId, err);
              $loading.stopGlobal('chargebee-session');
              deferred.reject(err);
            });

          return deferred.promise;
        }
      };
    }
  ])
  .factory('ChargebeeFactory', ['$rootScope', '$window', '$log', 'getChargebeeInstance', 'plansFactory',
    'currentPlanFactory',
    function ($rootScope, $window, $log, getChargebeeInstance, plansFactory, currentPlanFactory) {
      return function () {
        var factory = {
          apiError: null
        };

        var _getChargebeePortal = function (companyId) {
          factory.apiError = null;

          return getChargebeeInstance(companyId)
            .then(function (instance) {
              return instance.portal;
            });
        };

        var _handleChargebeePortalError = function (err, companyId) {
          if (err.status === 404 && !currentPlanFactory.currentPlan.isPurchasedByParent && !plansFactory
            .isPlansModalOpen) {
            plansFactory.showPlansModal();
          } else if (err.status === 404 && currentPlanFactory.currentPlan.isPurchasedByParent) {
            // Throw no access error
            factory.apiError = 403;
            console.log('Company does not exist in Chargebee, companyId', companyId, err);
          } else {
            factory.apiError = err;
            console.log('Failed to retrieve session for companyId', companyId, err);
          }
        };

        var _chargebeeCallbacks = {
          loaded: function () {
            $log.debug('Chargebee loaded event');
            $rootScope.$emit('chargebee.loaded');
          },
          close: function () {
            $log.debug('Chargebee close event');
            $rootScope.$emit('chargebee.close');
          },
          visit: function (sectionName) {
            $log.debug('Chargebee visit event', sectionName);
            $rootScope.$emit('chargebee.visit', sectionName);
          },
          paymentSourceAdd: function () {
            $log.debug('Chargebee paymentSourceAdd event');
            $rootScope.$emit('chargebee.paymentSourceAdd');
          },
          paymentSourceUpdate: function () {
            $log.debug('Chargebee paymentSourceUpdate event');
            $rootScope.$emit('chargebee.paymentSourceUpdate');
          },
          paymentSourceRemove: function () {
            $log.debug('Chargebee paymentSourceRemove event');
            $rootScope.$emit('chargebee.paymentSourceRemove');
          },
          subscriptionChanged: function (data) {
            $log.debug('Chargebee subscriptionChanged event', data);
            $rootScope.$emit('chargebee.subscriptionChanged', data);
          },
          subscriptionCancelled: function (data) {
            $log.debug('Chargebee subscriptionCancelled event', data);
            $rootScope.$emit('chargebee.subscriptionCancelled', data);
          }
        };

        factory.openPortal = function (companyId) {
          _getChargebeePortal(companyId)
            .then(function (portal) {
              portal.open(_chargebeeCallbacks);
            })
            .catch(function (err) {
              _handleChargebeePortalError(err, companyId);
            });
        };

        factory.openAccountDetails = function (companyId) {
          _getChargebeePortal(companyId)
            .then(function (portal) {
              portal.open(_chargebeeCallbacks, {
                sectionType: $window.Chargebee.getPortalSections().ACCOUNT_DETAILS
              });
            })
            .catch(function (err) {
              _handleChargebeePortalError(err, companyId);
            });
        };

        factory.openAddress = function (companyId) {
          _getChargebeePortal(companyId)
            .then(function (portal) {
              portal.open(_chargebeeCallbacks, {
                sectionType: $window.Chargebee.getPortalSections().ADDRESS
              });
            })
            .catch(function (err) {
              _handleChargebeePortalError(err, companyId);
            });
        };

        factory.openBillingHistory = function (companyId) {
          _getChargebeePortal(companyId)
            .then(function (portal) {
              portal.open(_chargebeeCallbacks, {
                sectionType: $window.Chargebee.getPortalSections().BILLING_HISTORY
              });
            })
            .catch(function (err) {
              _handleChargebeePortalError(err, companyId);
            });
        };

        factory.openPaymentSources = function (companyId) {
          _getChargebeePortal(companyId)
            .then(function (portal) {
              portal.open(_chargebeeCallbacks, {
                sectionType: $window.Chargebee.getPortalSections().PAYMENT_SOURCES
              });
            })
            .catch(function (err) {
              _handleChargebeePortalError(err, companyId);
            });
        };

        factory.openEditSubscription = function (companyId, subscriptionId) {
          _openSubscriptionSection(companyId, subscriptionId, 'EDIT_SUBSCRIPTION');
        };

        factory.openSubscriptionDetails = function (companyId, subscriptionId) {
          _openSubscriptionSection(companyId, subscriptionId, 'SUBSCRIPTION_DETAILS');
        };

        var _openSubscriptionSection = function (companyId, subscriptionId, section) {
          _getChargebeePortal(companyId)
            .then(function (portal) {
              portal.open(_chargebeeCallbacks, {
                sectionType: $window.Chargebee.getPortalSections()[section],
                params: {
                  subscriptionId: subscriptionId
                }
              });
            })
            .catch(function (err) {
              _handleChargebeePortalError(err, companyId);
            });
        };

        return factory;

      };
    }
  ]);
