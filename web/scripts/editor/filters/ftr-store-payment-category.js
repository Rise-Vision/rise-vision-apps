'use strict';

// Store paymentTerms Filter
angular.module('risevision.editor.filters')
  .filter('storePaymentCategory', [function () {
    return function (items, category) {
      var filtered = [];
      if (!category || category === 'all') {
        return items;
      }

      angular.forEach(items, function (item) {
        if ((category === 'free' &&
            item.paymentTerms.toLowerCase() === 'free') ||
          (category !== 'free' &&
            item.paymentTerms.toLowerCase() !== 'free')) {
          filtered.push(item);
        }
      });
      return filtered;
    };
  }]);
