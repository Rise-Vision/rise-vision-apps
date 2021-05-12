'use strict';

angular.module('risevision.template-editor.directives')
  .directive('templateComponentRss', ['templateEditorFactory', 'attributeDataFactory', '$loading', 'componentUtils', 'rssFeedValidation',
    '$timeout',
    function (templateEditorFactory, attributeDataFactory, $loading, componentUtils, rssFeedValidation, $timeout) {
      return {
        restrict: 'E',
        scope: true,
        templateUrl: 'partials/template-editor/components/component-rss.html',
        link: function ($scope, element) {
          $scope.factory = templateEditorFactory;

          $scope.$watch('spinner', function (loading) {
            if (loading) {
              $loading.start('rss-editor-loader');
            } else {
              $loading.stop('rss-editor-loader');
            }
          });

          $scope.spinner = false;

          $scope.saveFeed = function () {
            if (_validateFeedUrl()) {
              $scope.spinner = true;

              _isFeedParsable();
            }
          };

          $scope.saveMaxItems = function () {
            attributeDataFactory.setAttributeData($scope.componentId, 'maxitems', parseInt($scope.maxItems, 10));
          };

          $scope.registerDirective({
            type: 'rise-data-rss',
            element: element,
            show: function () {
              $scope.componentId = $scope.factory.selected.id;
              _load();
              $scope.saveFeed(); // validate Feed URL
            }
          });

          function _load() {
            var maxItems = attributeDataFactory.getAvailableAttributeData($scope.componentId, 'maxitems');

            $scope.feedUrl = attributeDataFactory.getAvailableAttributeData($scope.componentId, 'feedurl');
            $scope.maxItems = maxItems ? maxItems.toString() : '1';
          }

          function _validateFeedUrl() {
            //clear the error
            $scope.validationResult = '';

            var _feed = !$scope.feedUrl ? '' : $scope.feedUrl.trim();
            if (_feed === '') {
              //empty string is allowed
              return true;
            }

            //check if feed url is valid format
            if (componentUtils.isValidUrl(_feed)) {
              return true;
            }

            $scope.validationResult = 'INVALID_URL';
            return false;
          }

          function _isFeedParsable() {
            rssFeedValidation.isParsable($scope.feedUrl)
              .then(function (result) {
                if (result === 'VALID') {
                  attributeDataFactory.setAttributeData($scope.componentId, 'feedurl', $scope.feedUrl);

                  _isFeedValid();
                } else {
                  $scope.validationResult = result;
                  $scope.spinner = false;
                }
              });
          }

          function _isFeedValid() {
            rssFeedValidation.isValid($scope.feedUrl)
              .then(function (result) {
                $scope.validationResult = result;
              })
              .finally(function () {
                $scope.spinner = false;
              });
          }

        }
      };
    }
  ]);
