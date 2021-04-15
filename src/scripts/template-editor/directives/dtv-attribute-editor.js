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
          $scope.pages = [];
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

          var _getDirective = function (component) {
            if (!component) {
              return null;
            } else if (component.directive) {
              return component.directive;
            } else if ($scope.directives[component.type]) {
              return $scope.directives[component.type];
            } else {
              return null;
            }
          };

          var _getSelectedDirective = function () {
            var component = $scope.factory.selected;

            return _getDirective(component);
          };

          $scope.editComponent = function (component) {
            var directive = _getDirective(component);

            $scope.factory.selected = component;

            $scope.showNextPage(component);

            if (directive && directive.show) {
              directive.show();
            }

            _showAttributeList(false, 300);
          };

          $scope.onBackButton = function () {
            $scope.highlightComponent(null);

            var directive = _getSelectedDirective();

            if (!directive || !directive.onBackHandler || !directive.onBackHandler()) {
              $scope.showPreviousPage();
            }
          };

          // Private
          $scope.backToList = function () {
            var directive = _getSelectedDirective();

            if (directive && directive.element) {
              directive.element.hide();              
            }

            $scope.resetPanelHeader();

            $scope.factory.selected = null;
            $scope.pages = [];

            _showAttributeList(true, 0);
          };

          $scope.getComponentIcon = function (component) {
            var directive = _getDirective(component);

            return directive ? directive.icon : '';
          };

          $scope.getComponentIconType = function (component) {
            var directive = _getDirective(component);

            return directive ? directive.iconType : '';
          };

          $scope.getComponentTitle = function (component) {
            var directive = _getDirective(component);

            if ($scope.panelTitle) {
              return $scope.panelTitle;
            } else if (directive && directive.title) {
              return directive.title;
            } else if (component && component.label) {
              return component.label;
            } else {
              return '';
            }
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
            var directive = _getDirective(component);

            return directive && directive.isHeaderBottomRuleVisible ?
              directive.isHeaderBottomRuleVisible() : true;
          };

          $scope.getCurrentPage = function () {
            return $scope.pages.length > 0 ? $scope.pages[$scope.pages.length - 1] : null;
          };

          $scope.showNextPage = function (newPage) {
            var currentPage = $scope.getCurrentPage();

            $scope.pages.push(newPage);
            _swapToLeft(currentPage, newPage);
          };

          $scope.showPreviousPage = function () {
            var currentPage = $scope.pages.length > 0 ? $scope.pages.pop() : null;
            var previousPage = $scope.pages.length > 0 ? $scope.pages[$scope.pages.length - 1] : null;

            _swapToRight(currentPage, previousPage);

            if (!previousPage) {
              $scope.backToList();
            } else {
              $scope.factory.selected = previousPage;
            }

            return !!previousPage;
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

          function _showElement(component, direction, delay) {
            var directive = _getDirective(component);
            var element = directive && directive.panel && templateEditorUtils.findElement(directive.panel);

            if (directive && directive.element) {
              directive.element.show();
            }

            if (!element) {
              return;
            }

            _removeAnimationClasses(element);
            element.addClass('attribute-editor-show-from-' + direction);

            setTimeout(function () {
              element.show();
            }, delay || 0);
          }

          function _hideElement(component, delay) {
            var directive = _getDirective(component);
            var element = directive && directive.panel && templateEditorUtils.findElement(directive.panel);

            if (directive && directive.element) {
              directive.element.hide();
            }

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
            var data = event.data;

            if ('string' === typeof event.data) {
              try {
                data = JSON.parse(event.data);
              } catch (e) {}
            }

            if (data.type === 'editComponent') {
              $scope.editHighlightedComponent(data.value);
            }
          }

        }
      };
    }
  ]);
