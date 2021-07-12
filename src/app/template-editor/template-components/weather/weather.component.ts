import { Component, ElementRef } from '@angular/core';

import * as angular from 'angular';
import { downgradeComponent } from '@angular/upgrade/static';
import { UserState, CompanySettingsFactory } from 'src/app/ajs-upgraded-providers';

import { ComponentsService } from '../../services/components.service';
import { AttributeDataService } from '../../services/attribute-data.service';

@Component({
  selector: 'template-component-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss']
})
export class WeatherComponent {

  public componentId: string;
  public scale: string;
  public canEditCompany: boolean;
  public hasValidAddress: boolean;

  constructor(private elementRef: ElementRef,
    private userState: UserState,
    public companySettingsFactory: CompanySettingsFactory,
    private componentsFactory: ComponentsService,
    private attributeDataFactory: AttributeDataService) {
    this.canEditCompany =  this.userState.hasRole('ua');

    var company = this.userState.getCopyOfSelectedCompany(true);
    this.hasValidAddress = !!(company.postalCode || (company.city && company.country));

    this.componentsFactory.registerDirective({
      type: 'rise-data-weather',
      element: this.elementRef.nativeElement,
      show: () => {
        this.componentId = this.componentsFactory.selected.id;
        this._load();
      }
    });

  }

  _load() {
    var attributeDataValue = this.attributeDataFactory.getAttributeData(this.componentId, 'scale');
    if (attributeDataValue) {
      this.scale = attributeDataValue;
    } else {
      this.scale = this.attributeDataFactory.getBlueprintData(this.componentId, 'scale');
    }
  }

  save() {
    this.attributeDataFactory.setAttributeData(this.componentId, 'scale', this.scale);
  };

}

angular.module('risevision.template-editor.directives')
  .directive(
    'templateComponentWeather', 
    downgradeComponent({
      component: WeatherComponent
    }) as angular.IDirectiveFactory
  );
