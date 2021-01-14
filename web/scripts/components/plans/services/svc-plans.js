(function (angular) {

  'use strict';
  angular.module('risevision.common.components.plans')
    .value('PLANS_LIST', [{
      name: 'Free',
      type: 'free',
      order: 0,
      productId: '000',
      productCode: '000',
      status: 'Active',
      proLicenseCount: 0,
      monthly: {
        priceDisplayMonth: 0,
        billAmount: 0,
        save: 0
      },
      yearly: {
        priceDisplayMonth: 0,
        priceDisplayYear: 0,
        billAmount: 0,
        save: 0
      }
    }, {
      name: 'Display Licenses',
      type: 'volume',
      order: 1,
      productId: '2317',
      productCode: '34e8b511c4cc4c2affa68205cd1faaab427657dc',
      proLicenseCount: 3,
      monthly: {
        priceDisplayMonth: 10,
        billAmount: 10,
        save: 0
      },
      yearly: {
        priceDisplayMonth: 10,
        priceDisplayYear: 110,
        billAmount: 110,
        save: 10
      },
      trialPeriod: 14,
      discountIndustries: [
        'PRIMARY_SECONDARY_EDUCATION',
        'HIGHER_EDUCATION',
        'LIBRARIES',
        'PHILANTHROPY',
        'NON_PROFIT_ORGANIZATION_MANAGEMENT',
        'RELIGIOUS_INSTITUTIONS'
      ]
    }, {
      name: 'Display Licenses for Education',
      // cannot use type 'volume', it may interfere with the other plan
      type: 'volume for education',
      order: 1,
      productId: '2320',
      productCode: '88725121a2c7a57deefcf06688ffc8e84cc4f93b',
      proLicenseCount: 3,
      monthly: {
        priceDisplayMonth: 10,
        billAmount: 10,
        save: 0
      },
      yearly: {
        priceDisplayMonth: 10,
        priceDisplayYear: 110,
        billAmount: 110,
        save: 10
      },
      trialPeriod: 14,
      discountIndustries: [
        'PRIMARY_SECONDARY_EDUCATION',
        'HIGHER_EDUCATION',
        'LIBRARIES',
        'PHILANTHROPY',
        'NON_PROFIT_ORGANIZATION_MANAGEMENT',
        'RELIGIOUS_INSTITUTIONS'
      ]
    }, {
      name: 'Starter',
      type: 'starter',
      order: 1,
      productId: '335',
      productCode: '019137f7bb35f5f90085a033c013672471faadae',
      proLicenseCount: 1,
      monthly: {
        priceDisplayMonth: 10,
        billAmount: 10,
        save: 0
      },
      yearly: {
        priceDisplayMonth: 10,
        priceDisplayYear: 110,
        billAmount: 110,
        save: 10
      },
      trialPeriod: 14
    }, {
      name: 'Basic',
      type: 'basic',
      order: 2,
      productId: '289',
      productCode: '40c092161f547f8f72c9f173cd8eebcb9ca5dd25',
      proLicenseCount: 3,
      monthly: {
        priceDisplayMonth: 9,
        billAmount: 27,
        save: 36
      },
      yearly: {
        priceDisplayMonth: 9,
        priceDisplayYear: 99,
        billAmount: 297,
        save: 63
      },
      trialPeriod: 14
    }, {
      name: 'Advanced',
      type: 'advanced',
      order: 3,
      productId: '290',
      productCode: '93b5595f0d7e4c04a3baba1102ffaecb17607bf4',
      proLicenseCount: 11,
      monthly: {
        priceDisplayMonth: 8,
        billAmount: 88,
        save: 264
      },
      yearly: {
        priceDisplayMonth: 8,
        priceDisplayYear: 88,
        billAmount: 968,
        save: 352
      },
      trialPeriod: 14
    }, {
      name: 'Enterprise',
      type: 'enterprise',
      order: 4,
      productId: '301',
      productCode: 'b1844725d63fde197f5125b58b6cba6260ee7a57',
      proLicenseCount: 70,
      monthly: {
        priceDisplayMonth: 7,
        billAmount: 490,
        save: 2520
      },
      yearly: {
        priceDisplayMonth: 7,
        priceDisplayYear: 77,
        billAmount: 5390,
        save: 3010
      }
    }, {
      name: 'Enterprise',
      type: 'enterprisesub',
      order: 5,
      productId: '303',
      productCode: 'd521f5bfbc1eef109481eebb79831e11c7804ad8',
      proLicenseCount: 0
    }, {
      name: 'Basic Financial MarketWall',
      productCode: '0dbb19f8394612730c2673b092d811e46413b132'
    }, {
      name: 'Premium Financial MarketWall',
      productCode: '0c583c663655c246c3e7b3c1be0ec05a442211aa'
    }, {
      name: 'Financial Data License',
      productCode: '356ab5e0541a41e96e4ef0b45ecac9f72af454ac',
      // cannot use type 'volume', it may interfere with the other plan
      type: 'volume for financial',
    }])
    .factory('plansService', ['PLANS_LIST',
      function (PLANS_LIST) {
        var _factory = {};

        _factory.getPlan = function (productCode) {
          var plan = _.find(PLANS_LIST, function (plan) {
            return plan.productCode === productCode;
          });

          return plan;
        };

        _factory.getFreePlan = function () {
          return _.find(PLANS_LIST, {
            type: 'free'
          });
        };

        _factory.getVolumePlan = function () {
          return _.find(PLANS_LIST, {
            type: 'volume'
          });
        };

        _factory.isVolumePlan = function (plan) {
          return plan && plan.type && plan.type.indexOf('volume') !== -1;
        };

        return _factory;
      }
    ]);

})(angular);
