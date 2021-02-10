'use strict';

angular.module('risevision.apps')
  // Set up our mappings between URLs, templates, and controllers
  .config(['$stateProvider',
    function storeRouteConfig($stateProvider) {

      // Use $stateProvider to configure states.
      $stateProvider
        .state('apps.purchase', {
          abstract: true,
          template: '<div class="container purchase-app" ui-view></div>',
          params: {
            displayCount: 1
          }
        })

        .state('apps.purchase.plans', {
          url: '/plans',
          controller: ['$state',
            function ($state) {
              $state.go('apps.purchase.home');
            }
          ]
        })

        .state('apps.purchase.home', {
          url: '/purchase',
          templateUrl: 'partials/purchase/app-purchase.html',
          controller: 'PurchaseCtrl',
          resolve: {
            canAccessApps: ['$state', '$stateParams', 'canAccessApps', 'currentPlanFactory',
              function ($state, $stateParams, canAccessApps, currentPlanFactory) {
                return canAccessApps()
                  .then(function () {
                    if (currentPlanFactory.isSubscribed() && !currentPlanFactory.isParentPlan()) {
                      $state.go('apps.purchase.licenses.add', {
                        displayCount: $stateParams.displayCount
                      });
                    }
                  });
              }
            ],
            redirectTo: ['$location',
              function ($location) {
                return $location.path() !== '/purchase' ? $location.path() : '/';
              }
            ]
          }
        })

        .state('apps.purchase.licenses', {
          url: '/licenses',
          abstract: true,
          templateUrl: 'partials/purchase/update-subscription.html',
          controller: 'UpdateSubscriptionCtrl',
          resolve: {
            canAccessApps: ['$q', '$state', 'canAccessApps', 'currentPlanFactory', 'messageBox',
              function ($q, $state, canAccessApps, currentPlanFactory, messageBox) {
                return canAccessApps()
                  .then(function () {
                    if (!currentPlanFactory.isSubscribed()) {
                      $state.go('apps.purchase.home');
                    } else if (currentPlanFactory.isParentPlan() || currentPlanFactory.currentPlan
                      .isPurchasedByParent) {
                      var contactInfo = currentPlanFactory.currentPlan.parentPlanContactEmail ? ' at ' +
                        currentPlanFactory.currentPlan.parentPlanContactEmail : '';

                      return messageBox(
                        'You can\'t edit your current plan.',
                        'Your plan is managed by your parent company. Please contact your account administrator' +
                        contactInfo + ' for additional licenses.',
                        'Ok', 'madero-style centered-modal', 'partials/template-editor/message-box.html',
                        'sm'
                      ).finally(function () {
                        if (!$state.current.name) {
                          $state.go('apps.home');
                        } else {
                          return $q.reject();
                        }
                      });
                    }
                  });
              }
            ],
            redirectTo: ['$location',
              function ($location) {
                return $location.path().indexOf('/licenses') !== 0 ? $location.path() : '';
              }
            ]
          }
        })
        .state('apps.purchase.licenses.add', {
          url: '/add/:subscriptionId',
          params: {
            purchaseAction: 'add'
          }
        })
        .state('apps.purchase.licenses.remove', {
          url: '/remove/:subscriptionId',
          params: {
            purchaseAction: 'remove'
          }
        })

        .state('apps.purchase.frequency', {
          url: '/frequency/:subscriptionId',
          templateUrl: 'partials/purchase/update-subscription.html',
          controller: 'UpdateSubscriptionCtrl',
          params: {
            purchaseAction: 'annual'
          },
          resolve: {
            canAccessApps: ['canAccessApps',
              function (canAccessApps) {
                return canAccessApps();
              }
            ],
            redirectTo: ['$location',
              function ($location) {
                return $location.path().indexOf('/frequency') !== 0 ? $location.path() : '';
              }
            ]
          }
        });
    }
  ]);

angular.module('risevision.apps.purchase', [
  'risevision.store.authorization',
  'risevision.common.config',
  'risevision.common.gapi',
  'risevision.common.geodata',
  'risevision.common.currency',
  'risevision.common.address',
  'risevision.common.components.loading',
  'risevision.core.countries',
  'ui.bootstrap'
]);
