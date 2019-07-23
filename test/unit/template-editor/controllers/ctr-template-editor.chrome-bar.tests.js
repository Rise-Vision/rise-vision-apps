'use strict';
describe('controller: TemplateEditor : Chrome Bar', function() {

  var $rootScope, $scope, $window, factory, originalWindowNavigator;

  function _providePresentationUtils($provide, isMobileBrowser) {
    $provide.factory('presentationUtils', function() {
      return {
        isMobileBrowser: function () { return isMobileBrowser; }
      };
    });
  }

  function _injectController(userAgent) {
    inject(function($injector, $controller) {
      $rootScope = $injector.get('$rootScope');
      $scope = $rootScope.$new();

      $window = $injector.get('$window');

      originalWindowNavigator = $window.navigator;
      $window.navigator = {
        userAgent: userAgent,
        language: originalWindowNavigator.language
      };

      $controller('TemplateEditorController', {
        $scope: $scope,
        editorFactory: $injector.get('templateEditorFactory')
      });

      $scope.$digest();
    });
  }

  afterEach(function(){
    $window.navigator = originalWindowNavigator;
  })

  beforeEach(function() {
    factory = {
      presentation: { templateAttributeData: {} },
      save: function() {
        return Q.resolve();
      }
    };
  });

  beforeEach(module('risevision.template-editor.controllers'));
  beforeEach(module('risevision.template-editor.services'));
  beforeEach(module('risevision.editor.services'));
  beforeEach(module(mockTranlate()));
  beforeEach(module(function ($provide) {
    $provide.factory('templateEditorFactory', function() {
      return factory;
    });
    $provide.factory('scheduleFactory', function() {
      return {
        hasSchedules: function () {}
      };
    });
  }));

  describe('controller: TemplateEditor : Chrome Bar : Desktop', function() {

    beforeEach(module(function($provide) {
      _providePresentationUtils($provide, false);
    }));

    beforeEach(function() {
      _injectController();
    });

    it('should not consider chrome bar height on desktop browsers', function() {
      expect($scope).to.be.truely;
      expect($scope.considerChromeBarHeight).to.be.false;
    });

  });

  describe('controller: TemplateEditor : Chrome Bar : Mobile', function() {

    beforeEach(module(function($provide) {
      _providePresentationUtils($provide, true);
    }));

    describe('controller: TemplateEditor : Chrome Bar : Mobile : Chrome', function() {
      var CHROME_USER_AGENT =
        'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3 like Mac OS X) AppleWebKit/602.1.50 (KHTML, like Gecko) CriOS/56.0.2924.75 Mobile/14E5239e Safari/602.1';

      beforeEach(function() {
        _injectController(CHROME_USER_AGENT);
      });

      it('should consider chrome bar height on mobile Chrome browsers', function() {
        expect($scope).to.be.truely;
        expect($scope.considerChromeBarHeight).to.be.true;
      });

    });

    describe('controller: TemplateEditor : Chrome Bar : Mobile : Chrome', function() {
      var CHROME_USER_AGENT =
        'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3 like Mac OS X) AppleWebKit/602.1.50 (KHTML, like Gecko) CriOS/56.0.2924.75 Mobile/14E5239e Safari/602.1';

      beforeEach(function() {
        _injectController(CHROME_USER_AGENT);
      });

      it('should consider chrome bar height on mobile Chrome browsers', function() {
        expect($scope).to.be.truely;
        expect($scope.considerChromeBarHeight).to.be.true;
      });

    });

    describe('controller: TemplateEditor : Chrome Bar : Mobile : Safari', function() {
      var SAFARI_USER_AGENT =
        'mozilla/5.0 (ipad; cpu iphone os 7_0_2 like mac os x) applewebkit/537.51.1 (khtml, like gecko) version/7.0 mobile/11a501 safari/9537.53';

      beforeEach(function() {
        _injectController(SAFARI_USER_AGENT);
      });

      it('should consider chrome bar height on mobile Safari browsers', function() {
        expect($scope).to.be.truely;
        expect($scope.considerChromeBarHeight).to.be.true;
      });

    });

    describe('controller: TemplateEditor : Chrome Bar : Mobile Firefox', function() {

      var FIREFOX_USER_AGENT =
        'Mozilla/5.0 (Android 4.4; Mobile; rv:41.0) Gecko/41.0 Firefox/41.0';

      beforeEach(function() {
        _injectController(FIREFOX_USER_AGENT);
      });

      it('should not consider chrome bar height on mobile Firefox browsers', function() {
        expect($scope).to.be.truely;
        expect($scope.considerChromeBarHeight).to.be.false;
      });

    });

    describe('controller: TemplateEditor : Chrome Bar : Mobile Samsung Browser', function() {

      var SAMSUNG_USER_AGENT =
        'Mozilla/5.0 (Linux; Android $ver; $model) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/$app_ver Chrome/$engine_ver Mobile Safari/537.36 ? Current values: android_ver = 7.0 app_ver = 5.2 , engine_ver = 51.0.2704.106';

      beforeEach(function() {
        _injectController(SAMSUNG_USER_AGENT);
      });

      it('should not consider chrome bar height on mobile Samsung browsers', function() {
        expect($scope).to.be.truely;
        expect($scope.considerChromeBarHeight).to.be.false;
      });

    });

  });

});
