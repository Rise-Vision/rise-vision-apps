'use strict';
angular.module('risevision.editor.controllers')
  .controller('storeTemplatesModal', ['$scope', '$loading', '$filter', '$modal', '$modalInstance',
    'userState', 'ScrollingListService', 'productsFactory', 'templateCategoryFilter',
    function ($scope, $loading, $filter, $modal, $modalInstance,
      userState, ScrollingListService, productsFactory, templateCategoryFilter) {
      var defaultCount = 1000;

      $scope.isEducationCustomer = userState.isEducationCustomer();

      $scope.search = {
        category: 'Templates',
        count: defaultCount,
        doSearch: function() {}
      };

      $scope.factory = new ScrollingListService(productsFactory.loadProducts,
        $scope.search);

      $scope.filterConfig = {
        placeholder: $filter('translate')(
          'editor-app.storeProduct.templates.search'),
        id: 'storeProductsSearchInput'
      };

      $scope.getTemplatesFilter = function () {
        var filter = {};

        if ($scope.search.templatesFilter) {
          var values = $scope.search.templatesFilter.split('|');
          filter[values[0]] = values[1];
        }

        return filter;
      };

      var _updateProductFilters = function () {
        if (!$scope.categoryFilters && $scope.factory.items.list.length) {
          $scope.categoryFilters = {
            templateCategories: templateCategoryFilter($scope.factory.items.list, 'templateCategories'),
            templateLocations: templateCategoryFilter($scope.factory.items.list, 'templateLocations'),
            templateContentTypes: templateCategoryFilter($scope.factory.items.list, 'templateContentTypes')
          };
        }
      };

      $scope.$watch('factory.loadingItems', function (loading) {
        if (loading) {
          $loading.start('product-list-loader');
        } else {
          $loading.stop('product-list-loader');

          _updateProductFilters();
        }
      });

      $scope.select = function (product) {
        var productDetailsModal = $modal.open({
          templateUrl: 'partials/editor/product-details-modal.html',
          size: 'lg',
          windowClass: 'product-preview-modal',
          controller: 'ProductDetailsModalController',
          resolve: {
            product: function () {
              return product;
            }
          }
        });
        productDetailsModal.result.then(function () {
          $modalInstance.close(product);
        });
      };

      $scope.quickSelect = function (product) {
        $modalInstance.close(product);
      };

      $scope.dismiss = function () {
        $modalInstance.dismiss();
      };
    }
  ]);
