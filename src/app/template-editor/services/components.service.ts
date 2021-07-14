import { Injectable } from '@angular/core';

import * as $ from 'jquery';
import * as jQuery from 'jquery';
import * as _ from 'lodash';
import * as angular from 'angular';
import { downgradeInjectable } from '@angular/upgrade/static';
import { TemplateEditorUtilsService } from './template-editor-utils.service';
import { BlueprintService } from './blueprint.service';
import { TemplateEditorService } from './template-editor.service';

@Injectable({
  providedIn: 'root'
})
export class ComponentsService {

  static readonly COMPONENTS_MAP = {
    'rise-branding-colors': {
      type: 'rise-branding-colors',
      icon: 'palette',
      panel: '.branding-colors-container',
      title: 'Color Settings',
    },
    'rise-branding': {
      type: 'rise-branding',
      icon: 'ratingStar',
      panel: '.branding-component-container',
      title: 'Brand Settings',
    },
    'rise-override-brand-colors': {
      type: 'rise-override-brand-colors',
      icon: 'palette',
      title: 'Override Brand Colors',
    },
    'rise-data-counter': {
      type: 'rise-data-counter',
      icon: 'hourglass',
      title: 'Counter'
    },
    'rise-data-financial': {
      type: 'rise-data-financial',
      icon: 'financial',
      title: 'Financial'
    },
    'rise-html': {
      type: 'rise-html',
      icon: 'html',
      title: 'HTML Embed',
      visual: true
    },
    'rise-image': {
      type: 'rise-image',
      icon: 'image',
      panel: '.image-component-container',
      title: 'Image',
      playUntilDone: true,
      visual: true
    },
    'rise-image-logo': {
      type: 'rise-image-logo',
      icon: 'circleStar',
      panel: '.image-component-container',
      title: 'Logo Settings'
    },
    'rise-playlist': {
      type: 'rise-playlist',
      icon: 'playlist',
      panel: '.rise-playlist-container',
      title: 'Playlist'
    },
    'rise-playlist-item': {
      type: 'rise-playlist-item',
      icon: 'embedded-template',
      panel: '.playlist-item-container',
      title: 'Playlist Item'
    },
    'rise-presentation-selector': {
      type: 'rise-presentation-selector',
      icon: 'embedded-template',
      panel: '.presentation-selector-container',
      title: 'Select Presentations'
    },
    'rise-data-rss': {
      type: 'rise-data-rss',
      icon: 'rss',
      title: 'RSS'
    },
    'rise-schedules': {
      type: 'rise-schedules',
      icon: 'schedule',
      title: 'Schedules'
    },
    'rise-slides': {
      type: 'rise-slides',
      icon: 'slides',
      title: 'Google Slides',
      visual: true,
      defaultAttributes: {
        src: ''
      }
    },
    'rise-storage-selector': {
      type: 'rise-storage-selector',
      icon: 'riseStorage',
      panel: '.storage-selector-container',
      title: 'Rise Storage',
    },
    'rise-text': {
      type: 'rise-text',
      icon: 'text',
      title: 'Text',
      visual: true,
      defaultAttributes: {
        fontsize: 100,
        multiline: true,
        verticalalign: 'middle',
        horizontalalign: 'center',
        textalign: 'center'
      }
    },
    'rise-time-date': {
      type: 'rise-time-date',
      icon: 'time',
      title: 'Time and Date'
    },
    'rise-data-twitter': {
      type: 'rise-data-twitter',
      icon: 'twitter',
      title: 'Twitter'
    },
    'rise-video': {
      type: 'rise-video',
      icon: 'video',
      panel: '.video-component-container',
      title: 'Video',
      playUntilDone: true,
      visual: true
    },
    'rise-data-weather': {
      type: 'rise-data-weather',
      icon: 'sun',
      title: 'Weather'
    }
  }

  static get COMPONENTS_ARRAY() {
    return _.values(ComponentsService.COMPONENTS_MAP);
  }

  static get PLAYLIST_COMPONENTS() {
    return _.filter(ComponentsService.COMPONENTS_ARRAY, {
      visual: true
    });
  }

  selected = null;
  showAttributeList = true;
  directives = {};
  pages = [];

  panelIcon;
  panelTitle;

  constructor(private templateEditorUtils: TemplateEditorUtilsService,
    private blueprintFactory: BlueprintService) {
      this.reset();
    }


    reset() {
      this.selected = null;
      this.showAttributeList = true;
      this.directives = {};
      this.pages = [];
    };

    registerDirective(directive) {
      if (!(directive.element instanceof jQuery)) {
        directive.element = $(directive.element);
      }

      directive.element.hide();
      this.directives[directive.type] = directive;

      _.defaults(directive, ComponentsService.COMPONENTS_MAP[directive.type], {
        panel: '.attribute-editor-component'
      });

      if (directive.onPresentationOpen) {
        directive.onPresentationOpen();
      }
    };

