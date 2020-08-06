"use strict";

describe("Services: helpWidgetFactory", function() {
  var sandbox = sinon.sandbox.create();
  var $window, factory;

  beforeEach(module("risevision.common.support"));

  beforeEach(module(function ($provide) {
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
      };
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

  describe("showHelpWidget:", function() {
    it("should open help widget", function() {
      factory.showHelpWidget();
      $window._elev.openHome.should.have.been.called;
    });
  });
});
