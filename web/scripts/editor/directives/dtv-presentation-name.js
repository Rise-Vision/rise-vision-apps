'use strict';

angular.module('risevision.editor.directives')
  .directive('presentationName', ['presentationFactory',
    function (presentationFactory) {
      return {
        restrict: 'A',
        require: '?ngModel',
        scope: {
          id: '=presentationName',
          ngModel: '=?'
        },
        link: function ($scope, element, attr, ngModel) {
          $scope.$watch('id', function (id) {
            if (id) {
              presentationFactory.getPresentationCached(id)
                .then(function (presentation) {
                  if (presentation && presentation.name) {
                    if (ngModel) {
                      $scope.ngModel = presentation.name;
                    } else {
                      element.html(presentation.name);
                    }
                  }
                });
            }
          });
        } //link()
      };
    }
  ]);
