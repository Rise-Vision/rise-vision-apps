'use strict';

angular.module('risevision.template-editor.directives')
  .directive('templateAttributeEditor', ['$timeout', 'templateEditorFactory', 'templateEditorUtils',
    function ($timeout, templateEditorFactory, templateEditorUtils) {
      return {
        restrict: 'E',
        templateUrl: 'partials/template-editor/attribute-editor.html',
        link: function ($scope) {
          $scope.factory = templateEditorFactory;
          $scope.showAttributeList = true;
          $scope.directives = {};
          $scope.panels = [];

          $scope.$watch('factory.presentation', function () {
            $scope.showAttributeList = true;
            $scope.panels = [];
          });

          $scope.registerDirective = function (directive) {
            directive.element.hide();
            $scope.directives[directive.type] = directive;
          };

          $scope.editComponent = function (component) {
            var directive = $scope.directives[component.type];

            $scope.factory.selected = component;
            directive.show();

            _showAttributeList(false, 300);
          };

          $scope.onBackButton = function () {
            var component = $scope.factory.selected;
            var directive = $scope.directives[component.type];

            if (!directive.onBackHandler || !directive.onBackHandler()) {
              $scope.backToList();
            }
          };

          $scope.backToList = function () {
            var component = $scope.factory.selected;
            var directive = $scope.directives[component.type];

            $scope.factory.selected = null;
            directive.element.hide();

            _showAttributeList(true, 0);
          };

          $scope.getComponentIcon = function (component) {
            return component && $scope.directives[component.type] ?
              $scope.directives[component.type].icon : '';
          };

          $scope.getComponentIconType = function (component) {
            return component && $scope.directives[component.type] ?
              $scope.directives[component.type].iconType : '';
          };

          $scope.isHeaderBottomRuleVisible = function (component) {
            if (!component) {
              return true;
            }

            var directive = $scope.directives[component.type];

            return directive && directive.isHeaderBottomRuleVisible ?
              directive.isHeaderBottomRuleVisible() : true;
          };

          $scope.getCurrentPanel = function () {
            return $scope.panels.length > 0 ? $scope.panels[$scope.panels.length - 1] : null;
          };

          $scope.showNextPanel = function (newPanel) {
            var currentPanel = $scope.getCurrentPanel();

            $scope.panels.push(newPanel);
            _swapToLeft(currentPanel, newPanel);
          };

          $scope.showPreviousPanel = function () {
            var currentPanel = $scope.panels.length > 0 ? $scope.panels.pop() : null;
            var previousPanel = $scope.panels.length > 0 ? $scope.panels[$scope.panels.length - 1] : null;

            _swapToRight(currentPanel, previousPanel);

            if (!previousPanel) {
              $scope.setPanelIcon(null, null);
              $scope.setPanelTitle(null);
            }

            return !!previousPanel;
          };

          $scope.setPanelIcon = function (panelIcon, panelIconType) {
            $scope.panelIcon = panelIcon;
            $scope.panelIconType = panelIconType;
          };

          $scope.setPanelTitle = function (panelTitle) {
            $scope.panelTitle = panelTitle;
          };

          function _showAttributeList(value, delay) {
            $timeout(function () {
              $scope.showAttributeList = value;
            }, !isNaN(delay) ? delay : 500);
          }

          function _removeAnimationClasses(selector) {
            var element = templateEditorUtils.findElement(selector);

            if (element) {
              element.removeClass('attribute-editor-show-from-right');
              element.removeClass('attribute-editor-hide-to-right');
              element.removeClass('attribute-editor-show-from-left');
              element.removeClass('attribute-editor-hide-to-left');
            }
          }

          function _showElement(selector, delay) {
            var element = templateEditorUtils.findElement(selector);

            if (element) {
              setTimeout(function () {
                element.show();
              }, delay || 0);
            }
          }

          function _hideElement(selector, delay) {
            var element = templateEditorUtils.findElement(selector);

            if (element) {
              setTimeout(function () {
                element.hide();
              }, delay || 0);
            }
          }

          function _setCurrentClass(selector, currentClass) {
            var element = templateEditorUtils.findElement(selector);

            if (element) {
              _removeAnimationClasses(selector);
              element.addClass(currentClass);
            }
          }

          function _swapToLeft(swappedOutSelector, swappedInSelector) {
            _setCurrentClass(swappedInSelector, 'attribute-editor-show-from-right');
            _showElement(swappedInSelector);
            _hideElement(swappedOutSelector);
          }

          function _swapToRight(swappedOutSelector, swappedInSelector) {
            _setCurrentClass(swappedInSelector, 'attribute-editor-show-from-left');
            _showElement(swappedInSelector);
            _hideElement(swappedOutSelector);
          }
        }
      };
    }
  ]);
