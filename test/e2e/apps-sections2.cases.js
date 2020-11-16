(function () {
  'use strict';

  var AlertsScenarios = require('./displays/cases/alerts.js');
  var DisplayListScenarios = require('./displays/cases/displaylist.js');
  var DisplayAddScenarios = require('./displays/cases/displayadd.js');
  var DisplayManageScenarios = require('./displays/cases/displaymanage.js');

  var ScheduleListScenarios = require('./schedules/cases/schedulelist.js');
  var AddDistributionScenarios = require('./schedules/cases/add-distribution.js');
  var AddTimelineScenarios = require('./schedules/cases/add-timeline.js');
  var AddPresentationScenarios = require('./schedules/cases/add-presentation.js');
  var AddUrlScenarios = require('./schedules/cases/add-url.js');
  var SchedulePlaylistScenarios = require('./schedules/cases/playlist.js');
  var ScheduleAddScenarios = require('./schedules/cases/scheduleadd.js');

  var PresentationListScenarios = require('./editor/cases/presentation-list.js');
  var ArtboardScenarios = require('./editor/cases/artboard.js');
  var PresentationPropertiesScenarios = require('./editor/cases/presentation-properties.js');
  var ArtboardPlaceholdersScenarios = require('./editor/cases/artboard-placeholders.js');
  var PlaceholdersListScenarios = require('./editor/cases/placeholders-list.js');
  var PlaceholderSettingsScenarios = require('./editor/cases/placeholder-settings.js');
  var PlaceholderPlaylistScenarios = require('./editor/cases/playlist.js');
  var AddContentScenarios = require('./editor/cases/add-content.js');
  var TemplateAddScenarios = require('./editor/cases/template-add.js');
  var HtmlEditorScenarios = require('./editor/cases/html-editor.js');
  var PresentationAddScenarios = require('./editor/cases/presentation-add.js');
  var SharedTemplatesScenarios = require('./editor/cases/shared-templates.js');
  var ProfessionalWidgetsScenarios = require('./editor/cases/professional-widgets.js');

  describe('Displays', function () {
    var alertsScenarios = new AlertsScenarios();
    var displayAddScenarios = new DisplayAddScenarios();
    var displayListScenarios = new DisplayListScenarios();
    var displayManageScenarios = new DisplayManageScenarios();
  });

  describe('Schedules', function () {
    var scheduleListScenarios = new ScheduleListScenarios();
    var addDistributionScenarios = new AddDistributionScenarios();
    var addTimelineScenarios = new AddTimelineScenarios();
    var addPresentationScenarios = new AddPresentationScenarios();
    var addUrlScenarios = new AddUrlScenarios();
    var schedulePlaylistScenarios = new SchedulePlaylistScenarios();
    var scheduleAddScenarios = new ScheduleAddScenarios();
  });

  describe('Editor', function () {
    var presentationListScenarios = new PresentationListScenarios();
    var artboardScenarios = new ArtboardScenarios();
    var presentationPropertiesScenarios = new PresentationPropertiesScenarios();
    var artboardPlaceholdersScenarios = new ArtboardPlaceholdersScenarios();
    var placeholdersListScenarios = new PlaceholdersListScenarios();
    var placeholderSettingsScenarios = new PlaceholderSettingsScenarios();
    var placeholderPlaylistScenarios = new PlaceholderPlaylistScenarios();
    var addContentScenarios = new AddContentScenarios();
    var templateAddScenarios = new TemplateAddScenarios();
    var htmlEditorScenarios = new HtmlEditorScenarios();
    var presentationAddScenarios = new PresentationAddScenarios();
    var sharedTemplatesScenarios = new SharedTemplatesScenarios();
    var professionalWidgetsScenarios = new ProfessionalWidgetsScenarios();
  });

})();
