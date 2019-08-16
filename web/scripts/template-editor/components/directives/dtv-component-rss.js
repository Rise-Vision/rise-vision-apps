'use strict';

angular.module('risevision.template-editor.directives')
  .directive('templateComponentRss', ['templateEditorFactory', '$loading', 'componentUtils', 'rssFeedValidation',
    '$timeout',
    function (templateEditorFactory, $loading, componentUtils, rssFeedValidation, $timeout) {
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
              $scope.setAttributeData($scope.componentId, 'feed-url', $scope.feedUrl);
              $scope.spinner = true;

              _isFeedParsable();
            }
          };

          $scope.saveMaxItems = function () {
            $scope.setAttributeData($scope.componentId, 'max-items', parseInt($scope.maxItems, 10));
          };

          $scope.registerDirective({
            type: 'rise-data-rss',
            iconType: 'streamline',
            icon: 'rss',
            element: element,
            show: function () {
              element.show();
              $scope.componentId = $scope.factory.selected.id;
              _load();
              $scope.saveFeed(); // validate Feed URL
            }
          });

          function _load() {
            var maxItems = $scope.getAvailableAttributeData($scope.componentId, 'max-items');

            $scope.feedUrl = $scope.getAvailableAttributeData($scope.componentId, 'feed-url');
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
