'use strict';

angular.module('risevision.apps.controllers')
  .controller('AppCtrl', ['$scope', '$rootScope', '$state', 'STORE_URL',
    function ($scope, $rootScope, $state, STORE_URL) {
      $scope.navOptions = [{
        title: 'Home',
        link: $state.href('apps.launcher.home'),
        cid: true,
        states: [
          'apps.launcher.home',
          'apps.launcher.signup',
          'apps.launcher.signin'
        ]
      }, {
        title: 'Presentations',
        link: $state.href('apps.editor.home'),
        cid: true,
        states: [
          'apps.editor.home',
          'apps.editor.list',
          'apps.editor.workspace.artboard',
          'apps.editor.workspace.htmleditor'
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
      }, {
        title: 'Store',
        link: STORE_URL,
        cid: true
      }];
      $scope.navSelected = 'apps.launcher.home';
      $scope.hideCH = false;

      $rootScope.$on('$stateChangeSuccess', function () {
        $scope.navSelected = $state.current.name;
        $scope.hideCH = $state.current.name ===
          'apps.launcher.unauthorized' ||
          $state.current.name === 'apps.launcher.unregistered' ||
          $state.current.name === 'apps.launcher.signin' ||
          $state.current.name === 'apps.launcher.signup';
      });
    }
  ]); //ctr
