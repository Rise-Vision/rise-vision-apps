import { Component, ElementRef } from '@angular/core';

import * as angular from 'angular';
import { downgradeComponent } from '@angular/upgrade/static';

import { ComponentsService } from '../../services/components.service';
import { AttributeDataService } from '../../services/attribute-data.service';
import { WorldTimezonesService } from '../services/world-timezones.service';

@Component({
  selector: 'template-component-time-date',
  templateUrl: './time-date.component.html',
  styleUrls: ['./time-date.component.scss']
})
export class TimeDateComponent {
  private DATE_FORMATS = ['MMMM DD, YYYY', 'MMM DD YYYY', 'MM/DD/YYYY', 'DD/MM/YYYY'];

  public dateFormats = this.DATE_FORMATS.map(format => {
    return {
      format: format,
      date: window.moment().format(format)
    };
  });

  public WORLD_TIMEZONES = WorldTimezonesService.WORLD_TIMEZONES;

  public componentId: string;
  public defaultType: string;
  public type: string;
  public timezoneType: string;
  public timezone: string;
  public timeFormat: string;
  public dateFormat: string;

  constructor(private elementRef: ElementRef,
    private componentsFactory: ComponentsService,
    private attributeDataFactory: AttributeDataService) {

    this.componentsFactory.registerDirective({
      type: 'rise-time-date',
      element: this.elementRef.nativeElement,
      show: () => {
        this.componentId = componentsFactory.selected.id;
        this.load();
      },
      getTitle: component => {
        return 'template.rise-time-date' + '-' + component.attributes.type.value;
      }
    });

  }

  load() {
    var defaultType = this.attributeDataFactory.getBlueprintData(this.componentId, 'type');
    var type = this.attributeDataFactory.getAvailableAttributeData(this.componentId, 'type');
    var timeFormat = this.attributeDataFactory.getAvailableAttributeData(this.componentId, 'time');
    var dateFormat = this.attributeDataFactory.getAvailableAttributeData(this.componentId, 'date');
    var timezone = this.attributeDataFactory.getAvailableAttributeData(this.componentId, 'timezone');
    var timeFormatVal = timeFormat || 'Hours12';
    var dateFormatVal = dateFormat || this.dateFormats[0].format;

    this.defaultType = defaultType;
    this.type = type;
    this.timezoneType = !timezone ? 'DisplayTz' : 'SpecificTz';
    this.timezone = timezone;

    if (this.type === 'time') {
      this.timeFormat = timeFormatVal;
    }

    if (this.type === 'date') {
      this.dateFormat = dateFormatVal;
    }

    if (this.type === 'timedate') {
      this.timeFormat = timeFormatVal;
      this.dateFormat = dateFormatVal;
    }
  };

  save() {
    if (this.timezoneType === 'DisplayTz' || !this.timezone) {
      this.timezone = null;
    }

    if (!this.defaultType) {
      this.attributeDataFactory.setAttributeData(this.componentId, 'type', this.type);
    }

    if (this.type === 'timedate') {
      this.attributeDataFactory.setAttributeData(this.componentId, 'time', this.timeFormat);
      this.attributeDataFactory.setAttributeData(this.componentId, 'date', this.dateFormat);
    } else if (this.type === 'time') {
      this.attributeDataFactory.setAttributeData(this.componentId, 'time', this.timeFormat);
    } else if (this.type === 'date') {
      this.attributeDataFactory.setAttributeData(this.componentId, 'date', this.dateFormat);
    }

    this.attributeDataFactory.setAttributeData(this.componentId, 'timezone', this.timezone);
  };

}

angular.module('risevision.template-editor.directives')
  .directive(
    'templateComponentTimeDate', 
    downgradeComponent({
      component: TimeDateComponent
    }) as angular.IDirectiveFactory
  );
