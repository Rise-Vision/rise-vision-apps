'use strict';
var expect = require('rv-common-e2e').expect;
var HomePage = require('./../../common/pages/homepage.js');
var SignInPage = require('./../../common/pages/signInPage.js');
var CommonHeaderPage = require('./../../common-header/pages/commonHeaderPage.js');
var SchedulesListPage = require('./../pages/schedulesListPage.js');
var ScheduleAddPage = require('./../pages/scheduleAddPage.js');
var helper = require('rv-common-e2e').helper;
var DistributionModalPage = require('./../pages/distributionModalPage.js');

var AddDistributionScenarios = function() {
  browser.driver.manage().window().setSize(1920, 1080);

  describe('Add Distribution', function () {
    this.timeout(2000);// to allow for protactor to load the seperate page
    var homepage;
    var signInPage;
    var commonHeaderPage;
    var schedulesListPage;
    var scheduleAddPage;
    var distributionModalPage;

    before(function () {
      homepage = new HomePage();
      signInPage = new SignInPage();
      schedulesListPage = new SchedulesListPage();
      scheduleAddPage = new ScheduleAddPage();
      commonHeaderPage = new CommonHeaderPage();
      distributionModalPage = new DistributionModalPage();

      homepage.getSchedules();
      signInPage.signIn();
      helper.waitDisappear(schedulesListPage.getLoader(),'Schedules loader');
    });

    describe(' Add a new schedule ', function () {
      before(function () {
        schedulesListPage.getScheduleAddButton().click();
      });

      it('should show All Displays checkbox', function () {
        expect(scheduleAddPage.getDistributionAllDisplaysCheckboxMask().isDisplayed()).to.eventually.be.true;
        expect(scheduleAddPage.getDistributionAllDisplaysCheckbox().isSelected()).to.eventually.be.false;
      });

      describe('Click on the Distribution field', function () {
        before(function () {
          scheduleAddPage.getDistributionField().click();
          helper.wait(distributionModalPage.getEditDistributionModal(), 'Edit Distribution Modal');
        });

        it('should open the Edit Distribution Modal', function () {
          expect(distributionModalPage.getEditDistributionModal().isDisplayed()).to.eventually.be.true;
        });

        it('should show modal title', function () {
          expect(distributionModalPage.getModalTitle().getText()).to.eventually.equal('Edit Distribution');
        });


        it('should show a search box', function () {
          expect(distributionModalPage.getDistributionSearchInput().isDisplayed()).to.eventually.be.true;
        });

        it('should show a table for listing displays', function () {
          helper.waitDisappear(distributionModalPage.getDistributionListLoader()).then(function () {
            expect(distributionModalPage.getDistributionListTable().isDisplayed()).to.eventually.be.true;
          });
          
        });

        it('should show displays', function () {
          expect(distributionModalPage.getDistributionItems().count()).to.eventually.be.above(0);
        });

        describe('Choose one display', function () {
          before(function () {
            var distributionItem = distributionModalPage.getDistributionItems().get(0);
            distributionItem.click();
            distributionModalPage.getApplyButton().click();
          });
          it('should add the display item to the distribution', function () {
            var expectResult = '1 Display Selected';
            expect(scheduleAddPage.getDistributionFieldText().getText()).to.eventually.equal(expectResult);
          });
        });

        describe('Choose two displays', function () {
          before(function () {
            helper.clickWhenClickable(scheduleAddPage.getDistributionField(), 'Click On Distribution Field').then(function () {
              helper.wait(distributionModalPage.getEditDistributionModal(), 'Edit Distribution Modal').then(function () {
                helper.waitDisappear(distributionModalPage.getDistributionListLoader()).then(function () {
                  var distributionItem = distributionModalPage.getDistributionItems().get(1);
                  distributionItem.click();
                  distributionModalPage.getApplyButton().click();
                });
              });
            });
          });
          it('should add two display items to the distribution', function () {
            var expectResult = '2 Displays Selected';
            expect(scheduleAddPage.getDistributionFieldText().getText()).to.eventually.equal(expectResult);
          });
        });


        describe('Do not choose any display', function () {
          before(function () {
            helper.clickWhenClickable(scheduleAddPage.getDistributionField(), 'Click On Distribution Field').then(function () {
              helper.wait(distributionModalPage.getEditDistributionModal(), 'Edit Distribution Modal').then(function () {
                helper.waitDisappear(distributionModalPage.getDistributionListLoader()).then(function () {
                  distributionModalPage.getCancelButton().click();
                });
              });
            });
          });
          it('should not add any display items to the distribution', function () {
            var expectResult = '2 Displays Selected';
            expect(scheduleAddPage.getDistributionFieldText().getText()).to.eventually.equal(expectResult);
          });
        });

        describe('Choose all displays', function () {
          before(function () {
            helper.clickOverIFrame(scheduleAddPage.getDistributionAllDisplaysCheckbox(), 'All Displays checkbox');
          });
          it('should hide displays field', function () {
            expect(distributionModalPage.getEditDistributionModal().isPresent()).to.eventually.be.false;
          });
        });

        describe('Choose all displays given a display is already set to a schedule', function () {
          it('should show a modal saying another user has already set a display to a schedule and ask to re-assign', function () {
            helper.clickWhenClickable(scheduleAddPage.getSaveButton());

            helper.wait(scheduleAddPage.getReassignDistribtionModal(), 'Reassign Distribtion Modal');

            expect(scheduleAddPage.getReassignDistribtionModal().isDisplayed()).to.eventually.be.true;            
          });

          it('should show an error if dismissed', function () {
            helper.clickWhenClickable(scheduleAddPage.getCloseReassignButton());

            helper.wait(scheduleAddPage.getErrorBox(), 'Error box').then(function () {
              expect(scheduleAddPage.getErrorBox().getText()).to.eventually.string('Some of the displays are already assigned to another schedule.');
            });
          });
        });
      });
    });
  });
};
module.exports = AddDistributionScenarios;
