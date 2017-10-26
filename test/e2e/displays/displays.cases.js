(function() {
  'use strict';

  var AlertsScenarios = require('./cases/alerts.js');
  var DisplayListScenarios = require('./cases/displaylist.js');
  var DisplayAddScenarios = require('./cases/displayadd.js');
  var DisplayManageScenarios = require('./cases/displaymanage.js');
  var PlayerProScenarios = require('./cases/playerpro.js');

  describe('Displays', function() {
    var alertsScenarios = new AlertsScenarios();
    var displayListScenarios = new DisplayListScenarios();
    var displayAddScenarios = new DisplayAddScenarios();
    var displayManageScenarios = new DisplayManageScenarios();
    var playerProScenarios = new PlayerProScenarios();
  });

})();
