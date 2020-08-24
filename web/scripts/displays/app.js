'use strict';

angular.module('risevision.apps')
  // Set up our mappings between URLs, templates, and controllers
  .config(['$stateProvider',
    function storeRouteConfig($stateProvider) {

      // Use $stateProvider to configure states.
      $stateProvider
        .state('apps.displays', {
          url: '?cid',
          abstract: true,
          template: '<div class="container displays-app" ui-view></div>'
        })

        .state('apps.displays.home', {
          url: '/displays',
          controller: ['canAccessApps', '$state', '$location',
            function (canAccessApps, $state, $location) {
              canAccessApps().then(function () {
                $location.replace();
                $state.go('apps.displays.list');
              });
            }
          ]
        })

        .state('apps.displays.list', {
          url: '/displays/list',
          templateProvider: ['$templateCache', function ($templateCache) {
            return $templateCache.get(
              'partials/displays/displays-list.html');
          }],
          controller: 'displaysList',
          resolve: {
            canAccessApps: ['canAccessApps',
              function (canAccessApps) {
                return canAccessApps();
              }
            ]
          }
        })

        .state('apps.displays.change', {
          url: '/displays/change/:displayId/:companyId',
          controller: ['canAccessApps', 'userState', '$stateParams',
            '$state', '$location',
            function (canAccessApps, userState, $stateParams, $state, $location) {
              var companyChangeRequired = userState.getSelectedCompanyId() !== $stateParams.companyId;

              return canAccessApps().then(function () {
                  if (companyChangeRequired) {
                    return userState.switchCompany($stateParams.companyId);
                  }
                })
                .then(function () {
                  if (companyChangeRequired) {
                    $location.replace();
                  }

                  $state.go('apps.displays.details', {
                    displayId: $stateParams.displayId
                  });
                });
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
            displayId: ['canAccessApps', '$stateParams', 'displayFactory',
              function (canAccessApps, $stateParams, displayFactory) {
                return canAccessApps().then(function () {
                  displayFactory.init();

                  return $stateParams.displayId;
                });
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
            scheduleInfo: ['$stateParams', 'canAccessApps', 'displayFactory', 'screenshotFactory',
              function ($stateParams, canAccessApps, displayFactory, screenshotFactory) {
                return canAccessApps().then(function () {
                  displayFactory.newDisplay();
                  delete screenshotFactory.screenshot;

                  if ($stateParams.schedule) {
                    displayFactory.setAssignedSchedule($stateParams.schedule);
                  }
                });
              }
            ]
          }
        })

        .state('apps.displays.alerts', {
          url: '/alerts',
          templateProvider: ['$templateCache', function ($templateCache) {
            return $templateCache.get('partials/displays/alerts.html');
          }],
          controller: 'AlertsCtrl',
          resolve: {
            canAccessApps: ['canAccessApps',
              function (canAccessApps) {
                return canAccessApps();
              }
            ]
          }
        });

    }
  ]);

angular.module('risevision.displays.services', [
  'risevision.common.header',
  'risevision.common.gapi',
  'risevision.apps.config',
  'risevision.apps.services'
]);
angular.module('risevision.displays.filters', []);
angular.module('risevision.displays.directives', [
  'risevision.displays.filters'
]);
angular.module('risevision.displays.controllers', []);
