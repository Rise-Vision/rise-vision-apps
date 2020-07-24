'use strict';

describe('directive: stretchy input', function() {
  var element, $rootScope, $scope, $window, $timeout;

  beforeEach(module('risevision.apps.directives'));

  beforeEach(inject(function($injector, $compile, _$rootScope_, $templateCache){
    $rootScope = _$rootScope_;
    $window = $injector.get('$window');
    $timeout = $injector.get('$timeout');

    $window.Stretchy = {
      resize: sinon.spy()
    };

    $templateCache.put('partials/common/stretchy-input.html', '<input type="text" ng-model="ngModel" class="input-stretchy">');

    $rootScope.inputValue = 'presentationName';
    element = $compile('<stretchy-input ng-model="inputValue"></stretchy-input>')($rootScope.$new());
    $rootScope.$digest();
    $scope = element.isolateScope();
  }));

  it('should exist', function() {
    expect($scope).to.be.ok;

    expect($scope.isEditingInput).to.be.false;
    expect($scope.ngModel).to.equal('presentationName');
    expect($scope.defaultInputValue).to.equal('presentationName');
    expect($scope.defaultInputWidth).to.equal('');

    expect($scope.onInputBlur).to.be.a('function');
    expect($scope.inputKeyDown).to.be.a('function');
  });

  it('should render content', function() {
    expect(element.html()).to.equal('<input type="text" ng-model="ngModel" class="input-stretchy ng-pristine ng-untouched ng-valid ng-not-empty">');
  });

  describe('Stretchy initialization', function() {
    var getPropertyValueSpy;

    beforeEach(function() {
      getPropertyValueSpy = sinon.stub().returns('computedWidth');
      sinon.stub($window, 'getComputedStyle').returns({
        getPropertyValue: getPropertyValueSpy
      });

      $timeout.flush();
    });

    afterEach(function() {
      window.getComputedStyle.restore();
    });

    it('should initialize on load', function() {
      $window.Stretchy.resize.should.have.been.called;

      expect($scope.defaultInputWidth).to.equal('computedWidth')
    });
  });

  it('onInputBlur:', function() {
    $scope.isEditingInput = true;

    $scope.onInputBlur();

    expect($scope.isEditingInput).to.be.false;
  });

  describe('isEditingInput:', function() {
    xit('should focus on field if editing', function() {
      var stretchyInputElement = element.find('input.input-stretchy');

      $scope.isEditingInput = true;
      $scope.$digest();

      expect(stretchyInputElement.is(":focus")).to.be.true;
    });

    it('should reset value if value is empty, and ignore whitespace', function() {
      var stretchyInputElement = element.find('input.input-stretchy');

      $scope.defaultInputWidth = '20px';
      $rootScope.inputValue = '';
      $scope.ngModel = '   ';
      $scope.$digest();

      // set watch with falsey value
      $scope.isEditingInput = 0;
      $scope.$digest();

      expect(stretchyInputElement[0].value).to.equal('presentationName');
      expect(stretchyInputElement[0].style.width).to.equal('20px');

      expect($scope.ngModel).to.equal('presentationName');
    });

  });

  describe('inputKeyDown:', function() {
    it('should reset editing on enter', function() {
      var keyEvent = {
        which: 13,
        preventDefault: sinon.spy()
      };

      $scope.isEditingInput = true;

      $scope.inputKeyDown(keyEvent);

      $scope.isEditingInput = false;
      keyEvent.preventDefault.should.have.been.called;
    });

    it('should not reset editing on other keys', function() {
      var keyEvent = {
        which: 23,
        preventDefault: sinon.spy()
      };

      $scope.isEditingInput = true;

      $scope.inputKeyDown(keyEvent);

      $scope.isEditingInput = true;
      keyEvent.preventDefault.should.not.have.been.called;
    });
  });

});
