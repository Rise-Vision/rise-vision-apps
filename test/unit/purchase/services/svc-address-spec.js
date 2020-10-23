/*jshint expr:true */
"use strict";

describe("Services: address service", function() {
  beforeEach(module("risevision.apps.purchase"));

  var addressService, validAddress;

  beforeEach(function() {
    validAddress = {
      id: "id",
      name: "dummy Name",
      street: "dummy Street",
      unit: "dummy unit",
      city: "dummy city",
      province: "dummy province",
      country: "dummy country",
      postalCode: "dummy code"
    };

    inject(function($injector) {
      addressService = $injector.get("addressService");
    });
  });

  it("should exist", function() {
    expect(addressService).to.be.ok;
    expect(addressService.copyAddress).to.be.a("function");
    expect(addressService.copyAddressFromShipTo).to.be.a("function");
    expect(addressService.copyAddressToShipTo).to.be.a("function");
    expect(addressService.addressesAreIdentical).to.be.a("function");
  });

  it("copyAddress: ", function() {
    var address = angular.copy(validAddress);
    address.junkProperty = "junkValue";
    var newAddress = {};
    addressService.copyAddress(address, newAddress);

    expect(newAddress).to.deep.equal(validAddress);
  });

  it("copyAddressToShipTo: ", function() {
    var address = validAddress;
    address.junkProperty = "junkValue";
    var newAddress = {};
    addressService.copyAddressToShipTo(address, newAddress);

    expect(newAddress.id).to.equal(address.id);
    expect(newAddress.shipToName).to.equal(address.name);

    expect(newAddress.shipToStreet).to.equal(address.street);
    expect(newAddress.shipToUnit).to.equal(address.unit);
    expect(newAddress.shipToCity).to.equal(address.city);
    expect(newAddress.shipToCountry).to.equal(address.country);
    expect(newAddress.shipToPostalCode).to.equal(address.postalCode);
    expect(newAddress.shipToProvince).to.equal(address.province);

    expect(newAddress.junkProperty).to.not.be.ok;
  });

  it("copyAddressFromShipTo: ", function() {
    var address = validAddress;
    // address -> shipTo
    var shipToAddress1 = addressService.copyAddressToShipTo(address);
    shipToAddress1.junkProperty = "junkValue";

    // shipTo -> address
    var newAddress = addressService.copyAddressFromShipTo(shipToAddress1);

    expect(newAddress).to.deep.equal(validAddress);
  });

  describe("addressesAreIdentical: ", function() {
    it("should find two equal addresses to be identical", function() {
      var address = validAddress;

      expect(addressService.addressesAreIdentical(address, angular.copy(address))).to.equal(true);
    });

    it("should find two unequal addresses to NOT be identical", function() {
      var address = validAddress;
      var changedAddress = angular.copy(address);
      changedAddress.street += "(\/) (°,,,°) (\/)";

      expect(addressService.addressesAreIdentical(address, angular.copy(changedAddress))).to.equal(false);
    });
    
  });

  describe("isEmptyAddress:",function() {
    it("should return true on empty address variations",function(){
      expect(addressService.isEmptyAddress()).to.be.true;
      expect(addressService.isEmptyAddress({})).to.be.true;
      expect(addressService.isEmptyAddress({
        street: "",
        unit: "",
        city: "",
        country: "",
        postalCode: "",
        province: ""
      }
      )).to.be.true;
      expect(addressService.isEmptyAddress({
        country: "",
        postalCode: "",
        province: ""
      }
      )).to.be.true;
      expect(addressService.isEmptyAddress({
        street: "",
        unit: null,
        city: "",
        country: "",
        postalCode: null,
        province: ""
      }
      )).to.be.true;
    });

    it("should return false when address is not empty",function(){
      expect(addressService.isEmptyAddress({
        street: "515 King St W",
        unit: "",
        city: "Toronto",
        country: "CA",
        postalCode: "M5V 3M4",
        province: "ON"
      })).to.be.false;
      expect(addressService.isEmptyAddress({
        street: "515 King St W"
      })).to.be.false;
      expect(addressService.isEmptyAddress({
        country: "CA"        
      })).to.be.false;
      expect(addressService.isEmptyAddress({
        country: "CA",
        postalCode: "M5V 3M4"
      })).to.be.false;
    });

  });

  describe("isAddressFormDirty:", function() {
    it("should return false if fields are unchanged", function() {
      expect(addressService.isAddressFormDirty(null)).to.be.false;

      var addressForm = {};
      expect(addressService.isAddressFormDirty(addressForm)).to.be.false;

      addressForm.city = {};
      expect(addressService.isAddressFormDirty(addressForm)).to.be.false;

      addressForm.city.$dirty = false;
      expect(addressService.isAddressFormDirty(addressForm)).to.be.false;

      addressForm.country = {};
      expect(addressService.isAddressFormDirty(addressForm)).to.be.false;

      addressForm.country.$dirty = false;
      expect(addressService.isAddressFormDirty(addressForm)).to.be.false;
    });

    it("should flag dirty fields", function() {
      var addressForm = { city: { $dirty: true } };      
      expect(addressService.isAddressFormDirty(addressForm)).to.be.true;

      addressForm = { city: { $dirty: true }, country: { $dirty: false } };
      expect(addressService.isAddressFormDirty(addressForm)).to.be.true;

      addressForm = { street: { $dirty: true }, country: { $dirty: false }, postalCode: { $dirty: true }};
      expect(addressService.isAddressFormDirty(addressForm)).to.be.true;
    });

    
  });

});
