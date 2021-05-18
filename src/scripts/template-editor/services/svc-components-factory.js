'use strict';

angular.module('risevision.template-editor.services')
  .constant('COMPONENTS_MAP', {
    'rise-branding-colors': {
      type: 'rise-branding-colors',
      iconType: 'streamline',
      icon: 'palette',
      panel: '.branding-colors-container',
      title: 'Color Settings',
    },
    'rise-branding': {
      type: 'rise-branding',
      iconType: 'streamline',
      icon: 'ratingStar',
      panel: '.branding-component-container',
      title: 'Brand Settings',
    },
    'rise-override-brand-colors': {
      type: 'rise-override-brand-colors',
      iconType: 'streamline',
      icon: 'palette',
      title: 'Override Brand Colors',
    },
    'rise-data-counter': {
      type: 'rise-data-counter',
      iconType: 'streamline',
      icon: 'hourglass',
      title: 'Counter'
    },
    'rise-data-financial': {
      type: 'rise-data-financial',
      iconType: 'streamline',
      icon: 'financial',
      title: 'Financial'
    },
    'rise-html': {
      type: 'rise-html',
      iconType: 'streamline',
      icon: 'html',
      title: 'HTML Embed',
      visual: true
    },
    'rise-image': {
      type: 'rise-image',
      icon: 'image',
      iconType: 'streamline',
      panel: '.image-component-container',
      title: 'Image',
      playUntilDone: true,
      visual: true,
      defaultAttributes: {
        responsive: true
      }
    },
    'rise-image-logo': {
      type: 'rise-image-logo',
      icon: 'circleStar',
      iconType: 'streamline',
      panel: '.image-component-container',
      title: 'Logo Settings'
    },
    'rise-playlist': {
      type: 'rise-playlist',
      iconType: 'streamline',
      icon: 'embedded-template',
      panel: '.rise-playlist-container',
      title: 'Playlist'
    },
    'rise-playlist-item': {
      type: 'rise-playlist-item',
      iconType: 'streamline',
      icon: 'embedded-template',
      panel: '.playlist-item-container',
      title: 'Playlist Item'
    },
    'rise-presentation-selector': {
      type: 'rise-presentation-selector',
      iconType: 'streamline',
      icon: 'embedded-template',
      panel: '.presentation-selector-container',
      title: 'Select Presentations'
    },
    'rise-data-rss': {
      type: 'rise-data-rss',
      iconType: 'streamline',
      icon: 'rss',
      title: 'RSS'
    },
    'rise-schedules': {
      type: 'rise-schedules',
      title: 'Schedules'
    },
    'rise-slides': {
      type: 'rise-slides',
      iconType: 'streamline',
      icon: 'slides',
      title: 'Google Slides',
      visual: true
    },
    'rise-storage-selector': {
      type: 'rise-storage-selector',
      iconType: 'riseSvg',
      icon: 'riseStorage',
      panel: '.storage-selector-container',
      title: 'Rise Storage',
    },
    'rise-text': {
      type: 'rise-text',
      iconType: 'streamline',
      icon: 'text',
      title: 'Text',
      visual: true,
      defaultAttributes: {
        fontsize: 100,
        multiline: true
      }
    },
    'rise-time-date': {
      type: 'rise-time-date',
      iconType: 'streamline',
      icon: 'time',
      title: 'Time and Date',
      visual: true,
      defaultAttributes: {
        type: 'timedate'
      }
    },
    'rise-data-twitter': {
      type: 'rise-data-twitter',
      iconType: 'streamline',
      icon: 'twitter',
      title: 'Twitter'
    },
    'rise-video': {
      type: 'rise-video',
      iconType: 'streamline',
      icon: 'video',
      panel: '.video-component-container',
      title: 'Video',
      playUntilDone: true,
      visual: true
    },
    'rise-data-weather': {
      type: 'rise-data-weather',
      iconType: 'streamline',
      icon: 'sun',
      title: 'Weather'
    }
  })
  .factory('COMPONENTS_ARRAY', ['COMPONENTS_MAP', 
    function(COMPONENTS_MAP) {
      return _.values(COMPONENTS_MAP);
    }
  ])
  .factory('PLAYLIST_COMPONENTS', ['COMPONENTS_ARRAY',
    function(COMPONENTS_ARRAY) {
      return _.filter(COMPONENTS_ARRAY, {
        visual: true
      });
    }
  ])
  .factory('componentsFactory', ['$window', '$timeout', 'templateEditorUtils', 'blueprintFactory',
    'COMPONENTS_MAP', 'HTML_TEMPLATE_DOMAIN',
    function ($window, $timeout, templateEditorUtils, blueprintFactory,
      COMPONENTS_MAP, HTML_TEMPLATE_DOMAIN) {
      var factory = {};

      factory.reset = function() {
        factory.selected = null;
        factory.showAttributeList = true;
        factory.directives = {};
        factory.pages = [];
      };

      factory.reset();

      factory.registerDirective = function (directive) {
        directive.element.hide();
        factory.directives[directive.type] = directive;

        angular.extend(directive, COMPONENTS_MAP[directive.type]);

        if (directive.onPresentationOpen) {
          directive.onPresentationOpen();
        }
      };

      var _getDirective = function (component) {
        if (!component) {
          return null;
        } else if (component.directive) {
          return component.directive;
        } else if (factory.directives[component.type]) {
          return factory.directives[component.type];
        } else {
          return null;
        }
      };

      var _getSelectedDirective = function () {
        var component = factory.selected;

        return _getDirective(component);
      };

      factory.editComponent = function (component) {
        var directive = _getDirective(component);

        factory.selected = component;

        factory.showNextPage(component);

        if (directive && directive.show) {
          directive.show();
        }

        _showAttributeList(false, 300);
      };

      factory.onBackButton = function () {
        factory.highlightComponent(null);

        var directive = _getSelectedDirective();

        if (!directive || !directive.onBackHandler || !directive.onBackHandler()) {
          factory.showPreviousPage();
        }
      };

      // Private
      factory.backToList = function () {
        var directive = _getSelectedDirective();

        if (directive && directive.element) {
          directive.element.hide();              
        }

        factory.resetPanelHeader();

        factory.selected = null;
        factory.pages = [];

        _showAttributeList(true, 0);
      };

      factory.getComponentIcon = function (component) {
        var directive = _getDirective(component);

        return directive ? directive.icon : '';
      };

      factory.getComponentIconType = function (component) {
        var directive = _getDirective(component);

        return directive ? directive.iconType : '';
      };

      factory.getComponentTitle = function (component) {
        var directive = _getDirective(component);

        if (factory.panelTitle) {
          return factory.panelTitle;
        } else if (component && component.label) {
          return component.label;
        } else if (directive && directive.title) {
          return directive.title;
        } else {
          return '';
        }
      };

      factory.highlightComponent = function (componentId) {
        var message = {
          type: 'highlightComponent',
          value: componentId
        };
        var iframe = $window.document.getElementById('template-editor-preview');
        iframe.contentWindow.postMessage(JSON.stringify(message), HTML_TEMPLATE_DOMAIN);
      };

      factory.isHeaderBottomRuleVisible = function (component) {
        var directive = _getDirective(component);

        return directive && directive.isHeaderBottomRuleVisible ?
          directive.isHeaderBottomRuleVisible() : true;
      };

      factory.getCurrentPage = function () {
        return factory.pages.length > 0 ? factory.pages[factory.pages.length - 1] : null;
      };

      factory.showNextPage = function (newPage) {
        var currentPage = factory.getCurrentPage();

        factory.pages.push(newPage);
        _swapToLeft(currentPage, newPage);
      };

      factory.showPreviousPage = function () {
        var currentPage = factory.pages.length > 0 ? factory.pages.pop() : null;
        var previousPage = factory.pages.length > 0 ? factory.pages[factory.pages.length - 1] : null;

        if (!previousPage) {
          factory.backToList();
        } else {
          factory.selected = previousPage;

          _swapToRight(currentPage, previousPage);
        }

        return !!previousPage;
      };

      factory.resetPanelHeader = function () {
        factory.setPanelIcon(null, null);
        factory.setPanelTitle(null);
      };

      factory.setPanelIcon = function (panelIcon, panelIconType) {
        factory.panelIcon = panelIcon;
        factory.panelIconType = panelIconType;
      };

      factory.setPanelTitle = function (panelTitle) {
        factory.panelTitle = panelTitle;
      };

      factory.editHighlightedComponent = function (componentId) {
        var component = _.find(blueprintFactory.blueprintData.components, function (element) {
          return element.id === componentId;
        });
        if (component) {
          if (factory.selected) {
            factory.backToList();
          }
          factory.editComponent(component);
        }
      };

      function _showAttributeList(value, delay) {
        $timeout(function () {
          factory.showAttributeList = value;
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
        var selectedDirective = _getDirective(factory.getCurrentPage());

        var element = directive && directive.panel && templateEditorUtils.findElement(directive.panel);

        if (directive && directive.element && directive.element !== selectedDirective.element) {
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

      return factory;
    }
  ]);
