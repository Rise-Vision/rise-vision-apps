'use strict';

angular.module('risevision.template-editor.directives')
  .directive('templateAttributeEditor', ['$window', 'componentsFactory',
    function ($window, componentsFactory) {
      return {
        restrict: 'E',
        scope: {},
        templateUrl: 'partials/template-editor/attribute-editor.html',
        link: function ($scope, element) {
          $scope.componentsFactory = componentsFactory;
          componentsFactory.reset();

          $window.addEventListener('message', _handleMessageFromTemplate);

          element.on('$destroy', function () {
            $window.removeEventListener('message', _handleMessageFromTemplate);
          });

          function _handleMessageFromTemplate(event) {
            var data = event.data;

            if ('string' === typeof event.data) {
              try {
                data = JSON.parse(event.data);
              } catch (e) {}
            }

            if (data.type === 'editComponent') {
              componentsFactory.editHighlightedComponent(data.value);
            }
          }

        }
      };
    }
  ]);
