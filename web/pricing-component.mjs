import {PolymerElement, html} from "@polymer/polymer/polymer-element.js"
import "pricing-data-component/lib/pricing-data-component.js"
import "pricing-selector-component/lib/pricing-selector-component.js"
import "pricing-summary-component/lib/pricing-summary-component.js"
import "pricing-grid-component/lib/pricing-grid-component.js"

class PricingComponent extends PolymerElement {
  static get properties() {
    return {
      pricingData: {type: Object, value: {}},
      displayCount: {type: Number, value: 5, notify: true},
      prodEnv: {type: Boolean, value: false},
      priceTotal: {type: Number, value: 0},
      period: {type: String, value: "yearly"},
      applyDiscount: {type: Boolean, value: false},
      dataLoading: {type: Boolean, computed: "isDataLoading(pricingData)"},
      dataLoaded: {type: Boolean, computed: "isDataLoaded(pricingData)"}
    };
  }

  isDataLoaded(pricingData) {return pricingData && Object.keys(pricingData).length && !pricingData.failed;}
  isDataLoading(pricingData) {return !pricingData || !Object.keys(pricingData).length;}

  static get template() {
    return html`
      <style>
        .component {
          width: 100%;
        }

        section.middle {
          display: flex;
          justify-content: space-between;
          margin-bottom: 1em;
        }

        section.middle pricing-selector-component {
          display: inline-block;
          width: 40%;
          vertical-align: top;
          border: solid 1px #979797;
          border-radius: 4px;
          box-sizing: border-box;
          padding: 1em;
        }

        section.middle pricing-grid-component {
          display: inline-block;
          width: 58%;
          vertical-align: top;
        }

        pricing-summary-component {
          display: block;
          border: solid 1px #979797;
          border-radius: 4px;
          padding: 0.5em;
          margin-bottom: 1em;
          box-sizing: border-box;
        }

        #billingHelp {
          display: block;
          font-size: 12px;
          text-align: right;
          color: #999999;
          margin: 1em 0 0.5em 0;
        }

        p.promo {
          text-align: center
        }

        span.promo {
          background-color: #FFE8AE;
        }

        h3.coupon {
          text-align: center;
          font-size: 24px;
          margin-top: 15px;
          margin-bottom: 15px;
        }
      </style>

      <section hidden$=[[!dataLoaded]]>
        <p class="promo"><strong>Special offer</strong>: digital signage can help keep people safe. To help make it accessible to everyone, <span class="promo">we're offering 50% off your first year</span> if you purchase an annual plan.</p>

        <h3 class="coupon"><span class="promo">Use the code SAVE50 at checkout</span>.</h3>

        <pricing-data-component prod-env=[[prodEnv]] pricing-data={{pricingData}}></pricing-data-component>

        <pricing-selector-component class="component"
          show-period-section
          pricing-data=[[pricingData]]
          display-count=[[displayCount]]
          period={{period}}>
        </pricing-selector-component>

        <div id="billingHelp">Price per Display, per month, billed [[period]]</div>

        <section class="middle">
          <pricing-selector-component class="component"
            show-display-count-section
            display-count={{displayCount}}>
          </pricing-selector-component>

          <pricing-grid-component class="component" 
            pricing-data=[[pricingData]]
            period=[[period]]
            tier-name={{tierName}}
            display-count=[[displayCount]]>
          </pricing-grid-component>
        </section>

        <pricing-summary-component class="component"
          pricing-data=[[pricingData]]
          price-total={{priceTotal}}
          display-count=[[displayCount]]
          period=[[period]]
          apply-discount=[[applyDiscount]]>
        </pricing-summary-component>
      </section>
      <section hidden$=[[!pricingData.failed]]>
        Failed load
      </section>
      <section hidden$=[[!dataLoading]]>
        Loading
      </section>
    `;
  }
}

window.customElements.define("pricing-component", PricingComponent);
console.log("Registered pricing component");
