'use strict';

describe('directive: toolbar', function() {
  var element, $scope, $window, $timeout, $modal, $modalInstanceDismissSpy, templateEditorFactory;

  beforeEach(module('risevision.template-editor.directives'));
  beforeEach(module(mockTranslate()));

  beforeEach(module(function ($provide) {
    $provide.service('templateEditorFactory', function() {
      return {
        presentation: {
          name: 'presentationName'
        },
        deletePresentation: sinon.spy()
      };
    });
    $provide.service('$modal',function(){
      $modalInstanceDismissSpy = sinon.spy()
      return {
        open : sinon.stub().returns({
          result: Q.resolve(),
          dismiss: $modalInstanceDismissSpy
        })
      };
    });
  }));

  beforeEach(inject(function($injector, $compile, $rootScope, $templateCache){
    $window = $injector.get('$window');
    $timeout = $injector.get('$timeout');
    $modal = $injector.get('$modal');
    templateEditorFactory = $injector.get('templateEditorFactory');

    $window.Stretchy = {
      resize: sinon.spy()
    };

    $templateCache.put('partials/template-editor/toolbar.html', '<form><input type="text" ng-model="presentationName" class="presentation-name"></form>');
    $templateCache.put('partials/template-editor/confirm-modal.html', '<p>modal</p>');

    $scope = $rootScope.$new();
    $scope.presentationName = 'presentationName';
    element = $compile('<template-editor-toolbar></template-editor-toolbar>')($scope);
    $scope.$digest();
  }));

  it('should exist', function() {
    expect($scope).to.be.ok;
    expect($scope.factory).to.be.ok;

    expect($scope.isEditingName).to.be.false;
    expect($scope.defaultNameValue).to.equal('presentationName');
    expect($scope.defaultNameWidth).to.equal('');

    expect($scope.onPresentationNameBlur).to.be.a('function');
    expect($scope.confirmDelete).to.be.a('function');
    expect($scope.presentationNameKeyUp).to.be.a('function');
  });

  it('should render content', function() {
    expect(element.html()).to.equal('<form class="ng-pristine ng-valid"><input type="text" ng-model="presentationName" class="presentation-name ng-pristine ng-untouched ng-valid ng-not-empty"></form>');
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

      expect($scope.defaultNameWidth).to.equal('computedWidth')
    });
  });

  it('onPresentationNameBlur:', function() {
    $scope.isEditingName = true;

    $scope.onPresentationNameBlur();

    expect($scope.isEditingName).to.be.false;
  });

  describe('isEditingName:', function() {
    xit('should focus on field if editing', function() {
      var templateNameInput = element.find('input.presentation-name');

      $scope.isEditingName = true;
      $scope.$digest();

      expect(templateNameInput.is(":focus")).to.be.true;
    });

    it('should reset name if value is empty, and ignore whitespace', function() {
      var templateNameInput = element.find('input.presentation-name');

      $scope.defaultNameWidth = '20px';
      templateEditorFactory.presentation.name = '';
      $scope.presentationName = '   ';
      $scope.$digest();

      // set watch with falsey value
      $scope.isEditingName = 0;
      $scope.$digest();

      expect(templateEditorFactory.presentation.name).to.equal('presentationName');
      expect(templateNameInput[0].style.width).to.equal('20px');
    });

  });

  describe('presentationNameKeyUp:', function() {
    it('should reset editing on enter', function() {
      $scope.isEditingName = true;

      $scope.presentationNameKeyUp({
        which: 13
      });

      $scope.isEditingName = false;
    });

    it('should not reset editing on other keys', function() {
      $scope.isEditingName = true;

      $scope.presentationNameKeyUp({
        which: 23
      });

      $scope.isEditingName = true;
    });
  });

  describe('confirmDelete:', function() {
    it('should open modal to confirm',function(){
      $scope.confirmDelete();

      $modal.open.should.have.been.calledWith({
        template: sinon.match.string,
        controller: 'confirmModalController',
        windowClass: 'primary-btn-danger madero-style centered-modal',
        resolve: sinon.match.object
      });

      var resolve = $modal.open.getCall(0).args[0].resolve;
      
      expect(resolve.confirmationTitle()).to.be.a('string');
      expect(resolve.confirmationButton()).to.be.a('string');
      expect(resolve.confirmationMessage).to.be.null;
      expect(resolve.cancelButton).to.be.null;

    });

    it('should dismiss modal and delete on confirm',function(done){
      $scope.confirmDelete();

      setTimeout(function() {
        $modalInstanceDismissSpy.should.have.been.called;
        templateEditorFactory.deletePresentation.should.have.been.called;

        done();
      }, 10);
    });

  });

});
