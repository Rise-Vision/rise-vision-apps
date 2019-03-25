'use strict';

describe('directive: TemplateAttributeEditor', function() {
  var $scope,
      element,
      factory,
      timeout;

  beforeEach(function() {
    factory = {};
  });

  beforeEach(module('risevision.template-editor.directives'));
  beforeEach(module('risevision.template-editor.controllers'));
  beforeEach(module('risevision.template-editor.services'));
  beforeEach(module('risevision.editor.services'));
  beforeEach(module(mockTranlate()));
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
        hide: sinon.stub()
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
        hide: function() {}
      },
      show: sinon.stub()
    };

    var component = {
      type: 'rise-test'
    }

    $scope.registerDirective(directive);
    $scope.editComponent(component);

    expect(factory.selected).to.deep.equal(component);
    expect(directive.show).to.have.been.called;

    expect($scope.showAttributeList).to.be.true;

    timeout.flush();
    expect($scope.showAttributeList).to.be.false;
  });

  it('Goes back to list', function() {
    var directive = {
      type: 'rise-test',
      icon: 'fa-test',
      element: {
        hide: sinon.stub()
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
        hide: sinon.stub()
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
        hide: sinon.stub()
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
        hide: sinon.stub()
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
        hide: sinon.stub()
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
        hide: sinon.stub()
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
        hide: sinon.stub()
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

});
