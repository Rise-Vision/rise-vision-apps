"use strict";
describe("controller: Edit Timeline Modal", function() {
  beforeEach(module("risevision.common.components.timeline"));
  beforeEach(module(function ($provide) {
    $provide.service("$modalInstance",function(){
      return {
        close : function(){
          return;
        },
        dismiss : function(){
          return;
        }
      };
    });

    $provide.factory("TimelineFactory",function(){
      return function() {
        this.timeline = {
          useLocaldate: true,
          startDate: "2019-02-27T00:00:00.000Z"
        };
        this.recurrence = {};
        this.init = function(){
          return;
        };
        this.save = function(){
          return;
        };
      };
    });

    $provide.value("timeline", timelineValue);
  }));
  var $scope, $modalInstance, $modalInstanceDismissSpy, $modalInstanceCloseSpy, timelineValue, timeline;

  describe("New timeline:" ,function () {
    beforeEach(function(){
      timelineValue = {};
      inject(function($injector, $rootScope, $controller){
        $scope = $rootScope.$new();
        $modalInstance = $injector.get("$modalInstance");
        $modalInstanceDismissSpy = sinon.spy($modalInstance, "dismiss");
        $modalInstanceCloseSpy = sinon.spy($modalInstance, "close");
        timeline = $injector.get("timeline");
        $controller("timelineModal", {
          $scope : $scope,
          $modalInstance : $modalInstance,
          timeline: timeline,
          TimelineFactory: $injector.get("TimelineFactory"),
        });
        $scope.$digest();
      });
    });

    it("should exist",function(){
      expect($scope).to.be.truely;

      expect($scope.save).to.be.a("function");
      expect($scope.close).to.be.a("function");
      expect($scope.openDatepicker).to.be.a("function");

      expect($scope.timeline).to.be.a("object");
      expect($scope.recurrence).to.be.a("object");
      
      expect($scope.dateOptions).to.be.a("object");
      expect($scope.dateOptions).to.be.a("object");
      expect($scope.datepickers).to.be.a("object");
    });

    it("should initialize initDate variables for Start and End Date", function() {
      expect($scope.datepickers.startDate).to.be.an("object");
      expect($scope.datepickers.startDate.initDate).to.be.a("Date");

      expect($scope.datepickers.endDate).to.be.an("object");
      expect($scope.datepickers.endDate.initDate).to.be.undefined;
    });

    it("should close modal when clicked on save",function(){
      $scope.save();
      $scope.$digest();

      $modalInstanceCloseSpy.should.have.been.calledWith($scope.timeline);
    });

    it("should dismiss modal when clicked on close with no action",function(){
      $scope.close();

      $modalInstanceDismissSpy.should.have.been.called;
    });

  });

});
