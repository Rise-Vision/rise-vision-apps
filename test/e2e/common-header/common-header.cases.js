(function() {

  "use strict";

  var RegistrationScenarios = require("./cases/registration.js");
  var CompanySettingsScenarios = require("./cases/company-settings.js");
  var CompanySubcompaniesScenarios = require("./cases/company-subcompanies.js");
  var CompanyUsersScenarios = require("./cases/company-users.js");
  var UserSettingsScenarios = require("./cases/user-settings.js");
  var AccountRemovalScenarios = require("./cases/account-removal.js");
  var RegistrationExistingCompanyScenarios = require("./cases/registration-existing-company.js");


  browser.driver.manage().window().setSize(1280, 768);

  describe("Common Header ", function() {
    this.timeout(2000);// to allow for protactor to load the seperate page

    var registrationScenarios = new RegistrationScenarios();

    var companySettingsScenarios = new CompanySettingsScenarios(); 
    var companySubcompaniesScenarios = new CompanySubcompaniesScenarios(); 
    // var companyUsersSenarios = new CompanyUsersScenarios();
    var userSettingsScenarios = new UserSettingsScenarios(); 

    var accountRemovalScenarios = new AccountRemovalScenarios(); 

    var registrationExistingCompany = new RegistrationExistingCompanyScenarios();

  });
  
})();
