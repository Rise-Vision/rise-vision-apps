(function() {

  "use strict";

  var expect = require('rv-common-e2e').expect;

  var TimelineTextboxScenarios = function() {

    describe("timeline-textbox", function() {
      beforeEach(function () {
        browser.get("/test/e2e/components/timeline/timeline-textbox.html");
      });

      it("Should load", function () {
        expect(element(by.model("timeline.always")).isPresent())
          .to.eventually.be.true;
        expect(element(by.model("timeline.always")).isSelected())
          .to.eventually.be.true;
        expect(element(by.id("timelineTextbox")).isPresent())
          .to.eventually.be.true;
        expect(element(by.id("timelineTextbox")).isDisplayed())
          .to.eventually.be.false;
      });
      
      it("Should show timeline when Always is checked off", function () {
        element(by.model("timeline.always")).click();
        
        expect(element(by.id("timelineTextbox")).isDisplayed())
          .to.eventually.be.true;
      });
      
      describe("Timeline dialog", function() {
        
        beforeEach(function() {
          element(by.model("timeline.always")).click();
          element(by.id("timelineTextbox")).click();
          
          browser.sleep(500);
        });

        it("Should open dialog", function (done) {
          
          expect(element(by.css(".modal-body .timeline")).isPresent())
            .to.eventually.be.true;
            
          element.all(by.css(".modal-footer .btn")).then(function (elements) {
            expect(elements.length).to.equal(2);

            expect(elements[1].getText()).to.eventually.equal("Cancel");
            
            done();
          });
        });
        
        it("Should intitialize defaults", function() {
          expect(element(by.id("startDate")).isDisplayed())
            .to.eventually.be.true;
          expect(element(by.id("startDate")).getAttribute('value'))
            .to.eventually.be.ok;
              
          expect(element(by.id("endDate")).isDisplayed())
            .to.eventually.be.true;
          expect(element(by.id("endDate")).getAttribute('value'))
            .to.eventually.not.be.ok;
                    
          expect(element(by.model("timeline.allDay")).isPresent())
            .to.eventually.be.true;
          expect(element(by.model("timeline.allDay")).isSelected())
            .to.eventually.be.true;
            
          expect(element(by.id("Daily")).isDisplayed())
            .to.eventually.be.true;
          
          expect(element(by.model("recurrence.daily.recurrenceFrequency")).isDisplayed())
            .to.eventually.be.true;
        });
        
        it("Should not show fields that should be hidden", function() {
          expect(element(by.id("startTime")).isDisplayed())
            .to.eventually.be.false;
          expect(element(by.id("endTime")).isDisplayed())
            .to.eventually.be.false;
        });

        it("Should show time fields if allday is checked off", function() {
          element(by.model("timeline.allDay")).click();

          expect(element(by.id("startTime")).isDisplayed())
            .to.eventually.be.true;
          expect(element(by.id("endTime")).isDisplayed())
            .to.eventually.be.true;

        });
        
        describe("Recurrence: ", function() {
          it("Should show daily fields", function() {
            expect(element(by.id("Daily")).isDisplayed()).to.eventually.be.true;
            expect(element(by.id("Daily")).isSelected()).to.eventually.be.true;
            
            expect(element(by.model("recurrence.daily.recurrenceFrequency")).isPresent())
              .to.eventually.be.true;
            expect(element(by.model("recurrence.daily.recurrenceFrequency")).getAttribute('value'))
              .to.eventually.equal("1");

          });
          
          it("Should show weekly fields", function() {
            element(by.id("Weekly")).click();

            expect(element(by.model("recurrence.weekly.recurrenceFrequency")).isPresent())
              .to.eventually.be.true;
            expect(element(by.model("recurrence.weekly.recurrenceFrequency")).getAttribute('value'))
              .to.eventually.equal("1");
              
            expect(element.all(by.css(".timelineWeekdays input")).count())
              .to.eventually.equal(7);

          });
          
          it("Should show monthly fields", function() {
            element(by.id("Monthly")).click();

            expect(element(by.model("recurrence.monthly.absolute.recurrenceFrequency")).isPresent())
              .to.eventually.be.true;
            expect(element(by.model("recurrence.monthly.absolute.recurrenceFrequency")).getAttribute('value'))
              .to.eventually.equal("1");
              
            expect(element(by.model("recurrence.monthly.relative.recurrenceFrequency")).isPresent())
              .to.eventually.be.true;
            expect(element(by.model("recurrence.monthly.relative.recurrenceFrequency")).isEnabled())
              .to.eventually.be.false;
            expect(element(by.model("recurrence.monthly.relative.recurrenceFrequency")).getAttribute('value'))
              .to.eventually.equal("1");
          });

          it("Should show yearly fields", function() {
            element(by.id("Yearly")).click();

            expect(element(by.model("recurrence.yearly.absolute.recurrenceDayOfMonth")).isPresent())
              .to.eventually.be.true;
            expect(element(by.model("recurrence.yearly.absolute.recurrenceDayOfMonth")).getAttribute('value'))
              .to.eventually.equal("1");
          });
        });

        it('Should close when clicking outside modal',function(){
          browser.actions().mouseMove(element(by.css("body")),{x: 5, y: 5}).click().perform();
          expect(element(by.css(".modal-body .timeline")).isPresent()).to.eventually.be.false;
        });

      });

    
    });

  };
  module.exports = TimelineTextboxScenarios;

})();
