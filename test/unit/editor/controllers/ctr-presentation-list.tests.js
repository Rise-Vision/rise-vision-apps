'use strict';
describe('controller: Presentation List', function() {
  beforeEach(module('risevision.editor.controllers'));
  beforeEach(module('risevision.editor.services'));
  beforeEach(module('risevision.template-editor.services'));
  beforeEach(module(mockTranlate()));
  beforeEach(module(function ($provide) {
    $provide.service('ScrollingListService', function() {
      return function() {
        return {
          search: {},
          loadingItems: false
        };
      };
    });
    $provide.service('presentation', function() {
      return {};
    });
    $provide.service('editorFactory', function() {
      return {
      };
    });
    $provide.service('$loading',function(){
      return {
        start : function(spinnerKeys){
          return;
        },
        stop : function(spinnerKeys){
          return;
        }
      }
    });
    $provide.value('translateFilter', function(){
      return function(key){
        return key;
      };
    });
    $provide.service('$state', function() {
      return {
        go: sinon.stub()
      };
    });
  }));
  var $scope, $loading, $loadingStartSpy, $loadingStopSpy, HTML_PRESENTATION_TYPE;
  beforeEach(function(){

    inject(function($injector,$rootScope, $controller){
      $scope = $rootScope.$new();
      $scope.listLimit = 5;
      $loading = $injector.get('$loading');
      HTML_PRESENTATION_TYPE = $injector.get('HTML_PRESENTATION_TYPE');
      $loadingStartSpy = sinon.spy($loading, 'start');
      $loadingStopSpy = sinon.spy($loading, 'stop');
      $controller('PresentationListController', {
        $scope : $scope,
        ScrollingListService: $injector.get('ScrollingListService'),

        $loading: $loading
      });
      $scope.$digest();
    });
  });

  it('should exist',function(){
    expect($scope).to.be.ok;
    
    expect($scope.factory).to.be.ok;
    expect($scope.factory.loadingItems).to.be.false;
    expect($scope.search).to.be.ok;
    expect($scope.filterConfig).to.be.ok;
    expect($scope.presentationTracker).to.be.ok;
    
  });
  
  it('should init the scope objects',function(){
    expect($scope.search).to.be.ok;
    expect($scope.search).to.have.property('sortBy');
    expect($scope.search).to.have.property('reverse');
    expect($scope.search.count).to.equal(5);
  });

  it('should attach presentation list to editorFactory',function(){
    expect($scope.editorFactory.presentations).to.be.ok;
  });
  
  describe('$loading: ', function() {
    it('should stop spinner', function() {
      $loadingStopSpy.should.have.been.calledWith('presentation-list-loader');
    });
    
    it('should start spinner', function(done) {
      $scope.factory.loadingItems = true;
      $scope.$digest();
      setTimeout(function() {
        $loadingStartSpy.should.have.been.calledWith('presentation-list-loader');
        
        done();
      }, 10);
    });
  });

  describe('getEditorLink: ', function() {
    it('should get Classic Presentation link', function() {
      var link = $scope.getEditorLink({ id: 'test-id' });

      expect(link).to.equal('apps.editor.workspace.artboard({ presentationId: presentation.id })');
    });

    it('should get HTML Presentation link', function() {
      var link = $scope.getEditorLink({ id: 'test-id', presentationType: HTML_PRESENTATION_TYPE });

      expect(link).to.equal('apps.editor.templates.edit({ presentationId: presentation.id })');
    });
  });

});
