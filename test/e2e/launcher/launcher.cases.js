(function() {
	"use strict";

	var HomepageScenarios = require('./cases/homepage.js');
	var SignupScenarios = require('./cases/signup.js');
	var SigninScenarios = require('./cases/signin.js');
	var SigninRedirectScenarios = require('./cases/signin-redirect.js');

	describe("Apps Launcher", function() {
		var homepageScenarios = new HomepageScenarios();
		var signupScenarios = new SignupScenarios();
		var signinScenarios = new SigninScenarios();	
		var signinRedirectScenarios = new SigninRedirectScenarios();
	});

})();
