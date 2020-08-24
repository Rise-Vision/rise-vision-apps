(function() {
	'use strict';

	var HomepageScenarios = require('./cases/homepage.js');
	var SigninGoogleScenarios = require('./cases/signin-google.js');
	var SigninCustomScenarios = require('./cases/signin-custom.js');
	var WeeklyTemplatesScenarios = require('./cases/weekly-templates.js');
	
	describe('Apps Common', function() {
		var homepageScenarios = new HomepageScenarios();
		var signinGoogleScenarios = new SigninGoogleScenarios();	
		var signinCustomScenarios = new SigninCustomScenarios();
		var weeklyTemplatesScenarios = new WeeklyTemplatesScenarios();
	});

})();
