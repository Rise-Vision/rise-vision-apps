'use strict';

describe('directive: toolbar', function() {
  var element, $scope, ngModalService, templateEditorFactory;

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
    $provide.service('ngModalService',function(){
      return {
        confirmDanger : sinon.stub().resolves()
      };
    });
  }));

  beforeEach(inject(function($injector, $compile, $rootScope, $templateCache){
    ngModalService = $injector.get('ngModalService');
    templateEditorFactory = $injector.get('templateEditorFactory');

    $templateCache.put('partials/template-editor/toolbar.html', '<div></div>');

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

      ngModalService.confirmDanger.should.have.been.calledWith(
        'Are you sure you want to delete this Presentation?',
        null,
        'Delete Forever'
      );
    });

    it('should delete on confirm',function(done){
      $scope.confirmDelete();

      setTimeout(function() {
        templateEditorFactory.deletePresentation.should.have.been.called;

        done();
      }, 10);
    });

  });

});
