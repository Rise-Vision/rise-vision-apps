'use strict';
describe('directive: in-app-messages', function() {
  var sandbox = sinon.sandbox.create();
  var $compile,
      $rootScope,
      $scope,
      element,
      inAppMessagesFactory;
  beforeEach(module('risevision.apps.directives'));
  beforeEach(module(function ($provide) {
    $provide.service('inAppMessagesFactory', function() {
      return {
        pickMessage: sandbox.stub().returns(Q.resolve('message')),
        dismissMessage: sandbox.stub()
      };
    });  
  }));
  beforeEach(inject(function(_$compile_, _$rootScope_, $templateCache, $injector){
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    inAppMessagesFactory = $injector.get('inAppMessagesFactory');
    $templateCache.put('partials/common/in-app-messages.html', '<p>mock</p>');
  }));

  afterEach(function() {
    sandbox.restore();
  });

  function compileDirective() {
    element = $compile('<in-app-messages></in-app-messages>')($rootScope.$new());
    $rootScope.$digest();
    $scope = element.isolateScope();   
  }

  describe('initialization', function() {
    beforeEach(compileDirective);

    it('should compile', function() {
      expect(element[0].outerHTML).to.equal('<in-app-messages class="ng-scope ng-isolate-scope"><p>mock</p></in-app-messages>');
    });

    it('should initialize scope', function() {
      expect($scope.inAppMessagesFactory).to.be.ok;
    });

    it('should request a new message', function() {
      expect(inAppMessagesFactory.pickMessage).to.have.been.called;
    });

  });

});
