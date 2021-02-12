/*jshint expr:true */
"use strict";

describe("Services: contact service", function() {
  beforeEach(module("risevision.common.address"));

  var contactService, validContact;

  beforeEach(function() {
    validContact = {
      username: "dummy Username",
      firstName: "dummy First Name",
      lastName: "dummy Last Name",
      email: "email@sample.com",
      telephone: "dummy Telephone"
    };

    inject(function($injector) {
      contactService = $injector.get("contactService");
    });
  });

  it("should exist", function() {
    expect(contactService).to.be.ok;
    expect(contactService.contactsAreIdentical).to.be.a("function");
    expect(contactService.copyContactObj).to.be.a("function");
  });

  describe("contactsAreIdentical: ", function () {
    it("should ignore other properties", function() {
      var contact1 = angular.copy(validContact);
      var contact2 = angular.copy(validContact);
      contact2.junkProperty = "junkValue";
      contact2.username = "updatedUsername";

      expect(contactService.contactsAreIdentical(contact1, contact2)).to.equal(true);      
    });

    it("should return false if they are not identical", function() {      
      var contact1 = angular.copy(validContact);
      var contact2 = angular.copy(validContact);

      contact2.firstName = "new firstName";

      expect(contactService.contactsAreIdentical(contact1, contact2)).to.equal(false);
    });

  });

  describe("copyContactObj: ", function () {
    it("should create new object and not copy username property", function() {
      var contact1 = angular.copy(validContact);
      contact1.junkProperty = "junkValue";

      expect(contactService.copyContactObj(contact1)).to.not.equal(contact1);
      expect(contactService.copyContactObj(contact1)).to.deep.equal({
        username: "dummy Username",
        firstName: "dummy First Name",
        lastName: "dummy Last Name",
        email: "email@sample.com",
        telephone: "dummy Telephone"
      });
      
    });

    it("should update existing object", function() {
      var contact1 = angular.copy(validContact);
      var contact2 = {};
      contact1.junkProperty = "junkValue";

      expect(contactService.copyContactObj(contact1, contact2)).to.equal(contact2);
      expect(contactService.copyContactObj(contact1, contact2)).to.deep.equal({
        username: "dummy Username",
        firstName: "dummy First Name",
        lastName: "dummy Last Name",
        email: "email@sample.com",
        telephone: "dummy Telephone"
      });
      
    });

  });

});
