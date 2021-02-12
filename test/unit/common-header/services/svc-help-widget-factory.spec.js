"use strict";

describe("Services: helpWidgetFactory", function() {
  var sandbox = sinon.sandbox.create();
  var $window, factory, element;

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
      $window = $injector.get("$window");
      factory = $injector.get("helpWidgetFactory");

      $window._elev = {
        on: sandbox.stub(),
        setSettings: sandbox.stub(),
        openHome: sandbox.stub(),
        openModule: sandbox.stub()
      };

      sandbox.stub($window, 'open');
    });
  });

  afterEach(function () {
    sandbox.restore();
  });

  function stubCreateElement() {
    element = $window.document.createElement('script');
    element.innerText = "ToBeChanged";

    sandbox.stub($window.document,"createElement", function() {
      return element;
    });
  }

  function restoreCreateElement() {
    $window.document.createElement.restore();
  }

  function loadHelpScript() {
    factory.initializeWidget();
    $window._elev.on.should.have.been.calledWith('load');

    var loadCallback = $window._elev.on.getCall(0).args[1];
    expect(loadCallback).to.be.a("function");

    // simulating that the script loads and the load callback is called
    loadCallback($window._elev)
    $window._elev.setSettings.should.have.been.calledWith({hideLauncher: true});
  }

  it("should exist", function() {
    expect(factory.initializeWidget).to.be.a("function");
    expect(factory.showWidgetButton).to.be.a("function");
    expect(factory.hideWidgetButton).to.be.a("function");
    expect(factory.showHelpWidget).to.be.a("function");
  });

  describe("initializeWidget:", function() {

    beforeEach(function() {
      stubCreateElement();
    });

    afterEach(function() {
      restoreCreateElement();
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

  describe("showHelpWidget:", function() {

    beforeEach(function() {
      stubCreateElement();
    });

    afterEach(function() {
      restoreCreateElement();
    });

    it("should open help widget and not open failback help screen if help script was loaded", function() {
      loadHelpScript();

      factory.showHelpWidget();
      $window._elev.openHome.should.have.been.called;
      $window.open.should.not.have.been.called;
    });

    it("should not open help widget and open failback help screen if help script was not loaded", function() {
      factory.initializeWidget();
      $window._elev.on.should.have.been.calledWith('load');
      $window._elev.setSettings.should.not.have.been.called;

      factory.showHelpWidget();
      $window._elev.openHome.should.not.have.been.called;
      $window.open.should.have.been.calledWith('https://help.risevision.com/', '_blank');
    });
  });

  describe("showContactUs:", function() {

    beforeEach(function() {
      stubCreateElement();
    });

    afterEach(function() {
      restoreCreateElement();
    });

    it("should open help widget on Create Ticket module if help script is loaded", function() {
      loadHelpScript();

      factory.showContactUs();
      $window._elev.openHome.should.have.been.called;
      $window._elev.openModule.should.have.been.calledWith('2');

      $window.open.should.not.have.been.called;
    });

    it("should not open Create Ticket and open failback help screen if script was not loaded", function() {
      factory.initializeWidget();
      $window._elev.on.should.have.been.calledWith('load');
      $window._elev.setSettings.should.not.have.been.called;

      factory.showContactUs();
      $window._elev.openHome.should.not.have.been.called;
      $window._elev.openModule.should.not.have.been.called;

      $window.open.should.have.been.calledWith('https://help.risevision.com/', '_blank');
    });
  });
});
