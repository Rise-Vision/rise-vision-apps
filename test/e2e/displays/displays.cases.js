(function() {
  'use strict';

  var AlertsScenarios = require('./cases/alerts.js');
  var DisplayListScenarios = require('./cases/displaylist.js');
  var DisplayAddScenarios = require('./cases/displayadd.js');
  var DisplayManageScenarios = require('./cases/displaymanage.js');

  describe('Displays', function() {
    var alertsScenarios = new AlertsScenarios();
    var displayAddScenarios = new DisplayAddScenarios();
    var displayListScenarios = new DisplayListScenarios();
    var displayManageScenarios = new DisplayManageScenarios();
  });

})();
