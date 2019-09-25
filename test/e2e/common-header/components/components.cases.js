(function() {

  "use strict";

  var BackgroundImageSettingScenarios = require('./background-image-setting/background-image-setting.js');
  var RepeatSettingScenarios = require('./background-image-setting/repeat-setting.js');

  var DistributionSelectorScenarios = require('./distribution-selector/distribution-selector.js');
  var FocusMeScenarios = require('./focus-me/focus-me.js');
  var LastModifiedScenarios = require('./last-modified/last-modified.js');
  var ScrollingListScenarios = require('./scrolling-list/scrolling-list.js');
  var SearchFilterScenarios = require('./search-filter/search-filter.js');

  var SubscriptionStatusScenarios = require('./subscription-status/subscription-status.js');

  var TimelineTextboxScenarios = require('./timeline/timeline-textbox.js');

  browser.driver.manage().window().setSize(1280, 768);

  describe("Components: ", function() {
    this.timeout(2000);// to allow for protactor to load the seperate page
  
    var backgroundImageSettingScenarios = new BackgroundImageSettingScenarios();
    var repeatSettingScenarios = new RepeatSettingScenarios();

    var distributionSelector = new DistributionSelectorScenarios();
    var focusMeScenarios = new FocusMeScenarios();
    var lastModifiedScenarios = new LastModifiedScenarios();
    var scrollingListScenarios = new ScrollingListScenarios();
    var searchFilterScenarios = new SearchFilterScenarios();

    var subscriptionStatusScenarios = new SubscriptionStatusScenarios();

    var timelineTextboxScenarios = new TimelineTextboxScenarios();

  });
  
})();
