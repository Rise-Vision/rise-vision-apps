'use strict';

describe('directive: TemplateAttributeEditor', function() {
  var $scope,
      element,
      factory,
      timeout,
      $window,
      blueprintFactory,
      sandbox = sinon.sandbox.create();

  beforeEach(function() {
    factory = {};
  });

  beforeEach(module('risevision.template-editor.directives'));
  beforeEach(module('risevision.template-editor.controllers'));
  beforeEach(module('risevision.template-editor.services'));
  beforeEach(module('risevision.editor.services'));
  beforeEach(module(mockTranslate()));
  beforeEach(module(function ($provide) {
    $provide.service('templateEditorFactory', function() {
      return factory;
    });

    blueprintFactory = {};

    $provide.service('blueprintFactory', function() {
      return blueprintFactory;
    });
  }));

  beforeEach(inject(function($compile, $rootScope, $templateCache, $timeout, $injector){
    $window = $injector.get('$window');
    sandbox.spy($window, 'addEventListener');
    sandbox.spy($window, 'removeEventListener');

    $templateCache.put('partials/template-editor/attribute-editor.html', '<p>mock</p>');
    $scope = $rootScope.$new();
    timeout = $timeout
    element = $compile("<template-attribute-editor></template-attribute-editor>")($scope);
    $scope.$digest();
  }));

  afterEach(function () {
    sandbox.restore();
  });

  it('should exist', function() {
    expect($scope).to.be.ok;
    expect($scope.factory).to.be.ok;
  });

  it('should show the attribute list', function() {
    expect($scope.showAttributeList).to.be.true;
  });

  it('should have empty directives', function() {
    expect($scope.directives).to.deep.equal({});
  });

  it('Replaces the element with the appropriate content', function() {
    expect(element.html()).to.equal('<p>mock</p>');
  });

  it('Defines component directive registry functions', function() {
    expect($scope.registerDirective).to.be.a('function');
    expect($scope.editComponent).to.be.a('function');
    expect($scope.onBackButton).to.be.a('function');
    expect($scope.backToList).to.be.a('function');
    expect($scope.getComponentIcon).to.be.a('function');
  });

  it('Handles message from templates', function() {
    sinon.assert.calledWith($window.addEventListener, 'message');
  });

  it('Clears window event listener when element is destroyed', function() {
    element.remove();
    sinon.assert.calledWith($window.removeEventListener, 'message');
  });

  it('Registers a directive', function() {
    var directive = {
      type: 'rise-test',
      icon: 'fa-test',
      element: {
        hide: sandbox.stub()
      },
      show: function() {}
    };

    $scope.registerDirective(directive);

    expect($scope.directives["rise-test"]).to.be.ok;
    expect($scope.directives["rise-test"].type).to.equal("rise-test");

    expect(directive.element.hide).to.have.been.called;
  });

  it('Edits a component', function() {
    var directive = {
      type: 'rise-test',
      icon: 'fa-test',
      element: {
        hide: function() {},
        show: sandbox.stub()
      },
      show: sandbox.stub()
    };

    var component = {
      type: 'rise-test'
    }

    $scope.registerDirective(directive);
    $scope.editComponent(component);

    expect(factory.selected).to.deep.equal(component);

    expect(directive.element.show).to.have.been.called;
    expect(directive.show).to.have.been.called;

    expect($scope.showAttributeList).to.be.true;

    timeout.flush();
    expect($scope.showAttributeList).to.be.false;
  });

  it('Edits a highlighted component', function() {
    var directive = {
      type: 'rise-test',
      icon: 'fa-test',
      element: {
        hide: function() {},
        show: sandbox.stub()
      },
      show: sandbox.stub()
    };

    var component = {
      id: 'test',
      type: 'rise-test'
    }

    blueprintFactory.blueprintData = {
      components: [component]
    };

    $scope.registerDirective(directive);
    $scope.editHighlightedComponent(component.id);

    expect(factory.selected).to.deep.equal(component);

    expect(directive.element.show).to.have.been.called;
    expect(directive.show).to.have.been.called;

    expect($scope.showAttributeList).to.be.true;

    timeout.flush();
    expect($scope.showAttributeList).to.be.false;
  });

  it('Resets selected pages when editing a highlighted component', function() {
    var directive = {
      type: 'rise-test',
      icon: 'fa-test',
      element: {
        hide: function() {},
        show: sandbox.stub()
      },
      show: sandbox.stub()
    };

    var component = {
      id: 'test',
      type: 'rise-test'
    }
    
    $scope.registerDirective(directive);

    blueprintFactory.blueprintData = {
      components: [component]
    };

    factory.selected = component;
    $scope.pages = [{}, {}, {}];
    $scope.setPanelIcon('previous-icon', 'streamline');
    $scope.setPanelTitle('Previous Title');
    
    $scope.editHighlightedComponent(component.id);

    expect(factory.selected).to.deep.equal(component);

    expect($scope.pages).to.have.length(1);
    expect($scope.pages[0]).to.equal(directive)
    expect($scope.panelIcon).to.be.null;
    expect($scope.panelIconType).to.be.null;
    expect($scope.panelTitle).to.be.null;

    expect(directive.element.show).to.have.been.called;
    expect(directive.show).to.have.been.called;

    expect($scope.showAttributeList).to.be.true;

    timeout.flush();
    expect($scope.showAttributeList).to.be.false;
  });

  it('Runs the open presentation handler', function() {
    var directive = {
      type: 'rise-test',
      icon: 'fa-test',
      element: {
        hide: function() {},
        show: function() {}
      },
      onPresentationOpen: sandbox.stub()
    };

    $scope.registerDirective(directive);

    expect(directive.onPresentationOpen).to.have.been.called;
  });

  it('Goes back to list', function() {
    var directive = {
      type: 'rise-test',
      icon: 'fa-test',
      element: {
        hide: sandbox.stub(),
        show: function() {}
      },
      show: function() {}
    };

    var component = {
      type: 'rise-test'
    }

    $scope.registerDirective(directive);
    $scope.editComponent(component);
    timeout.flush();

    $scope.backToList();

    expect(factory.selected).to.be.null;
    expect(directive.element.hide).to.have.been.called.twice;

    expect($scope.showAttributeList).to.be.false;

    timeout.flush();
    expect($scope.showAttributeList).to.be.true;
  });

  it('Goes back to list if there is no back handler', function() {
    var directive = {
      type: 'rise-test',
      icon: 'fa-test',
      element: {
        hide: sandbox.stub(),
        show: function() {}
      },
      show: function() {}
    };

    var component = {
      type: 'rise-test'
    }

    $scope.highlightComponent = sandbox.stub();
    $scope.registerDirective(directive);
    $scope.editComponent(component);
    timeout.flush();

    $scope.onBackButton();

    expect(factory.selected).to.be.null;
    expect(directive.element.hide).to.have.been.called.twice;
    expect($scope.highlightComponent).to.have.been.called.once;

    expect($scope.showAttributeList).to.be.false;

    timeout.flush();
    expect($scope.showAttributeList).to.be.true;
  });

  it('Goes back to list if back handler returns false', function() {
    var directive = {
      type: 'rise-test',
      icon: 'fa-test',
      element: {
        hide: sandbox.stub(),
        show: function() {}
      },
      show: function() {},
      onBackHandler: function() { return false; }
    };

    var component = {
      type: 'rise-test'
    }

    $scope.highlightComponent = sandbox.stub();
    $scope.registerDirective(directive);
    $scope.editComponent(component);
    timeout.flush();

    $scope.onBackButton();

    expect(factory.selected).to.be.null;
    expect(directive.element.hide).to.have.been.called.twice;
    expect($scope.highlightComponent).to.have.been.called.once;

    expect($scope.showAttributeList).to.be.false;

    timeout.flush();
    expect($scope.showAttributeList).to.be.true;
  });

  it('Does not go back to list if back handler returns true', function() {
    var directive = {
      type: 'rise-test',
      icon: 'fa-test',
      element: {
        hide: sandbox.stub(),
        show: function() {}
      },
      show: function() {},
      onBackHandler: function() { return true; }
    };

    var component = {
      type: 'rise-test'
    }

    $scope.highlightComponent = sandbox.stub();
    $scope.registerDirective(directive);
    $scope.editComponent(component);
    timeout.flush();

    $scope.onBackButton();

    expect(factory.selected).to.not.be.null;
    expect(directive.element.hide).to.have.been.called.once;
    expect($scope.highlightComponent).to.have.been.called.once;
    expect($scope.showAttributeList).to.be.false;
  });

  it('Shows header bottom rule if isHeaderBottomRuleVisible is not defined for directive', function() {
    var directive = {
      type: 'rise-test',
      icon: 'fa-test',
      element: {
        hide: sandbox.stub(),
        show: function() {}
      },
      show: function() {},
      onBackHandler: function() { return true; }
    };

    var component = {
      type: 'rise-test'
    }

    $scope.registerDirective(directive);
    $scope.editComponent(component);
    timeout.flush();

    var visible = $scope.isHeaderBottomRuleVisible(component);

    expect(visible).to.be.true;
  });

  it('Shows header bottom rule if isHeaderBottomRuleVisible allows it', function() {
    var directive = {
      type: 'rise-test',
      icon: 'fa-test',
      element: {
        hide: sandbox.stub(),
        show: function() {}
      },
      show: function() {},
      isHeaderBottomRuleVisible: function() { return true; },
      onBackHandler: function() { return true; }
    };

    var component = {
      type: 'rise-test'
    }

    $scope.registerDirective(directive);
    $scope.editComponent(component);
    timeout.flush();

    var visible = $scope.isHeaderBottomRuleVisible(component);

    expect(visible).to.be.true;
  });

  it('Does not show header bottom rule if isHeaderBottomRuleVisible not allows it', function() {
    var directive = {
      type: 'rise-test',
      icon: 'fa-test',
      element: {
        hide: sandbox.stub(),
        show: function() {}
      },
      show: function() {},
      isHeaderBottomRuleVisible: function() { return false; },
      onBackHandler: function() { return true; }
    };

    var component = {
      type: 'rise-test'
    }

    $scope.registerDirective(directive);
    $scope.editComponent(component);
    timeout.flush();

    var visible = $scope.isHeaderBottomRuleVisible(component);

    expect(visible).to.be.false;
  });

  describe('showNextPage', function () {
    it('should show a new page', function () {
      expect($scope.pages).to.have.length(0);

      $scope.showNextPage('selector1');

      expect($scope.pages).to.have.length(1);
      expect($scope.pages[0]).to.equal('selector1');
    });

    it('should show a second page', function () {
      $scope.showNextPage('selector1');
      $scope.showNextPage('selector2');

      expect($scope.pages).to.deep.equal(['selector1', 'selector2']);
    });
  });

  describe('showPreviousPage', function () {
    it('should hide the first page', function () {
      $scope.showNextPage('selector1');

      expect($scope.showPreviousPage()).to.be.false;

      expect($scope.pages).to.have.length(0);
    });

    it('should hide the second page', function () {
      $scope.showNextPage('selector1');
      $scope.showNextPage('selector2');

      expect($scope.showPreviousPage()).to.be.true;

      expect($scope.pages).to.deep.equal(['selector1']);
    });
  });
});
