'use strict';

angular.module('risevision.apps.launcher.controllers')
  .controller('AppHomeCtrl', ['$scope', 'editorFactory',
    function ($scope, editorFactory) {
      $scope.editorFactory = editorFactory;
    }
  ]); //ctr
