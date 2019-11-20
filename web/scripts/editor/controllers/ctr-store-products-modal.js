'use strict';
angular.module('risevision.editor.controllers')
  .controller('storeProductsModal', ['$scope', '$loading', '$filter', '$modal', '$modalInstance',
    'ScrollingListService', 'productsFactory', 'playlistItemFactory', 'widgetUtils', 'checkTemplateAccess',
    'plansFactory', 'playerLicenseFactory', 'category', 'TEMPLATES_TYPE', 'userState',
    function ($scope, $loading, $filter, $modal, $modalInstance,
      ScrollingListService, productsFactory, playlistItemFactory, widgetUtils, checkTemplateAccess,
      plansFactory, playerLicenseFactory, category, TEMPLATES_TYPE, userState) {
      var defaultCount = 1000;

      $scope.playerLicenseFactory = playerLicenseFactory;
      $scope.showPlansModal = plansFactory.showPlansModal;
      $scope.isEducationCustomer = userState.isEducationCustomer();

      $scope.search = {
        category: category,
        count: defaultCount
      };

      $scope.professionalWidgets = widgetUtils.getProfessionalWidgets();

      $scope.factory = new ScrollingListService(productsFactory.loadProducts,
        $scope.search);

      $scope.filterConfig = {
        placeholder: $filter('translate')(
          'editor-app.storeProduct.' + (category === TEMPLATES_TYPE ?
            'templates' : 'content') + '.search'),
        id: 'storeProductsSearchInput'
      };

      $scope.$watch('factory.loadingItems', function (loading) {
        if (loading) {
          $loading.start('product-list-loader');
        } else {
          $loading.stop('product-list-loader');
        }
      });

      $scope.select = function (product) {
        if (category === TEMPLATES_TYPE) {
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
        } else {
          $modalInstance.close(product);
        }
      };

      $scope.quickSelect = function (product) {
        if (category === TEMPLATES_TYPE) {
          return checkTemplateAccess(product.productCode)
            .then(function () {
              $modalInstance.close(product);
            })
            .catch(function () {
              $scope.select(product);
            });
        } else {
          $modalInstance.close(product);
        }
      };

      $scope.addWidgetByUrl = function () {
        $modalInstance.dismiss();
        playlistItemFactory.addWidgetByUrl();
      };

      $scope.dismiss = function () {
        $modalInstance.dismiss();
      };
    }
  ]);
