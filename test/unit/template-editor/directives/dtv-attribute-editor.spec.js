'use strict';

describe('directive: TemplateAttributeEditor', function() {
  var $scope,
      element,
      componentsFactory,
      $window,
      sandbox = sinon.sandbox.create();

  beforeEach(module('risevision.template-editor.directives'));
  beforeEach(module(function ($provide) {
    $provide.service('componentsFactory', function() {
      return {
        reset: sandbox.stub()
      };
    });

    var elementStub = {
      hide: sandbox.stub(),
      show: sandbox.stub(),
      addClass: sandbox.stub(),
      removeClass: sandbox.stub()
    };

  }));

  beforeEach(inject(function($compile, $rootScope, $templateCache, $injector){
    $window = $injector.get('$window');

    componentsFactory = $injector.get('componentsFactory');

    sandbox.spy($window, 'addEventListener');
    sandbox.spy($window, 'removeEventListener');

    $templateCache.put('partials/template-editor/attribute-editor.html', '<p>mock</p>');
    element = $compile("<template-attribute-editor></template-attribute-editor>")($rootScope.$new());

    $rootScope.$digest();

    $scope = element.isolateScope();
  }));

  afterEach(function () {
    sandbox.restore();
  });

  it('should exist', function() {
    expect($scope).to.be.ok;
    expect($scope.componentsFactory).to.be.ok;
    
    componentsFactory.reset.should.have.been.called;
  });

  it('Replaces the element with the appropriate content', function() {
    expect(element.html()).to.equal('<p>mock</p>');
  });

  it('Handles message from templates', function() {
    sinon.assert.calledWith($window.addEventListener, 'message');
  });

  it('Clears window event listener when element is destroyed', function() {
    element.remove();
    sinon.assert.calledWith($window.removeEventListener, 'message');
  });

});
