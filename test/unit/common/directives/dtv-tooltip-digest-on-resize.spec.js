'use strict';
describe('directive: tooltip-digest-on-resize', function() {
  var $scope,
    element,
    $window,
    sandbox = sinon.sandbox.create();

  beforeEach(module('risevision.apps.directives'));

  beforeEach(inject(function($compile, $rootScope, $injector){
    $scope = $rootScope.$new();

    $window = $injector.get('$window');
    var $document = $injector.get('$document');
    var $body = angular.element($document[0].body);

    element = $compile('<div tooltip-digest-on-resize></div>')($scope);

    $body.append(element);

    $scope = element.scope();
    $scope.$digest();

    sinon.spy($scope, '$digest');
  }));

  afterEach(function () {
    element.remove();

    sandbox.restore();
  });

  it('should initialize', function() {
    expect($scope).to.be.ok;
  });

  it('should compile', function() {
    expect(element[0].outerHTML).to.equal('<div tooltip-digest-on-resize="" class="ng-scope"></div>');
  });

  describe('window resize:', function() {
    it('should bind to window resize event on show', function() {
      var windowStub = {
        bind: sandbox.stub()
      };
      sandbox.stub(angular,'element').returns(windowStub);

      element.trigger('show');

      windowStub.bind.should.have.been.calledWith('resize');
    });

    it('should unbind from window resize on hide', function() {
      var windowStub = {
        unbind: sandbox.stub()
      };
      sandbox.stub(angular,'element').returns(windowStub);

      element.trigger('hide');

      windowStub.unbind.should.have.been.calledWith('resize');
    });

    it('should trigger digest cycle on resize', function() {
      element.trigger('show');

      angular.element($window).trigger('resize');

      $scope.$digest.should.have.been.called;
    });
  });


});
