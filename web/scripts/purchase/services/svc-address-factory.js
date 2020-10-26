'use strict';

angular.module('risevision.apps.purchase')
  .service('addressFactory', ['$q', '$log', 'userState', 'storeService', 'updateCompany', 'updateUser',
    'addressService', 'contactService', 'confirmModal',
    function ($q, $log, userState, storeService, updateCompany, updateUser, addressService, contactService,
      confirmModal) {
      var factory = {};

      var _addressesAreIdentical = function (src, result) {
        var dest = {
          // Use Current Name for Comparison
          name: src.name,
          street: result.line1,
          unit: result.line2 && result.line2.length ? result.line2 : '',
          city: result.city,
          postalCode: result.postalCode,
          province: result.region,
          country: result.country
        };

        return addressService.addressesAreIdentical(src, dest);
      };

      factory.validateAddress = function (addressObject) {
        addressObject.validationError = false;

        if (addressObject.country !== 'CA' && addressObject.country !== 'US') {
          $log.debug('Address Validation skipped for country: ', addressObject.country);

          return $q.resolve();
        } else {
          return storeService.validateAddress(addressObject)
            .then(function (result) {
              if (!_addressesAreIdentical(addressObject, result)) {
                $log.error('Validated address differs from entered address: ', addressObject, result);
              }
            })
            .catch(function (result) {
              addressObject.validationError = result.message ? result.message : 'Unknown Error';
            });
        }
      };

      factory.isValidOrEmptyAddress = function (addressObject) {
        if (addressService.isEmptyAddress(addressObject)) {
          $log.debug('Address is empty, skipped validation');
          return $q.resolve();
        }
        if (addressObject.country !== 'CA' && addressObject.country !== 'US' && addressObject.country !== '') {
          $log.debug('Address Validation skipped for country: ', addressObject.country);
          return $q.resolve();
        }
        return storeService.validateAddress(addressObject);
      };

      factory.validateAddressIfChanged = function (addressForm, addressObject) {
        if (addressService.isAddressFormDirty(addressForm)) {
          return factory.isValidOrEmptyAddress(addressObject);
        } else {
          return $q.resolve();
        }
      };

      var _updateCompanySettings = function (company) {
        // update Selected company saved in userState
        var selectedCompany = userState.getCopyOfSelectedCompany(true);
        angular.extend(selectedCompany, company);

        // this will fire 'risevision.company.updated' event
        userState.updateCompanySettings(selectedCompany);
      };

      factory.updateAddress = function (addressObject, contact) {
        var deferred = $q.defer();
        var currentAddress = userState.getCopyOfSelectedCompany();

        var addressFields = {};
        var requiresUpdate = false;

        var billingContactEmails = currentAddress.billingContactEmails || [];
        var email = contact && contact.email;

        if (email && billingContactEmails.indexOf(email) === -1) {
          billingContactEmails.unshift(email);

          addressFields.billingContactEmails = billingContactEmails;

          requiresUpdate = true;
        }

        if (addressObject && !addressService.addressesAreIdentical(addressObject, currentAddress) ||
          requiresUpdate) {
          addressService.copyAddress(addressObject, addressFields);
          // Update shipping address for consistency
          addressService.copyAddressToShipTo(addressObject, addressFields);

          $log.info('Company Fields changed. Saving...');

          updateCompany(addressFields.id, addressFields)
            .then(function () {
              _updateCompanySettings(addressFields);

              $log.info('Company Fields saved.');

              deferred.resolve();
            })
            .catch(function () {
              $log.info('Error saving Company Fields.');
              deferred.reject('Error saving Company Fields.');
            });
        } else {
          deferred.resolve();
        }

        return deferred.promise;
      };

      factory.updateContact = function (contact) {
        var deferred = $q.defer();
        var currentContact = userState.getCopyOfProfile();

        if (contact && !contactService.contactsAreIdentical(contact, currentContact)) {
          $log.info('Contact information changed. Saving...');

          updateUser(userState.getUsername(), contact)
            .then(function () {
              var profileCopyNoFollow = userState.getCopyOfProfile(true);
              contactService.copyContactObj(contact, profileCopyNoFollow);

              // this fires 'risevision.company.updated' event
              userState.updateUserProfile(profileCopyNoFollow);

              $log.info('Contact information saved.');
              deferred.resolve();
            })
            .catch(function () {
              $log.info('Error saving Contact information.');
              deferred.reject('Error saving Contact information.');
            });
        } else {
          deferred.resolve();
        }

        return deferred.promise;
      };

      factory.confirmAndSetGeneralDelivery = function (addressObject) {
        return confirmModal('Address Information',
            'The address you provided couldn\'t be validated. This can happen if the address does not exist in the USPS records. If you\'re sure the address is correct you can specify this address as General Delivery and we\'ll only validate the City, State and Zip Code.<br/>Would you like to specify this address as General Delivery?',
            'Yes',
            'Cancel',
            'general-delivery-modal')
          .then(function () {
            addressObject.unit = addressObject.unit ? addressObject.unit + ' - General Delivery' :
              'General Delivery';
          });
      };

      return factory;
    }
  ]);
