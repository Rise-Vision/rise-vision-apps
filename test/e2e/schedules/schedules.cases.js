(function() {
  'use strict';

  var ScheduleListScenarios = require('./cases/schedulelist.js');
  var AddDistributionScenarios = require('./cases/add-distribution.js');
  var AddTimelineScenarios = require('./cases/add-timeline.js');
  var AddPresentationScenarios = require('./cases/add-presentation.js');
  var AddUrlScenarios = require('./cases/add-url.js');
  var PlaylistScenarios = require('./cases/playlist.js');
  var ScheduleAddScenarios = require('./cases/scheduleadd.js');

  describe('Schedules', function() {
    var scheduleListScenarios = new ScheduleListScenarios();
    var addDistributionScenarios = new AddDistributionScenarios();
    var addTimelineScenarios = new AddTimelineScenarios();
    var addPresentationScenarios = new AddPresentationScenarios();
    var addUrlScenarios = new AddUrlScenarios();
    var playlistScenarios = new PlaylistScenarios();
    var scheduleAddScenarios = new ScheduleAddScenarios();
  });

})();
