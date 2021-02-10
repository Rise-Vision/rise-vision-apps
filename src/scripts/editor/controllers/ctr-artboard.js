'use strict';

angular.module('risevision.editor.controllers')
  .controller('ArtboardController', ['$scope', 'editorFactory',
    function ($scope, editorFactory) {
      $scope.factory = editorFactory;
    }
  ]); //ctr
