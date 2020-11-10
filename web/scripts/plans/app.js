(function (angular) {
  'use strict';

  try {
    angular.module('risevision.common.config');
  } catch (err) {
    angular.module('risevision.common.config', []);
  }

  angular.module('risevision.apps')
    // Set up our mappings between URLs, templates, and controllers
    .config(['$stateProvider',
      function storeRouteConfig($stateProvider) {

        // Use $stateProvider to configure states.
        $stateProvider
          .state('apps.plans', {
            abstract: true,
            template: '<div class="container plans-app" ui-view></div>'
          })

          .state('apps.plans.home', {
            url: '/plans?redirectTo',
             resolve: {
              canAccessApps: ['$q', '$state', 'canAccessApps', 'currentPlanFactory', 'messageBox', '$stateParams',
                function ($q, $state, canAccessApps, currentPlanFactory, messageBox, $stateParams) {
                  return canAccessApps()
                    .then(function() {
                      if (currentPlanFactory.isSubscribed() && !currentPlanFactory.isParentPlan()) {
                        if (currentPlanFactory.currentPlan.isPurchasedByParent) {
                          var contactInfo = currentPlanFactory.currentPlan.parentPlanContactEmail ? ' at ' +
                            currentPlanFactory.currentPlan.parentPlanContactEmail : '';

                          return messageBox(
                            'You can\'t edit your current plan.',
                            'Your plan is managed by your parent company. Please contact your account administrator' +
                            contactInfo + ' for additional licenses.',
                            'Ok', 'madero-style centered-modal', 'partials/template-editor/message-box.html', 'sm'
                          ).finally(function() {
                            if (!$state.current.name) {
                              $state.go('apps.home');
                            } else {
                              return $q.reject();
                            }
                          });
                        } else {
                          $state.go('apps.billing.home', {
                            edit: currentPlanFactory.currentPlan.subscriptionId
                          });
                        }
                      } else {
                        $state.go('apps.purchase.home', { redirectTo: $stateParams.redirectTo });
                      }
                    });
                }
              ]
            }
          });
      }
    ]);

  angular.module('risevision.apps.plans.services', [
    'risevision.store.authorization',
    'risevision.common.gapi',
    'risevision.common.currency'
  ]);

  angular.module('risevision.apps.plans', [
    'risevision.common.config',
    'risevision.common.components.confirm-modal',
    'risevision.common.components.message-box',
    'risevision.apps.plans.services',
    'risevision.common.components.scrolling-list',
    'risevision.common.components.loading',
    'ui.bootstrap'
  ]);

})(angular);
