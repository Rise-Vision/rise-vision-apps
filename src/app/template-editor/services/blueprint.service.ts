import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { downgradeInjectable } from '@angular/upgrade/static';
import { environment } from 'src/environments/environment';
import * as angular from 'angular';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class BlueprintService {

  private _blueprints = {};

  public loadingBlueprint = false;
  public blueprintData;
  
  constructor(private $http: HttpClient) {     
  }

  getBlueprintCached(productCode, readOnly) {
    var blueprint = this._blueprints[productCode];

    if (blueprint) {
      if (!readOnly) {
        this.blueprintData = blueprint;
      }

      return Promise.resolve(blueprint);
    } else {
      return this._getBlueprint(productCode, readOnly);
    }
  }

  _getBlueprint(productCode, readOnly) {
    var url = environment.BLUEPRINT_URL.replace('PRODUCT_CODE', productCode);

    //show loading spinner
    this.loadingBlueprint = true;

    let self = this;
    return this.$http.get(url)
      .toPromise()
      .then(function (response :any) {
        if (!readOnly) {
          self.blueprintData = response;
        }

        self._blueprints[productCode] = response;

        return response;
      })
      .finally(function () {
        self.loadingBlueprint = false;
      });
  }

  isPlayUntilDone(productCode) {
    return this.getBlueprintCached(productCode, true)
      .then(function (result) {
        return !!(result && result.playUntilDone);
      });
  }

  hasBranding() {
    return (!!this.blueprintData && this.blueprintData.branding === true);
  }

  isRiseInit() {
    return (!!this.blueprintData && this.blueprintData.riseInit === true);
  }

  getBlueprintData(componentId, attributeKey) {
    var components = this.blueprintData.components;
    var component = _.find(components, {
      id: componentId
    });

    if (!component || !component.attributes) {
      return null;
    }

    var attributes = component.attributes;

    // if the attributeKey is not provided, it returns the full attributes structure
    if (!attributeKey) {
      return attributes;
    }

    var attribute = attributes[attributeKey];
    return attribute && attribute.value;
  }

  getLogoComponents() {
    var components = this.blueprintData.components;

    return _.filter(components, function (c) {
      return c.type === 'rise-image' && (c.attributes && c.attributes['is-logo'] && c
        .attributes['is-logo'].value === 'true');
    });
  }

  getHelpText(componentId) {
    var component = _.find(this.blueprintData.components, {
      id: componentId
    });
    return component && component.helpText;
  };
}

angular.module('risevision.template-editor.services')
  .factory('blueprintFactory', downgradeInjectable(BlueprintService));