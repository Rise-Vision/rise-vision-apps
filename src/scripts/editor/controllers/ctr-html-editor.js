'use strict';

angular.module('risevision.editor.controllers')
  .controller('HtmlEditorController', ['$scope', 'editorFactory',
    'presentationParser', 'distributionParser',
    function ($scope, editorFactory, presentationParser, distributionParser) {
      $scope.factory = editorFactory;
      presentationParser.updatePresentation(editorFactory.presentation);
      distributionParser.updateDistribution(editorFactory.presentation);

      $scope.codemirrorOptions = {
        lineNumbers: true,
        theme: 'twilight',
        lineWrapping: false,
        mode: 'htmlmixed'
      };

      $scope.$on('$destroy', function () {
        presentationParser.parsePresentation(editorFactory.presentation);
        distributionParser.parseDistribution(editorFactory.presentation);
      });
    }
  ]); //ctr
