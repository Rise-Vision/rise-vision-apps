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
      expect($scope.messageToShow).to.be.undefined;
      expect($scope.dismissMessage).to.be.a('function');
    });

  });

  describe('messageToShow:', function() {
    it('should resolve to message from inAppMessagesFactory',function(done) {
      compileDirective();
      setTimeout(function(){
        expect($scope.messageToShow).to.equal('message');
        done()
      },10);      
    });

    it('should remain undefined if inAppMessagesFactory rejects',function(done) {
      inAppMessagesFactory.pickMessage.returns(Q.reject())
      compileDirective();
      setTimeout(function(){
        expect($scope.messageToShow).to.be.undefined;
        done()
      },10);      
    });

  });

  describe('dismissMessage:',function() {
    beforeEach(compileDirective);

    it('should clear messageToShow', function(done) {
      setTimeout(function(){
        expect($scope.messageToShow).to.equal('message');
        $scope.dismissMessage();

        expect($scope.messageToShow).to.be.undefined;

        done()
      },10);  
    });

    it('should call inAppMessagesFactory', function() {
      $scope.dismissMessage();

      expect(inAppMessagesFactory.dismissMessage).to.have.been.called;
    });
  });

});
