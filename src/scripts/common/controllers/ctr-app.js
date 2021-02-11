'use strict';

angular.module('risevision.apps.controllers')
  .controller('AppCtrl', ['$scope', '$rootScope', '$state',
    function ($scope, $rootScope, $state) {
      $scope.navOptions = [{
        title: 'Presentations',
        link: $state.href('apps.editor.home'),
        cid: true,
        states: [
          'apps.editor.home',
          'apps.editor.list',
          'apps.editor.workspace.artboard',
          'apps.editor.workspace.htmleditor',
          'apps.editor.templates.edit'
        ]
      }, {
        title: 'Schedules',
        link: $state.href('apps.schedules.home'),
        cid: true,
        states: [
          'apps.schedules.home',
          'apps.schedules.list',
          'apps.schedules.details',
          'apps.schedules.add'
        ]
      }, {
        title: 'Displays',
        link: $state.href('apps.displays.home'),
        cid: true,
        states: [
          'apps.displays.home',
          'apps.displays.list',
          'apps.displays.add',
          'apps.displays.details'
        ]
      }, {
        title: 'Storage',
        link: $state.href('apps.storage.home'),
        cid: true,
        states: ['apps.storage.home']
      }];
      $scope.navSelected = 'apps.editor.home';
      $scope.hideCommonHeader = true;

      $rootScope.$on('$stateChangeSuccess', function () {
        $scope.navSelected = $state.current.name;
        $scope.hideCommonHeader =
          $state.current.name.indexOf('common.auth') !== -1 ||
          $state.current.name.indexOf('apps.billing.invoice') !== -1 ||
          $state.current.name.indexOf('apps.billing.unpaid') !== -1;
      });
    }
  ]); //ctr
