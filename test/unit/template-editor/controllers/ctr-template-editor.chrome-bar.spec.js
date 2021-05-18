'use strict';
describe('controller: TemplateEditor : Chrome Bar', function() {

  var $scope, $window, isMobileBrowser;

  beforeEach(module('risevision.template-editor.controllers'));
  beforeEach(module(function ($provide) {
    $provide.factory('presentationUtils', function() {
      return {
        isMobileBrowser: function() {
          return isMobileBrowser;
        }
      };
    });
    $provide.service('$window', function () {
      return {
        navigator: {
          userAgent: window.navigator.userAgent
        }
      };
    });
    $provide.factory('templateEditorFactory', function() {
      return {
        presentation: { 
          templateAttributeData: {}
        },
        save: function() {
          return Q.resolve();
        }        
      }
    });
    $provide.factory('scheduleFactory', function() {
      return {
        hasSchedules: function () {}
      };
    });
    $provide.factory('componentsFactory', function() {
      return {
      };
    });
    

  }));

  function _injectController(userAgent) {
    inject(function($injector, $rootScope, $controller) {
      $scope = $rootScope.$new();

      $window = $injector.get('$window');

      $window.navigator.userAgent = userAgent;

      $controller('TemplateEditorController', {
        $scope: $scope
      });
      $scope.$digest();
    });
  }

  describe('Desktop', function() {
    beforeEach(function() {
      isMobileBrowser = false;

      _injectController();
    });

    it('should not consider chrome bar height on desktop browsers', function() {
      expect($scope).to.be.ok;
      expect($scope.considerChromeBarHeight).to.be.false;
    });
  });

  describe('Mobile', function() {
    beforeEach(function() {
      isMobileBrowser = true;
    });

    describe('Chrome', function() {
      beforeEach(function() {
        var CHROME_USER_AGENT =
          'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3 like Mac OS X) AppleWebKit/602.1.50 (KHTML, like Gecko) CriOS/56.0.2924.75 Mobile/14E5239e Safari/602.1';

        _injectController(CHROME_USER_AGENT);
      });

      it('should consider chrome bar height on mobile Chrome browsers', function() {
        expect($scope).to.be.ok;
        expect($scope.considerChromeBarHeight).to.be.true;
      });
    });

    describe('Safari', function() {
      beforeEach(function() {
        var SAFARI_USER_AGENT =
          'mozilla/5.0 (ipad; cpu iphone os 7_0_2 like mac os x) applewebkit/537.51.1 (khtml, like gecko) version/7.0 mobile/11a501 safari/9537.53';

        _injectController(SAFARI_USER_AGENT);
      });

      it('should consider chrome bar height on mobile Safari browsers', function() {
        expect($scope).to.be.ok;
        expect($scope.considerChromeBarHeight).to.be.true;
      });
    });

    describe('Firefox', function() {
      beforeEach(function() {
        var FIREFOX_USER_AGENT =
          'Mozilla/5.0 (Android 4.4; Mobile; rv:41.0) Gecko/41.0 Firefox/41.0';

        _injectController(FIREFOX_USER_AGENT);
      });

      it('should not consider chrome bar height on mobile Firefox browsers', function() {
        expect($scope).to.be.ok;
        expect($scope.considerChromeBarHeight).to.be.false;
      });
    });

    describe('Samsung browsers', function() {
      beforeEach(function() {
        var SAMSUNG_USER_AGENT =
          'Mozilla/5.0 (Linux; Android $ver; $model) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/$app_ver Chrome/$engine_ver Mobile Safari/537.36 ? Current values: android_ver = 7.0 app_ver = 5.2 , engine_ver = 51.0.2704.106';

        _injectController(SAMSUNG_USER_AGENT);
      });

      it('should not consider chrome bar height on mobile Samsung browsers', function() {
        expect($scope).to.be.ok;
        expect($scope.considerChromeBarHeight).to.be.false;
      });
    });

  });

});
