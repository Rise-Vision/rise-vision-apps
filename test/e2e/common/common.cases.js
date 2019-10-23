(function() {
	'use strict';

	var FirstSigninScenarios = require('./cases/first-signin.js');
	var HomepageScenarios = require('./cases/homepage.js');
	var SigninGoogleScenarios = require('./cases/signin-google.js');
	var SigninCustomScenarios = require('./cases/signin-custom.js');
	var WeeklyTemplatesScenarios = require('./cases/weekly-templates.js');
	
	describe('Apps Common', function() {
		var firstSigninScenarios = new FirstSigninScenarios();
		var homepageScenarios = new HomepageScenarios();
		var signinGoogleScenarios = new SigninGoogleScenarios();	
		var signinCustomScenarios = new SigninCustomScenarios();
		var weeklyTemplatesScenarios = new WeeklyTemplatesScenarios();
	});

})();
