/*jshint expr:true */
"use strict";

describe("Services: address factory", function() {
  beforeEach(module("risevision.common.components.purchase-flow"));
  beforeEach(module(function ($provide) {
    $provide.service("$q", function() {return Q;});
    $provide.service("$log", function() {
      return {
        info: sinon.stub(),
        error: sinon.stub(),
        debug: sinon.stub()
      };
    });
    $provide.service("storeService", function() {
      return storeService = {
        validateAddress: sinon.spy(function(obj) {
          if (obj.resolve) {
            return Q.resolve(obj.resolve);
          } else {
            return Q.reject(obj.reject);
          }
        })
      };
    });
    $provide.service("updateCompany", function() {
      return updateCompany = sinon.spy(function() {
        if (updateSuccess) {
          return Q.resolve("success");
        } else {
          return Q.reject("failure");
        }
      });
    });
    $provide.service("updateUser", function() {
      return updateUser = sinon.spy(function() {
        if (updateSuccess) {
          return Q.resolve("success");
        } else {
          return Q.reject("failure");
        }
      });
    });
    $provide.service("userState",function() {
      return userState = {
        getCopyOfUserCompany: sinon.stub().returns({}),
        getCopyOfSelectedCompany: sinon.stub().returns({}),
        getUserCompanyId: sinon.stub().returns("id"),
        updateCompanySettings: sinon.spy(),
        updateUserProfile: sinon.spy(),
        getUsername: function() {
          return "some username";
        },
        getCopyOfProfile: sinon.stub().returns({})
      };
    });
    $provide.service("confirmModal", function() {
      return confirmModal = sinon.spy(function() {
        if (confirmModalSuccess) {
          return Q.resolve("success");
        } else {
          return Q.reject("failure");
        }
      });
    });

  }));

  var $log, addressObject, addressFactory, storeService, addressService, userState, updateCompany, updateUser, updateSuccess, confirmModal, confirmModalSuccess;

  beforeEach(function() {
    updateSuccess = true;
    addressObject = {
      street: "street",
      unit: "unit",
      city: "city",
      province: "province",
      country: "CA",
      postalCode: "postalCode"
    };

    inject(function($injector) {
      $log = $injector.get("$log");
      addressService = $injector.get("addressService");
      addressFactory = $injector.get("addressFactory");
    });
  });

  it("should exist", function() {
    expect(addressFactory).to.be.ok;
    expect(addressFactory.validateAddress).to.be.a("function");
    expect(addressFactory.updateAddress).to.be.a("function");
    expect(addressFactory.updateContact).to.be.a("function");
  });

  describe("validateAddress: ", function() {
    it("should reset validationError to false", function() {
      addressFactory.validateAddress(addressObject);

      expect(addressObject.validationError).to.be.false;
    });

    it("should resolve and skip validation if Country is not US/CA", function(done) {
      addressObject.resolve = false;
      addressObject.country = "BR";
      
      addressFactory.validateAddress(addressObject)
        .then(function() {
          expect(addressObject.validationError).to.be.false;
          storeService.validateAddress.should.not.have.been.called;
          $log.debug.should.have.been.called;

          done();
        })
        .then(null, done);
    });

    it("should resolve if validation passes for CA", function(done) {
      addressObject.resolve = true;

      addressFactory.validateAddress(addressObject)
        .then(function() {
          expect(addressObject.validationError).to.be.false;
          storeService.validateAddress.should.have.been.called;

          done();
        })
        .then(null, done);
    });

    it("should resolve if validation passes for US", function(done) {
      addressObject.resolve = true;
      addressObject.country = "US";

      addressFactory.validateAddress(addressObject)
        .then(function() {
          expect(addressObject.validationError).to.be.false;
          storeService.validateAddress.should.have.been.called;

          done();
        })
        .then(null, done);
    });

    it("should not log error if addresses match", function(done) {
      addressObject.resolve = {
        line1: "street",
        line2: "unit",
        city: "city",
        region: "province",
        country: "CA",
        postalCode: "postalCode"
      };

      addressFactory.validateAddress(addressObject)
        .then(function() {
          $log.error.should.not.have.been.called;
          expect(addressObject.validationError).to.be.false;

          done();
        })
        .then(null, done);
    });

    it("should log error if addresses do not match", function(done) {
      addressObject.resolve = {
        line1: "street1",
        line2: "unit1",
        city: "city1",
        region: "province1",
        country: "US",
        postalCode: "postalCode1"
      };

      addressFactory.validateAddress(addressObject)
        .then(function() {
          $log.error.should.have.been.called;
          expect(addressObject.validationError).to.be.false;

          done();
        })
        .then(null, done);
    });

    it("should reject with a message", function(done) {
      addressObject.reject = {
        message: "Validation Message"
      };

      addressFactory.validateAddress(addressObject)
        .then(function() {
          expect(addressObject.validationError).to.equal("Validation Message");

          done();
        })
        .then(null, done);
    });

    it("should reject with a generic message if none provided", function(done) {
      addressObject.reject = {};

      addressFactory.validateAddress(addressObject)
        .then(function() {
          expect(addressObject.validationError).to.equal("Unknown Error");

          done();
        })
        .then(null, done);
    });
    
  });

  describe("updateAddress: ", function() {
    var address;

    beforeEach(function() {
      address = {
        id: "id",
        name: "dummy Name",
        street: "dummy Street",
        unit: "dummy unit",
        city: "dummy city",
        province: "dummy province",
        country: "dummy country",
        postalCode: "dummy code"
      };

      userState.getCopyOfUserCompany.returns(angular.copy(address));
      userState.getCopyOfSelectedCompany.returns(addressService.copyAddressToShipTo(address));
    });

    describe("Billing Address: ", function() {
      it("should not update if address is not given", function(done) {
        addressFactory.updateAddress()
          .then(function() {
            updateCompany.should.not.have.been.called;

            done();
          })
          .then(null, done);
      });

      it("should not update if address is not changed", function(done) {
        addressFactory.updateAddress(address)
          .then(function() {
            updateCompany.should.not.have.been.called;

            done();
          })
          .then(null, done);
      });

      it("should update if address requires update", function(done) {
        var updatedAddress = angular.copy(address);
        updatedAddress.name = "updated Name";

        addressFactory.updateAddress(updatedAddress)
          .then(function() {
            updateCompany.should.have.been.calledWith("id", updatedAddress);

            userState.getCopyOfUserCompany.should.have.been.calledTwice;
            expect(userState.getCopyOfUserCompany.getCall(0).args[0]).to.be.undefined;
            expect(userState.getCopyOfUserCompany.getCall(1).args[0]).to.be.true;

            userState.updateCompanySettings.should.have.been.calledWith(sinon.match.object);
            expect(userState.updateCompanySettings.getCall(0).args[0]).to.deep.equal(updatedAddress);

            done();
          })
          .then(null, done);
      });

      it("should not update company settings if ids don't match", function(done) {
        userState.getUserCompanyId.returns("other id");
        var updatedAddress = angular.copy(address);
        updatedAddress.name = "updated Name";

        addressFactory.updateAddress(updatedAddress)
          .then(function() {
            updateCompany.should.have.been.calledWith("id", updatedAddress);

            userState.getCopyOfUserCompany.should.have.been.calledOnce;

            userState.updateCompanySettings.should.not.have.been.called;

            done();
          })
          .then(null, done);
      });

      it("should handle failure to update company settings", function(done) {
        updateSuccess = false;
        var updatedAddress = angular.copy(address);
        updatedAddress.name = "updated Name";

        addressFactory.updateAddress(updatedAddress)
          .then(done)
          .then(null, function() {
            updateCompany.should.have.been.called;

            userState.getCopyOfUserCompany.should.have.been.calledOnce;

            userState.updateCompanySettings.should.not.have.been.called;

            done();
          })
          .then(null, done);
      });

    });

    describe("billingContactEmails: ", function() {
      it("should not update field if email already exists in the array", function(done) {
        var updatedAddress = angular.copy(address);

        address.billingContactEmails = ["contactEmail", "otherEmail"];
        userState.getCopyOfUserCompany.returns(angular.copy(address));

        addressFactory.updateAddress(updatedAddress, {
          email: "contactEmail"
        })
          .then(function() {
            updateCompany.should.not.have.been.called;

            done();
          })
          .then(null, done);
      });

      it("should add contact email to the beginning of the array", function(done) {
        var updatedAddress = angular.copy(address);

        address.billingContactEmails = ["email1", "email2"];
        userState.getCopyOfUserCompany.returns(angular.copy(address));

        addressFactory.updateAddress(updatedAddress, {
          email: "contactEmail"
        })
          .then(function() {
            updateCompany.should.have.been.called;

            expect(updateCompany.getCall(0).args[1].billingContactEmails).to.be.an("array");
            expect(updateCompany.getCall(0).args[1].billingContactEmails).to.have.length(3);
            expect(updateCompany.getCall(0).args[1].billingContactEmails[0]).to.equal("contactEmail");

            expect(userState.updateCompanySettings.getCall(0).args[0].billingContactEmails).to.be.ok;
            expect(userState.updateCompanySettings.getCall(0).args[0].billingContactEmails).to.have.length(3);
            expect(userState.updateCompanySettings.getCall(0).args[0].billingContactEmails[0]).to.equal("contactEmail");

            done();
          })
          .then(null, done);
      });

      it("should create array and add contact email", function(done) {
        var updatedAddress = angular.copy(address);

        addressFactory.updateAddress(updatedAddress, {
          email: "contactEmail"
        })
          .then(function() {
            updateCompany.should.have.been.called;

            expect(updateCompany.getCall(0).args[1].billingContactEmails).to.be.an("array");
            expect(updateCompany.getCall(0).args[1].billingContactEmails).to.have.length(1);
            expect(updateCompany.getCall(0).args[1].billingContactEmails[0]).to.equal("contactEmail");

            expect(userState.updateCompanySettings.getCall(0).args[0].billingContactEmails).to.be.ok;
            expect(userState.updateCompanySettings.getCall(0).args[0].billingContactEmails).to.have.length(1);
            expect(userState.updateCompanySettings.getCall(0).args[0].billingContactEmails[0]).to.equal("contactEmail");

            done();
          })
          .then(null, done);
      });

      it("should ignore contact email for the shipping company", function(done) {
        var updatedAddress = angular.copy(address);

        addressFactory.updateAddress(updatedAddress, {
          email: "contactEmail"
        }, true)
          .then(function() {
            updateCompany.should.not.have.been.called;

            done();
          })
          .then(null, done);
      });

    });

    describe("Shipping Address: ", function() {
      it("should not update if address is not changed", function(done) {
        addressFactory.updateAddress(address, null, true)
          .then(function() {
            updateCompany.should.not.have.been.called;

            done();
          })
          .then(null, done);
      });

      it("should update if address requires update", function(done) {
        var updatedAddress = angular.copy(address);
        updatedAddress.name = "updated Name";

        addressFactory.updateAddress(updatedAddress, null, true)
          .then(function() {
            updateCompany.should.have.been.calledWith("id", addressService.copyAddressToShipTo(updatedAddress));

            userState.getCopyOfSelectedCompany.should.have.been.calledTwice;
            expect(userState.getCopyOfSelectedCompany.getCall(0).args[0]).to.be.undefined;
            expect(userState.getCopyOfSelectedCompany.getCall(1).args[0]).to.be.true;

            userState.updateCompanySettings.should.have.been.calledWith(sinon.match.object);
            expect(userState.updateCompanySettings.getCall(0).args[0]).to.deep.equal(addressService.copyAddressToShipTo(updatedAddress));

            done();
          })
          .then(null, done);
      });

    });

  });

  describe("updateContact: ", function() {
    var contact;

    beforeEach(function() {
      contact = {
        username: "dummy Username",
        firstName: "dummy First Name",
        lastName: "dummy Last Name",
        email: "email@sample.com",
        telephone: "dummy Telephone"
      };
      userState.getCopyOfProfile.returns(angular.copy(contact));

    });

    it("should not update if contact is not given", function(done) {
      addressFactory.updateContact()
        .then(function() {
          updateUser.should.not.have.been.called;

          done();
        })
        .then(null, done);
    });

    it("should not update if contact is not changed", function(done) {
      addressFactory.updateContact(contact)
        .then(function() {
          updateUser.should.not.have.been.called;

          done();
        })
        .then(null, done);
    });

    it("should update if contact requires update", function(done) {
      var updatedContact = angular.copy(contact);
      updatedContact.firstName = "updated First Name";

      addressFactory.updateContact(updatedContact)
        .then(function() {
          updateUser.should.have.been.calledWith("some username", updatedContact);

          userState.getCopyOfProfile.should.have.been.calledTwice;
          expect(userState.getCopyOfProfile.getCall(0).args[0]).to.be.undefined;
          expect(userState.getCopyOfProfile.getCall(1).args[0]).to.be.true;

          userState.updateUserProfile.should.have.been.calledWith(sinon.match.object);
          expect(userState.updateUserProfile.getCall(0).args[0]).to.deep.equal(updatedContact);

          done();
        })
        .then(null, done);
    });

    it("should handle failure to update contact", function(done) {
      updateSuccess = false;
      var updatedContact = angular.copy(contact);
      updatedContact.firstName = "updated First Name";

      addressFactory.updateContact(updatedContact)
        .then(done)
        .then(null, function() {
          updateUser.should.have.been.called;

          userState.getCopyOfProfile.should.have.been.calledOnce;

          userState.updateUserProfile.should.not.have.been.called;

          done();
        })
        .then(null, done);
    });

  });

  describe("isValidOrEmptyAddress:", function() {

    it("should resolve on empty address", function(done){
      var addressObject = {};
      addressFactory.isValidOrEmptyAddress(addressObject).then(function(){
        storeService.validateAddress.should.not.have.been.called;
        done();
      });
    });

    it("should resolve on empty address fields", function(done){
      var addressObject = {
        street: "",
        unit: "",
        city: "",
        country: "",
        postalCode: "",
        province: ""
      };
      addressFactory.isValidOrEmptyAddress(addressObject).then(function(){
        storeService.validateAddress.should.not.have.been.called;
        done();
      });
    });

    it("should resolve if country is not US or CA", function(done){
      var addressObject = {
        country: "BR"
      };
      addressFactory.isValidOrEmptyAddress(addressObject).then(function(){
        storeService.validateAddress.should.not.have.been.called;
        done();
      });
    });

    it("should resolve on valid address", function(done){
      var addressObject = {
        street: "515 King St W",
        unit: "",
        city: "Toronto",
        country: "CA",
        postalCode: "M5V 3M4",
        province: "ON"
      };
      addressObject.resolve = true;
      addressFactory.isValidOrEmptyAddress(addressObject).then(function(){
        storeService.validateAddress.should.have.been.called;
        done();
      });
    });

    it("should reject if store validation rejects", function(done){
      var addressObject = {
        street: "515 King St W",
        unit: "",
        city: "Toronto",
        country: "CA",
        postalCode: "M5V 3M4",
        province: "ON"
      };
      addressObject.resolve = false;
      addressFactory.isValidOrEmptyAddress(addressObject).then(null,function(){
        storeService.validateAddress.should.have.been.called;
        done();
      });
    });

    it("should try to validate if contry is empty, as address could be incomplete", function(done){
      var addressObject = {
        street: "515 King St W",
        unit: "",
        city: "Toronto",
        country: "",
        postalCode: "M5V 3M4",
        province: "ON"
      };
      addressObject.resolve = false;
      addressFactory.isValidOrEmptyAddress(addressObject).then(null,function(){
        storeService.validateAddress.should.have.been.called;
        done();
      });
    });
  });

  describe("confirmAndSetGeneralDelivery:", function() {
    it("should show a confirmation popup", function() {
      addressFactory.confirmAndSetGeneralDelivery();
      confirmModal.should.have.been.calledWith(
        "Address Information",
        "The address you provided couldn't be validated. This can happen if the address does not exist in the USPS records. If you're sure the address is correct you can specify this address as General Delivery and we'll only validate the City, State and Zip Code.<br/>Would you like to specify this address as General Delivery?",
        "Yes",
        "Cancel",
        "general-delivery-modal"
      );
    });

    it("should update address unit on confirmation", function(done) {
      confirmModalSuccess = true;
      var addressObject = {
        unit: null
      }
      addressFactory.confirmAndSetGeneralDelivery(addressObject).then(function() {
        expect(addressObject.unit).to.equal("General Delivery");
        done();
      });
    });

    it("should append to address unit if unit is already provided", function(done) {
      confirmModalSuccess = true;
      var addressObject = {
        unit: "Room 51"
      }
      addressFactory.confirmAndSetGeneralDelivery(addressObject).then(function() {
        expect(addressObject.unit).to.equal("Room 51 - General Delivery");
        done();
      });
    });

    it("should not update unit if dismissed", function(done) {
      confirmModalSuccess = false;
      var addressObject = {
        unit: null
      }
      addressFactory.confirmAndSetGeneralDelivery(addressObject).then(null, function() {
        expect(addressObject.unit).to.be.null;
        done();
      });
    });
  });
});
