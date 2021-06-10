import { Injectable } from '@angular/core';
import { StoreService, UserState } from 'src/app/ajs-upgraded-providers';
import * as angular from 'angular';
import { downgradeInjectable } from '@angular/upgrade/static';

@Injectable({
  providedIn: 'root'
})
export class TaxExemptionService {

  public loading;
  public taxExemption;

  constructor(private userState: UserState, private storeService: StoreService) { }

  init(submitCallback?) {
    this.loading = false;
    this.taxExemption = {
      callback: submitCallback
    };
  };

  submitTaxExemption() {
    this.taxExemption.error = null;

    this.loading = true;

    return this.storeService.uploadTaxExemptionCertificate(this.taxExemption.file)
      .then((blobKey) => {
        return this.storeService.addTaxExemption(this.userState.getSelectedCompanyId(), this.taxExemption,
          blobKey);
      })
      .then(() => {
        this.taxExemption.sent = true;

        if (this.taxExemption.callback) {
          this.taxExemption.callback();
        }
      })
      .catch((error) => {
        this.taxExemption.error = error.message || 'Something went wrong. Please try again.';
      })
      .finally(() => {
        this.loading = false;
      });
  };
}


angular.module('risevision.apps.purchase')
  .factory('taxExemptionFactory', downgradeInjectable(TaxExemptionService));