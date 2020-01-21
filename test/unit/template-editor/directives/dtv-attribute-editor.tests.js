'use strict';

describe('directive: TemplateAttributeEditor', function() {
  var $scope,
      element,
      factory,
      timeout,
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
  }));

  beforeEach(inject(function($compile, $rootScope, $templateCache, $timeout){
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

    $scope.registerDirective(directive);
    $scope.editComponent(component);
    timeout.flush();

    $scope.onBackButton();

    expect(factory.selected).to.be.null;
    expect(directive.element.hide).to.have.been.called.twice;

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

    $scope.registerDirective(directive);
    $scope.editComponent(component);
    timeout.flush();

    $scope.onBackButton();

    expect(factory.selected).to.be.null;
    expect(directive.element.hide).to.have.been.called.twice;

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

    $scope.registerDirective(directive);
    $scope.editComponent(component);
    timeout.flush();

    $scope.onBackButton();

    expect(factory.selected).to.not.be.null;
    expect(directive.element.hide).to.have.been.called.once;
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

  describe('showNextPanel', function () {
    it('should show a new panel', function () {
      expect($scope.panels).to.have.length(0);

      $scope.showNextPanel('selector1');

      expect($scope.panels).to.have.length(1);
      expect($scope.panels[0]).to.equal('selector1');
    });

    it('should show a second panel', function () {
      $scope.showNextPanel('selector1');
      $scope.showNextPanel('selector2');

      expect($scope.panels).to.deep.equal(['selector1', 'selector2']);
    });
  });

  describe('showPreviousPanel', function () {
    it('should hide the first panel', function () {
      $scope.showNextPanel('selector1');

      expect($scope.showPreviousPanel()).to.be.false;

      expect($scope.panels).to.have.length(0);
    });

    it('should hide the second panel', function () {
      $scope.showNextPanel('selector1');
      $scope.showNextPanel('selector2');

      expect($scope.showPreviousPanel()).to.be.true;

      expect($scope.panels).to.deep.equal(['selector1']);
    });
  });
});
