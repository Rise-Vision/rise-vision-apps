'use strict';
describe('directive: scheduleFields', function() {
  var $scope, $rootScope;
  var classicPres1 = { name: 'classic1' };
  var classicPres2 = { name: 'classic2' };
  var htmlPres1 = { name: 'html1', presentationType: 'HTML Template' };
  var items = [ classicPres1, classicPres2, htmlPres1 ];
  var element;

  beforeEach(module('risevision.editor.services'));
  beforeEach(module('risevision.schedules.directives'));
  beforeEach(module(mockTranslate()));
  beforeEach(module(function ($provide) {
    $provide.service('$modal', function() {
      return {
        open: function() {
        }
      };
    });
    $provide.service('playlistFactory', function() {
      return {
      };
    });
    $provide.service('scheduleFactory', function() {
      return {
        getPreviewUrl: function () {}
      };
    });
  }));

  beforeEach(inject(function($compile, _$rootScope_, $templateCache){
    $templateCache.put('partials/schedules/schedule-fields.html', '<p>mock</p>');
    $rootScope = _$rootScope_;
    $scope = $rootScope.$new();
    $scope.schedule = {};

    element = $compile('<schedule-fields></schedule-fields>')($scope);
    $rootScope.$digest();
  }));

  describe('isPreviewAvailable:', function() {
    it('should have Preview button available', function() {
      $scope.schedule.content = [];
      expect($scope.isPreviewAvailable()).to.be.true;
      $scope.schedule.content = [ classicPres1, classicPres2 ];
      expect($scope.isPreviewAvailable()).to.be.true;
    });

    it('should not have Preview button available', function() {
      $scope.schedule.content = [ htmlPres1 ];
      expect($scope.isPreviewAvailable()).to.be.false;
      $scope.schedule.content = [ classicPres1, htmlPres1 ];
      expect($scope.isPreviewAvailable()).to.be.false;
      $scope.schedule.content = [ classicPres1, classicPres2, htmlPres1 ];
      expect($scope.isPreviewAvailable()).to.be.false;
    });
  });
});
