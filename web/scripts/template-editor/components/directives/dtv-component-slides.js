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
            $scope.src = _loadAttributeData('src');
            $scope.duration = parseInt(_loadAttributeData('duration'));
          }

          function _loadAttributeData(attributeName) {
            return $scope.getAttributeData($scope.componentId, attributeName);
          }

          $scope.saveDiration = function () {
            $scope.setAttributeData($scope.componentId, 'duration', $scope.duration);
          };

          $scope.handleKeyPressSrc = function (event) {
            //handle Enter key only
            if (event.which === 13) {
              $scope.saveSrc();
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
            iconType: 'svg',
            icon: '<path d="M2,0 L11.615245,0 C12.7198145,-2.02906125e-16 13.615245,0.8954305 13.615245,2 L13.615245,10.9103448 C13.615245,12.0149143 12.7198145,12.9103448 11.615245,12.9103448 L2,12.9103448 C0.8954305,12.9103448 1.11632554e-15,12.0149143 0,10.9103448 L0,2 C-1.3527075e-16,0.8954305 0.8954305,6.46995335e-16 2,4.4408921e-16 Z M0.866424682,2.35862069 L0.866424682,10.5517241 L12.7488203,10.5517241 L12.7488203,2.35862069 L0.866424682,2.35862069 Z" id="Combined-Shape"></path>' +
              '<path d="M12.642936,9.69777469 L12.9963702,5.08965517 L16.9375681,5.08965517 C18.0421376,5.08965517 18.9375681,5.98508567 18.9375681,7.08965517 L18.9375681,16 C18.9375681,17.1045695 18.0421376,18 16.9375681,18 L7.32232305,18 C6.21775355,18 5.32232305,17.1045695 5.32232305,16 L5.32232305,11.5448276 L10.6487927,11.5448276 C11.6940373,11.5448276 12.5630024,10.7399584 12.642936,9.69777469 Z M12.9963702,11.9172414 L6.18874773,11.9172414 L6.18874773,15.6413793 L18.0711434,15.6413793 L18.0711434,7.44827586 L12.9963702,7.44827586 L12.9963702,11.9172414 Z" id="Combined-Shape"></path>',
            element: element,
            show: function () {
              element.show();
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

            if (!$scope.src) {
              //empty string is allowed
              return true;
            }

            var _src = $scope.src.trim();

            if (_src === '') {
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
