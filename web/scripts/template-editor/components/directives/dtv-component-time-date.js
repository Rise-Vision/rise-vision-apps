'use strict';

angular.module('risevision.template-editor.directives')
  .directive('templateComponentTimeDate', ['templateEditorFactory',
    function (templateEditorFactory) {
      return {
        restrict: 'E',
        scope: true,
        templateUrl: 'partials/template-editor/components/component-time-date.html',
        link: function ($scope, element) {
          var DATE_FORMATS = [ 'MMMM DD, YYYY', 'MMM DD YYYY', 'MM/DD/YYYY', 'DD/MM/YYYY' ];

          $scope.factory = templateEditorFactory;
          $scope.dateFormats = DATE_FORMATS.map(function (format) {
            return {
              format: format,
              date: moment().format(format)
            };
          });
          $scope.dateFormat = $scope.dateFormats[0].format;

          $scope.registerDirective({
            type: 'rise-time-date',
            iconType: 'streamline',
            icon: 'time',
            element: element,
            show: function () {
              element.show();
              $scope.componentId = $scope.factory.selected.id;
              $scope.load();
            },
            getTitle: function (component) {
              return 'template.rise-time-date' + '-' + component.attributes.type.value;
            }
          });

          $scope.load = function () {
            var type = $scope.getAvailableAttributeData($scope.componentId, 'type');

            $scope.type = type;
          };

          $scope.saveChanges = function () {

          };
        }
      };
    }
  ]);
