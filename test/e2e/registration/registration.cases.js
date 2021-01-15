(function() {

  "use strict";

  var RegistrationScenarios = require("./cases/registration.js");
  var CheckoutScenarios = require("./cases/checkout.js");
  var TrialScenarios = require("./cases/trial.js");
  var SubscriptionEditScenarios = require("./cases/subscription-edit.js");
  var AccountRemovalScenarios = require("./cases/account-removal.js");
  var RegistrationExistingCompanyScenarios = require("./cases/registration-existing-company.js");

  browser.driver.manage().window().setSize(1280, 768);

  describe("Registration", function() {
    this.timeout(2000);// to allow for protactor to load the seperate page

    //var registrationScenarios = new RegistrationScenarios();
    //var trialScenarios = new TrialScenarios();
    //var checkoutScenarios = new CheckoutScenarios();
    var subscriptionEditScenarios = new SubscriptionEditScenarios();
    //var accountRemovalScenarios = new AccountRemovalScenarios();
    //var registrationExistingCompany = new RegistrationExistingCompanyScenarios();

  });

})();
