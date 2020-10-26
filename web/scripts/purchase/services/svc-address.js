'use strict';

angular.module('risevision.apps.purchase')
  .service('addressService', [

    function () {
      this.copyAddress = function (src, dest) {
        if (!dest) {
          dest = {};
        }

        dest.id = src.id;
        dest.name = src.name;

        dest.street = src.street;
        dest.unit = src.unit;
        dest.city = src.city;
        dest.country = src.country;
        dest.postalCode = src.postalCode;
        dest.province = src.province;

        return dest;
      };

      this.copyAddressFromShipTo = function (src, dest) {
        // Do not copy shipToUseCompanyAddress.
        // It should not be updated from the Cart.

        if (!dest) {
          dest = {};
        }

        dest.id = src.id;
        dest.name = src.shipToName;

        dest.street = src.shipToStreet;
        dest.unit = src.shipToUnit;
        dest.city = src.shipToCity;
        dest.country = src.shipToCountry;
        dest.postalCode = src.shipToPostalCode;
        dest.province = src.shipToProvince;

        return dest;
      };

      this.copyAddressToShipTo = function (src, dest) {
        // Do not copy shipToUseCompanyAddress.
        // It should not be updated from the Cart.

        if (!dest) {
          dest = {};
        }

        dest.id = src.id;
        dest.shipToName = src.name;

        dest.shipToStreet = src.street;
        dest.shipToUnit = src.unit;
        dest.shipToCity = src.city;
        dest.shipToCountry = src.country;
        dest.shipToPostalCode = src.postalCode;
        dest.shipToProvince = src.province;

        return dest;
      };

      this.addressesAreIdentical = function (src, dest) {
        if (dest.name === src.name &&
          dest.street === src.street &&
          dest.unit === src.unit &&
          dest.city === src.city &&
          dest.country === src.country &&
          dest.postalCode === src.postalCode &&
          dest.province === src.province) {
          return true;
        }
        return false;
      };

      this.isEmptyAddress = function (addressObject) {
        if (!addressObject) {
          return true;
        }
        return !addressObject.street &&
          !addressObject.unit &&
          !addressObject.city &&
          !addressObject.country &&
          !addressObject.postalCode &&
          !addressObject.province;
      };

      this.isAddressFormDirty = function (addressForm) {
        if (!addressForm) {
          return false;
        }
        var addressFields = ['street', 'unit', 'city', 'province', 'country', 'postalCode'];
        var isDirty = false;
        angular.forEach(addressFields, function (field) {
          if (addressForm[field] && addressForm[field].$dirty) {
            isDirty = true;
          }
        });
        return isDirty;
      };

    }
  ]);
