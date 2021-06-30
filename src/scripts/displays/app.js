'use strict';

angular.module('risevision.apps')
  // Set up our mappings between URLs, templates, and controllers
  .config(['$stateProvider',
    function storeRouteConfig($stateProvider) {

      // Use $stateProvider to configure states.
      $stateProvider
        .state('apps.displays', {
          abstract: true,
          template: '<div class="container displays-app" ui-view></div>',
          data: {
            requiresAuth: true
          }
        })

        .state('apps.displays.home', {
          url: '/displays',
          redirectTo: 'apps.displays.list'
        })

        .state('apps.displays.list', {
          url: '/displays/list',
          templateProvider: ['$templateCache', function ($templateCache) {
            return $templateCache.get(
              'partials/displays/displays-list.html');
          }],
          controller: 'displaysList'
        })

        .state('apps.displays.change', {
          url: '/displays/change/:displayId/:companyId',
          controller: ['userState', '$stateParams', '$state',
            function (userState, $stateParams, $state) {
              var companyChangeRequired = userState.getSelectedCompanyId() !== $stateParams.companyId;

                if (companyChangeRequired) {
                  return userState.switchCompany($stateParams.companyId)
                    .then(function() {
                      $state.go('apps.displays.details', {
                        displayId: $stateParams.displayId,
                        cid: $stateParams.companyId
                      }, {
                        location: 'replace'
                      });
                    });
                } else {
                  $state.go('apps.displays.details', {
                    displayId: $stateParams.displayId,
                    cid: $stateParams.companyId
                  });                  
                }
            }
          ]
        })

        .state('apps.displays.details', {
          url: '/displays/details/:displayId',
          templateProvider: ['$templateCache', function ($templateCache) {
            return $templateCache.get(
              'partials/displays/display-details.html');
          }],
          controller: 'displayDetails',
          resolve: {
            displayId: ['$stateParams', 'displayFactory',
              function ($stateParams, displayFactory) {
                displayFactory.init();

                return $stateParams.displayId;
              }
            ]
          }
        })

        .state('apps.displays.add', {
          url: '/displays/add',
          templateProvider: ['$templateCache', function ($templateCache) {
            return $templateCache.get(
              'partials/displays/display-add.html');
          }],
          params: {
            schedule: null
          },
          controller: 'displayAdd',
          resolve: {
            scheduleInfo: ['$stateParams', 'displayFactory', 'screenshotFactory',
              function ($stateParams, displayFactory, screenshotFactory) {
                displayFactory.newDisplay();
                delete screenshotFactory.screenshot;

                if ($stateParams.schedule) {
                  displayFactory.setAssignedSchedule($stateParams.schedule);
                }
              }
            ]
          }
        })

        .state('apps.displays.alerts', {
          url: '/alerts',
          templateProvider: ['$templateCache', function ($templateCache) {
            return $templateCache.get('partials/displays/alerts.html');
          }],
          controller: 'AlertsCtrl'
        });

    }
  ]);

angular.module('risevision.displays.services', [
  'risevision.common.config',
  'risevision.common.header',
  'risevision.common.gapi',
  'risevision.apps.services'
]);
angular.module('risevision.displays.filters', []);
angular.module('risevision.displays.directives', [
  'risevision.displays.filters'
]);
angular.module('risevision.displays.controllers', []);
