'use strict';

angular.module('risevision.template-editor.directives')
  .directive('templateComponentSlides', ['templateEditorFactory', 'slidesUrlValidationService', '$rootScope',
    '$loading',
    function (templateEditorFactory, slidesUrlValidationService, $rootScope, $loading) {
      return {
        restrict: 'E',
        scope: true,
        templateUrl: 'partials/template-editor/components/component-slides.html',
        link: function ($scope, element) {
          $scope.factory = templateEditorFactory;

          $rootScope.$on('risevision.page.visible', function (pageIsVisible) {
            if (_directiveIsVisible() && pageIsVisible) {
              $scope.saveSrc();
            }
          });

          $scope.$watch('spinner', function (loading) {
            if (loading) {
              $loading.start('slides-editor-loader');
            } else {
              $loading.stop('slides-editor-loader');
            }
          });

          $scope.spinner = false;

          function _load() {
            $scope.src = $scope.getAvailableAttributeData($scope.componentId, 'src');
            $scope.duration = parseInt($scope.getAvailableAttributeData($scope.componentId, 'duration')) || 10;
          }

          $scope.saveDuration = function () {
            if ($scope.duration > 0) {
              $scope.setAttributeData($scope.componentId, 'duration', $scope.duration);
            }
          };

          $scope.saveSrc = function () {
            if (_validateSrcLocally()) {

              $scope.setAttributeData($scope.componentId, 'src', $scope.src);

              $scope.spinner = true;

              slidesUrlValidationService.validate($scope.src)
                .then(function (result) {
                  $scope.validationResult = result;
                })
                .finally(function () {
                  $scope.spinner = false;
                });
            }
          };

          $scope.registerDirective({
            type: 'rise-slides',
            element: element,
            show: function () {
              $scope.componentId = $scope.factory.selected.id;
              _load();
              $scope.saveSrc(); //validate Slides URL
            }
          });

          function _directiveIsVisible() {
            // This directive is instantiated once by templateAttributeEditor
            // It becomes visible when <rise-slides> is selected
            return $scope.factory.selected && ($scope.factory.selected.type === 'rise-slides');
          }

          function _validateSrcLocally() {

            //clear the error
            $scope.validationResult = '';

            var PUBLISHED_URL_REGEXP =
              /^(http:|https:)\/\/docs\.google\.com\/presentation\/d\/e\/([^\s]+)\/(pub|embed)(\?|$)/i;
            var BROWSER_URL_REGEXP = /^(http:|https:)\/\/docs\.google\.com\/presentation\/d\/([\w-_]+)/i;

            var _src = !$scope.src ? '' : $scope.src.trim();
            if (_src === '') {
              //empty string is allowed
              return true;
            }

            //check if uses entered Published URL
            if (PUBLISHED_URL_REGEXP.test(_src)) {
              //nothing to do here - URL is formatted correctly
              return true;
            }

            //check if uses entered URL from browser navigation bar
            if (BROWSER_URL_REGEXP.test(_src)) {
              var slideId = BROWSER_URL_REGEXP.exec(_src)[2];
              $scope.src = _slideIdToEmbedUrl(slideId);
              return true;
            }

            //check if uses entered Slide ID - there should be no occurrences of '/' in the string
            if (_src.indexOf('/') === -1) {
              $scope.src = _slideIdToEmbedUrl(_src);
              return true;
            }

            $scope.validationResult = 'INVALID';
            return false;
          }

          function _slideIdToEmbedUrl(slideId) {
            // There are 2 types of Slide ID: 
            //  1) Google doc ID i.e. ID copied from the browser's navigation bar
            //  2) ID of the published URL. This ID ususally starst with "2PACX-"
            // For this implementaion we assume user entered Google doc ID (option #1)
            return 'https://docs.google.com/presentation/d/' + slideId + '/embed';
          }
        }
      };
    }
  ]);
