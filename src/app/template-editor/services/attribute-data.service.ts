import { Injectable } from '@angular/core';
import { BlueprintFactory, TemplateEditorFactory } from 'src/app/ajs-upgraded-providers';
import * as angular from 'angular';
import * as _ from 'lodash';
import { downgradeInjectable } from '@angular/upgrade/static';

@Injectable({
  providedIn: 'root'
})
export class AttributeDataService {

  constructor(private blueprintFactory: BlueprintFactory, private templateEditorFactory: TemplateEditorFactory) {}

  getBlueprintData(componentId, attributeKey?) {
    return this.blueprintFactory.getBlueprintData(componentId, attributeKey);
  }

  getAttributeData(componentId, attributeKey?) {
    if (!componentId) {
      return null;
    }

    var component = this._componentFor(componentId, false);

    if (component.element && component.element.attributes) {
      return attributeKey ? component.element.attributes[attributeKey] : component.element.attributes;
    } else {
      // if the attributeKey is not provided, it returns the full component structure
      return attributeKey ? component[attributeKey] : component;
    }
  }

  getAvailableAttributeData(componentId, attributeName) {
    var result = this.getAttributeData(componentId, attributeName);

    if (angular.isUndefined(result)) {
      result = this.getBlueprintData(componentId, attributeName);
    }

    return result;
  }

  setAttributeData(componentId, attributeKey, value) {
    if (!componentId) {
      return null;
    }

    var component = this._componentFor(componentId, true);

    if (component.element) {
      if (!component.element.attributes) {
        component.element.attributes = {};
      }

      component.element.attributes[attributeKey] = value;
    } else {
      component[attributeKey] = value;
    }
  }

  getAttributeDataGlobal(attributeKey) {
    return this.templateEditorFactory.presentation.templateAttributeData[attributeKey];
  }

  setAttributeDataGlobal(attributeKey, value) {
    this.templateEditorFactory.presentation.templateAttributeData[attributeKey] = value;
  }

  // updateAttributeData: do not update the object on getAttributeData
  // or it will unnecessarily trigger hasUnsavedChanges = true
  _componentFor(componentId, updateAttributeData) {
    var attributeData = this.templateEditorFactory.presentation.templateAttributeData;
    var component;

    if (componentId.indexOf(' ') !== -1) {
      var tokens = componentId.split(' ');
      var playlistId = tokens[0];
      var playlist = this._componentFor(playlistId, updateAttributeData);

      return playlist.items[tokens[1]];
    } else if (attributeData.components) {
      component = _.find(attributeData.components, {
        id: componentId
      });
    } else if (updateAttributeData) {
      attributeData.components = [];
    }

    if (!component) {
      component = {
        id: componentId
      };

      if (updateAttributeData) {
        attributeData.components.push(component);
      }
    }

    return component;
  }

  getComponentIds(filter?) {
    var components = this.blueprintFactory.blueprintData.components;

    var filteredComponents = _.filter(components, filter);

    return _.map(filteredComponents, function (component: any) {
      return component.id;
    });
  }
}

angular.module('risevision.template-editor.services')
  .factory('attributeDataFactory2', downgradeInjectable(AttributeDataService));
