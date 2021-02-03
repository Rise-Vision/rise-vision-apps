/* globals $ */

(function () {
  'use strict';

  angular.module('risevision.widgets.directives')
    .directive('scrollOnAlerts', function () {
      return {
        restrict: 'A', //restricts to attributes
        scope: false,
        link: function ($scope, $elm) {
          $scope.$watchCollection('alerts', function (newAlerts, oldAlerts) {
            if (newAlerts.length > 0 && oldAlerts.length === 0) {
              $('body').animate({
                scrollTop: $elm.offset().top
              }, 'fast');
            }
          });
        }
      };
    });
}());
