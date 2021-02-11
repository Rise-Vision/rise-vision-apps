'use strict';

// Factory used specifically for instances where the component is running
// independently of Apps
angular.module('risevision.common.components.store-products')
  .factory('productsFactory', ['storeProduct',
    function (storeProduct) {
      return {
        loadProducts: storeProduct.list
      };
    }
  ]);
