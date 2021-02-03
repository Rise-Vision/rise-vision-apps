(function (angular) {

  'use strict';

  angular.module('risevision.common.components.scrolling-list')
    .directive('scrollingList', ['$parse', '$compile',
      function ($parse, $compile) {
        return {
          restrict: 'A',
          replace: false,
          terminal: true,
          priority: 1000,
          scope: true,
          link: function link(scope, element, attr) {
            var fn = $parse(attr.scrollingList);

            scope.handleScroll = function (event, isEndEvent) {
              var elContainsTarget = element[0].contains(event.target);

              // $log.debug(event.target.scrollTop + ' / ' + event.target.scrollHeight + ' / ' + isEndEvent);
              if (elContainsTarget && isEndEvent) {
                if (event.target.scrollTop &&
                  (event.target.scrollHeight - event.target.clientHeight -
                    event.target.scrollTop) < 20) {
                  //load more rows if less than 20px left to the bottom

                  fn(scope);
                }
              }
            };

            // Override this directive with rvScrollEvent
            // http://stackoverflow.com/questions/19224028/add-directives-from-directive-in-angularjs
            element.attr('rv-scroll-event',
              'handleScroll($event, isEndEvent)');
            element.removeAttr('scrolling-list'); //remove the attribute to avoid indefinite loop

            $compile(element)(scope);
          }
        };
      }
    ]);

})(angular);
