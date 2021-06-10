import { Injectable } from '@angular/core';
import { UserState } from 'src/app/ajs-upgraded-providers';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StripeLoaderService {

  private static STRIPE_PROD_KEY = 'pk_live_31dWkTWQU125m2RcWpK4HQBR';
  private static STRIPE_TEST_KEY = 'pk_test_GrMIAHSoqhaik4tcHepsxjOR';

  private _promise: Promise<any>;

  constructor(private userState: UserState) { }

  load() {
    if (this._promise) {
      return this._promise;
    }
    this._promise = new Promise<any>((resolve, reject) => {
      var isTest = !environment.production || this.userState.getCopyOfUserCompany().isTest;

      var checkInterval = setInterval(function () {
        if (window.Stripe) {
          clearInterval(checkInterval);

          resolve(window.Stripe(isTest ? StripeLoaderService.STRIPE_TEST_KEY : StripeLoaderService.STRIPE_PROD_KEY));
        }
      }, 50);
    });
    return this._promise;
  }
}