    _getDirective(component) {
      if (!component) {
        return null;
      } else if (component.directive) {
        return component.directive;
      } else if (this.directives[component.type]) {
        return this.directives[component.type];
      } else {
        return null;
      }
    };

    _getSelectedDirective() {
      var component = this.selected;

      return this._getDirective(component);
    };

    editComponent(component?) {
      var directive = this._getDirective(component);

      this.selected = component;

      this.showNextPage(component);

      if (directive && directive.show) {
        directive.show();
      }

      this._showAttributeList(false);
    };

    onBackButton() {
      this.highlightComponent(null);

      var directive = this._getSelectedDirective();

      if (!directive || !directive.onBackHandler || !directive.onBackHandler()) {
        this.showPreviousPage();
      }
    };

    // Private
    backToList() {
      var directive = this._getSelectedDirective();

      if (directive && directive.element) {
        directive.element.hide();              
      }

      this.resetPanelHeader();

      this.selected = null;
      this.pages = [];

      this._showAttributeList(true);
    };

    getComponentIcon(component?) {
      var directive = this._getDirective(component);

      return directive ? directive.icon : '';
    };

    getComponentTitle(component?) {
      var directive = this._getDirective(component);

      if (this.panelTitle) {
        return this.panelTitle;
      } else if (component && component.label) {
        return component.label;
      } else if (directive && directive.title) {
        return directive.title;
      } else {
        return '';
      }
    };

    getComponentName(component) {
      var directive = this._getDirective(component);

      if (directive && directive.getName) {
        return directive.getName(component.id) || directive.title;
      } else if (directive) {
        return directive.title;
      } else {
        return '';
      }
    };

    highlightComponent(componentId) {
      var message = {
        type: 'highlightComponent',
        value: componentId
      };
      var iframe = window.document.getElementById('template-editor-preview') as HTMLIFrameElement;
      iframe.contentWindow.postMessage(JSON.stringify(message), TemplateEditorService.HTML_TEMPLATE_DOMAIN);
    };

    isHeaderBottomRuleVisible(component) {
      var directive = this._getDirective(component);

      return directive && directive.isHeaderBottomRuleVisible ?
        directive.isHeaderBottomRuleVisible() : true;
    };

    getCurrentPage() {
      return this.pages.length > 0 ? this.pages[this.pages.length - 1] : null;
    };

    showNextPage(newPage) {
      var currentPage = this.getCurrentPage();

      this.pages.push(newPage);
      this._swapToLeft(currentPage, newPage);
    };

    showPreviousPage() {
      var currentPage = this.pages.length > 0 ? this.pages.pop() : null;
      var previousPage = this.getCurrentPage();

      if (!previousPage) {
        this.backToList();
      } else {
        this.selected = previousPage;

        this._swapToRight(currentPage, previousPage);
      }
    };

    resetPanelHeader() {
      this.setPanelIcon(null);
      this.setPanelTitle(null);
    };

    setPanelIcon(panelIcon) {
      this.panelIcon = panelIcon;
    };

    setPanelTitle(panelTitle) {
      this.panelTitle = panelTitle;
    };

    editHighlightedComponent(componentId) {
      var component = _.find(this.blueprintFactory.blueprintData.components, (element) => {
        return element.id === componentId;
      });
      if (component) {
        if (this.selected) {
          this.backToList();
        }
        this.editComponent(component);
      }
    };

    _showAttributeList(value) {
        this.showAttributeList = value;
    }

    _removeAnimationClasses(element) {
      element.removeClass('attribute-editor-show-from-right');
      element.removeClass('attribute-editor-show-from-left');
    }

    _showElement(component, direction, delay?) {
      var directive = this._getDirective(component);
      var element = directive && directive.panel && this.templateEditorUtils.findElement(directive.panel, directive.element);

      if (directive && directive.element) {
        directive.element.show();
      }

      if (!element) {
        return;
      }

      this._removeAnimationClasses(element);
      element.addClass('attribute-editor-show-from-' + direction);

      setTimeout( () => {
        element.show();
      }, delay || 0);
    }

    _hideElement(component, delay?) {
      var directive = this._getDirective(component);
      var selectedDirective = this._getSelectedDirective();

      var element = directive && directive.panel && this.templateEditorUtils.findElement(directive.panel, directive.element);

      if (directive && directive.element && !directive.element.is(selectedDirective.element)) {
        directive.element.hide();
      }

      if (!element) {
        return;
      }

      setTimeout( () => {
        element.hide();
      }, delay || 0);
    }

    _swapToLeft(swappedOutSelector, swappedInSelector) {
      this._showElement(swappedInSelector, 'right');
      this._hideElement(swappedOutSelector);
    }

    _swapToRight(swappedOutSelector, swappedInSelector) {
      this._showElement(swappedInSelector, 'left');
      this._hideElement(swappedOutSelector);
    }

}


angular.module('risevision.template-editor.services')
  .factory('componentsFactory', downgradeInjectable(ComponentsService))
  .factory('PLAYLIST_COMPONENTS', [() => {
      return ComponentsService.PLAYLIST_COMPONENTS;
    }
  ]);
