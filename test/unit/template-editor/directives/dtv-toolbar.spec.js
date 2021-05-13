'use strict';

describe('directive: toolbar', function() {
  var element, $scope, $modal, $modalInstanceDismissSpy, templateEditorFactory;

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
    $modal = $injector.get('$modal');
    templateEditorFactory = $injector.get('templateEditorFactory');

    $templateCache.put('partials/template-editor/toolbar.html', '<div></div>');
    $templateCache.put('partials/components/confirm-modal/madero-confirm-danger-modal.html', '<p>modal</p>');

    $scope = $rootScope.$new();
    $scope.presentationName = 'presentationName';
    element = $compile('<template-editor-toolbar></template-editor-toolbar>')($scope);
    $scope.$digest();
  }));

  it('should exist', function() {
    expect($scope).to.be.ok;
    expect($scope.templateEditorFactory).to.be.ok;

    expect($scope.confirmDelete).to.be.a('function');
  });

  it('should render content', function() {
    expect(element.html()).to.equal('<div></div>');
  });

  describe('confirmDelete:', function() {
    it('should open modal to confirm',function(){
      $scope.confirmDelete();

      $modal.open.should.have.been.calledWith({
        template: sinon.match.string,
        controller: 'confirmModalController',
        windowClass: 'madero-style centered-modal',
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
