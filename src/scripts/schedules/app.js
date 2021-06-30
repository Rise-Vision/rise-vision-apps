'use strict';

angular.module('risevision.apps')
  // Set up our mappings between URLs, templates, and controllers
  .config(['$stateProvider',
    function storeRouteConfig($stateProvider) {

      // Use $stateProvider to configure states.
      $stateProvider
        .state('apps.schedules', {
          abstract: true,
          template: '<div class="container schedules-app" ui-view></div>',
          data: {
            requiresAuth: true
          }
        })

        .state('apps.schedules.home', {
          url: '/schedules',
          redirectTo: 'apps.schedules.list'
        })

        .state('apps.schedules.list', {
          url: '/schedules/list',
          templateProvider: ['$templateCache', function ($templateCache) {
            return $templateCache.get(
              'partials/schedules/schedules-list.html');
          }],
          controller: 'schedulesList'
        })

        .state('apps.schedules.details', {
          url: '/schedules/details/:scheduleId',
          templateProvider: ['$templateCache', function ($templateCache) {
            return $templateCache.get(
              'partials/schedules/schedule-details.html');
          }],
          controller: 'scheduleDetails',
          resolve: {
            scheduleInfo: ['scheduleFactory', '$stateParams',
              function (scheduleFactory, $stateParams) {
                //load the schedule based on the url param
                return scheduleFactory.getSchedule($stateParams.scheduleId);
              }
            ]
          }
        })

        .state('apps.schedules.add', {
          url: '/schedules/add',
          templateProvider: ['$templateCache', function ($templateCache) {
            return $templateCache.get(
              'partials/schedules/schedule-add.html');
          }],
          params: {
            presentationItem: null
          },
          controller: 'scheduleAdd',
          resolve: {
            scheduleInfo: ['$stateParams', 'scheduleFactory', 'playlistFactory',
              function ($stateParams, scheduleFactory, playlistFactory) {
                scheduleFactory.newSchedule();

                if ($stateParams.presentationItem) {
                  return playlistFactory.addPresentationItem($stateParams.presentationItem);
                }
              }
            ]
          }
        });

    }
  ]);

angular.module('risevision.schedules.services', [
  'risevision.common.header',
  'risevision.common.gapi',
  'risevision.apps.services',
  'risevision.template-editor.services',
  'risevision.common.components.timeline.services',
  'risevision.widget.common.url-field.insecure-url'
]);
angular.module('risevision.schedules.filters', []);
angular.module('risevision.schedules.directives', [
  'risevision.schedules.filters'
]);
angular.module('risevision.schedules.controllers', []);
