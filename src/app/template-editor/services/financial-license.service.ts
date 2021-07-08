import { Injectable } from '@angular/core';

import { BlueprintService } from './blueprint.service';
import { ModalService } from 'src/app/components/modals/modal.service';

import * as _ from 'lodash';
import * as angular from 'angular';
import { downgradeInjectable } from '@angular/upgrade/static';

@Injectable({
  providedIn: 'root'
})
export class FinancialLicenseService {
  private NEED_FINANCIAL_DATA_LICENSE = ['rise-data-financial'];
  private CONTACT_US_URL = 'https://www.risevision.com/contact-us?form_selected=sales&content_hide=true';

  constructor(private modalService: ModalService,
    private blueprintFactory: BlueprintService) { }

  needsFinancialDataLicense() {
    const that = this;
    if (!this.blueprintFactory.blueprintData) {
      return false;
    }

    return _.some(this.blueprintFactory.blueprintData.components, function (component) {
      return _.includes(that.NEED_FINANCIAL_DATA_LICENSE, component.type);
    });
  }

  showFinancialDataLicenseRequiredMessage() {
    const that = this;

    this.modalService.confirm('Financial Data License Required',
      'This Presentation requires a Financial Data License to show on your Display(s). Contact <a href="mailto:sales@risevision.com">sales@risevision.com</a> for a 30 day free trial.',
      'Get a 30 Day Free Trial', 
      'Close'
    ).then(function () {
      window.open(that.CONTACT_US_URL, '_blank');
    });
  }

}

angular.module('risevision.template-editor.services')
  .factory('financialLicenseFactory', downgradeInjectable(FinancialLicenseService));
