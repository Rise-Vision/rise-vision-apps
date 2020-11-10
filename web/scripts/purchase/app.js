'use strict';

angular.module('risevision.apps')
  // Set up our mappings between URLs, templates, and controllers
  .config(['$stateProvider',
    function storeRouteConfig($stateProvider) {

      // Use $stateProvider to configure states.
      $stateProvider
        .state('apps.purchase', {
          abstract: true,
          template: '<div class="container purchase-app" ui-view></div>'
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
          templateProvider: ['$templateCache', function ($templateCache) {
            return $templateCache.get('partials/purchase/app-purchase.html');
          }],
          controller: 'PurchaseCtrl',
          resolve: {
           canAccessApps: ['$q', '$state', 'canAccessApps', 'currentPlanFactory', 'messageBox',
             function ($q, $state, canAccessApps, currentPlanFactory, messageBox) {
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
                   }
                 });
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
  'risevision.common.components.loading',
  'risevision.core.countries',
  'ui.bootstrap'
]);
