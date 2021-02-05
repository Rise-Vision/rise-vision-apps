'use strict';

angular.module('risevision.template-editor.directives')
  .directive('templateAttributeEditor', ['$timeout', 'templateEditorFactory', 'templateEditorUtils',
    'blueprintFactory', '$window', 'HTML_TEMPLATE_DOMAIN',
    function ($timeout, templateEditorFactory, templateEditorUtils, blueprintFactory, $window,
      HTML_TEMPLATE_DOMAIN) {
      return {
        restrict: 'E',
        templateUrl: 'partials/template-editor/attribute-editor.html',
        link: function ($scope, element) {
          $scope.factory = templateEditorFactory;
          $scope.showAttributeList = true;
          $scope.directives = {};
          $scope.panels = [];
          $scope.factory.selected = null;

          $window.addEventListener('message', _handleMessageFromTemplate);

          element.on('$destroy', function () {
            $window.removeEventListener('message', _handleMessageFromTemplate);
          });

          $scope.registerDirective = function (directive) {
            directive.element.hide();
            $scope.directives[directive.type] = directive;

            if (directive.onPresentationOpen) {
              directive.onPresentationOpen();
            }
          };

          $scope.editComponent = function (component) {
            var directive = $scope.directives[component.type];

            $scope.factory.selected = component;

            directive.element.show();
            if (directive.panel) {
              $scope.showNextPanel(directive.panel);
            }

            directive.show();

            _showAttributeList(false, 300);
          };

          $scope.onBackButton = function () {
            $scope.highlightComponent(null);

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

          $scope.highlightComponent = function (componentId) {
            var message = {
              type: 'highlightComponent',
              value: componentId
            };
            var iframe = $window.document.getElementById('template-editor-preview');
            iframe.contentWindow.postMessage(JSON.stringify(message), HTML_TEMPLATE_DOMAIN);
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
              $scope.resetPanelHeader();
            }

            return !!previousPanel;
          };

          $scope.resetPanelHeader = function () {
            $scope.setPanelIcon(null, null);
            $scope.setPanelTitle(null);
          };

          $scope.setPanelIcon = function (panelIcon, panelIconType) {
            $scope.panelIcon = panelIcon;
            $scope.panelIconType = panelIconType;
          };

          $scope.setPanelTitle = function (panelTitle) {
            $scope.panelTitle = panelTitle;
          };

          $scope.editHighlightedComponent = function (componentId) {
            var component = _.find(blueprintFactory.blueprintData.components, function (element) {
              return element.id === componentId;
            });
            if (component) {
              if ($scope.factory.selected) {
                $scope.backToList();
                $scope.panels = [];
                $scope.resetPanelHeader();
              }
              $scope.editComponent(component);
            }
          };

          function _showAttributeList(value, delay) {
            $timeout(function () {
              $scope.showAttributeList = value;
            }, !isNaN(delay) ? delay : 500);
          }

          function _removeAnimationClasses(element) {
            element.removeClass('attribute-editor-show-from-right');
            element.removeClass('attribute-editor-show-from-left');
          }

          function _showElement(selector, direction, delay) {
            var element = templateEditorUtils.findElement(selector);

            if (!element) {
              return;
            }

            _removeAnimationClasses(element);
            element.addClass('attribute-editor-show-from-' + direction);

            setTimeout(function () {
              element.show();
            }, delay || 0);
          }

          function _hideElement(selector, delay) {
            var element = templateEditorUtils.findElement(selector);

            if (!element) {
              return;
            }

            setTimeout(function () {
              element.hide();
            }, delay || 0);
          }

          function _swapToLeft(swappedOutSelector, swappedInSelector) {
            _showElement(swappedInSelector, 'right');
            _hideElement(swappedOutSelector);
          }

          function _swapToRight(swappedOutSelector, swappedInSelector) {
            _showElement(swappedInSelector, 'left');
            _hideElement(swappedOutSelector);
          }

          function _handleMessageFromTemplate(event) {
            var data = JSON.parse(event.data);

            if (data.type === 'editComponent') {
              $scope.editHighlightedComponent(data.value);
            }
          }

        }
      };
    }
  ]);
