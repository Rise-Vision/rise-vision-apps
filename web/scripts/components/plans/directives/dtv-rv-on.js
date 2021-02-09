'use strict';

angular.module('risevision.common.components.plans')
  .directive('rvOn', function () {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        var attrVal = attrs.rvOn;
        var eventName = attrVal.split(':')[0];
        var ctrlFn = attrVal.split(':')[1];

        element.on(eventName, function (event) {
          scope.$apply(scope[ctrlFn].bind(null, scope, {
            $event: event
          }));
        });
      }
    };
  });
