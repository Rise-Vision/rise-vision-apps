'use strict';

angular.module('risevision.template-editor.directives')
  .directive('templateEditorToolbar', ['templateEditorFactory', '$templateCache', '$modal',
    '$window', '$timeout',
    function (templateEditorFactory, $templateCache, $modal, $window, $timeout) {
      return {
        restrict: 'E',
        templateUrl: 'partials/template-editor/toolbar.html',
        link: function ($scope, element) {
          $scope.factory = templateEditorFactory;
          $scope.isEditingName = false;
          $scope.defaultNameValue = templateEditorFactory.presentation.name;
          $scope.defaultNameWidth = '';

          $scope.onPresentationNameBlur = function () {
            $scope.isEditingName = false;
          };

          var _initStretchy = function () {
            var templateNameInput = element.find('input.presentation-name');

            $window.Stretchy.resize(templateNameInput[0]);

            if (!$scope.defaultNameWidth) {
              // first time editing, store the width of the field when default name is displayed
              $scope.defaultNameWidth = $window.getComputedStyle(templateNameInput[0]).getPropertyValue('width');
            }
          };

          $timeout(_initStretchy);

          $scope.$watch('isEditingName', function (editing) {
            var templateNameInput = element.find('input.presentation-name');

            if (editing) {
              setFocus(templateNameInput[0]);
            } else {
              var nameVal = templateNameInput[0].value.replace(/\s/g, '');

              if (!nameVal) {
                // user deleted entire name, set the name and width values to the defaults
                $scope.factory.presentation.name = $scope.defaultNameValue;
                templateNameInput[0].style.width = $scope.defaultNameWidth;
              }
            }
          });

          $scope.confirmDelete = function () {
            $scope.modalInstance = $modal.open({
              template: $templateCache.get('partials/components/confirm-modal/madero-confirm-danger-modal.html'),
              controller: 'confirmModalController',
              windowClass: 'madero-style centered-modal',
              resolve: {
                confirmationTitle: function () {
                  return 'template.confirm-modal.delete-warning';
                },
                confirmationButton: function () {
                  return 'common.delete-forever';
                },
                confirmationMessage: null,
                cancelButton: null
              }
            });

            $scope.modalInstance.result.then(function () {
              $scope.modalInstance.dismiss();
              templateEditorFactory.deletePresentation();
            });
          };

          $scope.presentationNameKeyUp = function (keyEvent) {
            // handle enter key
            if (keyEvent.which === 13 && $scope.isEditingName) {
              $scope.isEditingName = false;
            }
          };

          function setFocus(elem) {
            if (elem !== null) {
              if (elem.createTextRange) {
                var range = elem.createTextRange();
                range.move('character', 0);
                range.select();
              } else {
                if (elem.setSelectionRange) {
                  elem.focus();
                  elem.setSelectionRange(0, elem.value.length);
                } else {
                  elem.focus();
                }
              }
            }
          }
        }
      };
    }
  ]);
