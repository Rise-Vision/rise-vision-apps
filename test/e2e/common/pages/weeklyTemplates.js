'use strict';
var WeeklyTemplatesPage = function() {
  var weeklyTemplatesMainPanel = element(by.id('TemplateList1'));
  var weeklyTemplatesExpandedView = element(by.id('weekly-templates-expanded'));
  var weeklyTemplatesNoticeView = element(by.id('weekly-templates-notice'));

  var weeklyTemplatesCloseButton = element(by.id('weekly-templates-close'));
  

  this.getWeeklyTemplatesMainPanel = function() {
    return weeklyTemplatesMainPanel;
  };

  this.getWeeklyTemplatesExpandedView = function() {
    return weeklyTemplatesExpandedView;
  };

  this.getWeeklyTemplatesNoticeView = function() {
    return weeklyTemplatesNoticeView;
  };

  this.getWeeklyTemplatesCloseButton = function() {
    return weeklyTemplatesCloseButton;
  };
  
};

module.exports = WeeklyTemplatesPage;
