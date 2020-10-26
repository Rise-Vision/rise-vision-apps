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
            url: '/plans',
            templateProvider: ['$templateCache', function ($templateCache) {
              return $templateCache.get('partials/plans/app-plans.html');
            }],
            controller: 'PlansCtrl',
            resolve: {
              canAccessApps: ['$state', 'canAccessApps', 'currentPlanFactory', 'messageBox',
                function ($state, canAccessApps, currentPlanFactory, messageBox) {
                  return canAccessApps()
                    .then(function() {
                      if (currentPlanFactory.isSubscribed() && !currentPlanFactory.isParentPlan()) {
                        if (currentPlanFactory.currentPlan.isPurchasedByParent) {
                          var contactInfo = currentPlanFactory.currentPlan.parentPlanContactEmail ? ' at ' +
                            currentPlanFactory.currentPlan.parentPlanContactEmail : '';
                          messageBox(
                            'You can\'t edit your current plan.',
                            'Your plan is managed by your parent company. Please contact your account administrator' +
                            contactInfo + ' for additional licenses.',
                            'Ok', 'madero-style centered-modal', 'partials/template-editor/message-box.html', 'sm'
                          );
                          $state.go('apps.home');
                        } else {
                          $state.go('apps.billing.home', {
                            edit: currentPlanFactory.currentPlan.subscriptionId
                          });
                        }
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
