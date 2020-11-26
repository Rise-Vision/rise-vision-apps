"use strict";

describe("Services: helpWidgetFactory", function() {
  var sandbox = sinon.sandbox.create();
  var $timeout, $window, factory;

  beforeEach(module("risevision.common.support"));

  beforeEach(module(function ($provide) {
    $provide.value("HELP_URL", "https://help.risevision.com/");
    $provide.value("HELP_WIDGET_SCRIPT", "");
    $provide.service("userState", function() {
      return {};
    });
    $provide.service("userAuthFactory", function() {
      return {};
    });
  }));

  beforeEach(function() {
    inject(function($injector, _$rootScope_) {
      $timeout = $injector.get("$timeout");
      $window = $injector.get("$window");
      factory = $injector.get("helpWidgetFactory");

      $window._elev = {
        on: sandbox.stub(),
        setSettings: sandbox.stub(),
        openHome: sandbox.stub(),
      };

      $window.open = sandbox.stub();
    });
  });

  afterEach(function () {
    sandbox.restore();
  });

  it("should exist", function() {
    expect(factory.initializeWidget).to.be.a("function");
    expect(factory.showWidgetButton).to.be.a("function");
    expect(factory.hideWidgetButton).to.be.a("function");
    expect(factory.showHelpWidget).to.be.a("function");
  });

  describe("initializeWidget:", function() {
    var element;

    beforeEach(function() {
      element = $window.document.createElement('script');
      element.innerText = "ToBeChanged";

      sandbox.stub($window.document,"createElement", function() {
        return element;
      });
    });

    afterEach(function() {
      $window.document.createElement.restore();
    });

    it("should run the script and initialize widget settings", function() {
      factory.initializeWidget();

      $window.document.createElement.should.have.been.calledWith('script');
      expect(element.innerText).to.equal("");
      $window._elev.on.should.have.been.calledWith('load');
    });

    it("should initialize the widget only once", function() {
      factory.initializeWidget();
      $window.document.createElement.should.have.been.calledWith('script');
      $window._elev.on.should.have.been.calledWith('load');

      $window.document.createElement.reset();
      $window._elev.on.reset();

      factory.initializeWidget();
      $window.document.createElement.should.not.have.been.called;
      $window._elev.on.should.not.have.been.called;
    });
  });

  describe("showWidgetButton:", function() {
    it("should change settings to show help widget button", function() {
      factory.showWidgetButton();
      $window._elev.setSettings.should.have.been.calledWith({hideLauncher: false});
    });
  });

  describe("hideWidgetButton:", function() {
    it("should change settings to hide help widget button", function() {
      factory.hideWidgetButton();
      $window._elev.setSettings.should.have.been.calledWith({hideLauncher: true});
    });
  });

  describe("showHelpWidget:helpFallback", function() {
    var element;

    beforeEach(function() {
      element = $window.document.createElement('script');
      element.innerText = "ToBeChanged";

      sandbox.stub($window.document,"createElement", function() {
        return element;
      });
    });

    afterEach(function() {
      $window.document.createElement.restore();
    });

    it("should open help widget and not open failback help screen if help script was loaded", function(done) {
      factory.initializeWidget();
      $window._elev.on.should.have.been.calledWith('load');

      var loadCallback = $window._elev.on.getCall(0).args[1];
      expect(loadCallback).to.be.a("function");

      // simulating that the script loads and the load callback is called
      loadCallback($window._elev)
      $window._elev.setSettings.should.have.been.calledWith({hideLauncher: true});

      factory.showHelpWidget();
      $window._elev.openHome.should.have.been.called;

      $timeout.flush(2000);
      setTimeout(function() {
        $window.open.should.not.have.been.called;

        done();
      }, 10);
    });

    it("should not open help widget and open failback help screen if help script was not loaded", function(done) {
      factory.initializeWidget();
      $window._elev.on.should.have.been.calledWith('load');
      $window._elev.setSettings.should.not.have.been.called;

      factory.showHelpWidget();
      $window._elev.openHome.should.not.have.been.called;

      $timeout.flush(2000);
      setTimeout(function() {
        $window.open.should.have.been.calledWith('https://help.risevision.com/', '_blank');

        done();
      }, 10);
    });
  });
});
