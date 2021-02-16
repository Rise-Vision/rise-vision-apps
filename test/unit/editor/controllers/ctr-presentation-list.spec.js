'use strict';
describe('controller: Presentation List', function() {
  beforeEach(module('risevision.editor.controllers'));
  beforeEach(module('risevision.editor.services'));
  beforeEach(module('risevision.template-editor.directives'));
  beforeEach(module('risevision.template-editor.services'));
  beforeEach(module(mockTranslate()));
  beforeEach(module(function ($provide) {
    $provide.service('ScrollingListService', function() {
      return sinon.stub().returns({
        search: {},
        loadingItems: false
      });
    });
    $provide.service('presentation', function() {
      return {
        list: 'listService'
      };
    });
    $provide.service('editorFactory', function() {
      return {
        deletePresentationByObject: sinon.stub().returns('delete')
      };
    });
    $provide.service('templateEditorFactory', function() {
      return {};
    });
    $provide.service('$loading',function(){
      return {
        start : sinon.spy(),
        stop : sinon.spy()
      }
    });
    $provide.value('translateFilter', function(){
      return function(key){
        return key;
      };
    });
    $provide.service('presentationUtils', function() {
      return {
        isHtmlPresentation: sinon.stub()
      };
    });
    $provide.value('PRESENTATION_SEARCH', {
      filter: 'search filter'
    });
  }));
  var $scope, $loading, editorFactory, ScrollingListService;
  beforeEach(function(){

    inject(function($injector,$rootScope, $controller){
      $scope = $rootScope.$new();
      $scope.listLimit = 5;
      $loading = $injector.get('$loading');
      editorFactory = $injector.get('editorFactory');
      ScrollingListService = $injector.get('ScrollingListService');
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

    expect($scope.presentations).to.be.ok;
    expect($scope.presentations.loadingItems).to.be.false;
    expect($scope.search).to.be.ok;
    expect($scope.filterConfig).to.be.ok;
  });

  it('should init the scope objects',function(){
    expect($scope.search).to.be.ok;
    expect($scope.search).to.have.property('sortBy');
    expect($scope.search).to.have.property('reverse');
    expect($scope.search).to.have.property('filter');
    expect($scope.search.count).to.equal(5);
  });

  describe('listOperations:', function() {
    it('should initialize', function() {
      expect($scope.listOperations).to.be.ok;
      expect($scope.listOperations.name).to.equal('Presentation');
      expect($scope.listOperations.operations).to.have.length(1);
      expect($scope.listOperations.operations[0].name).to.equal('Delete');
      expect($scope.listOperations.operations[0].actionCall).to.be.a('function');
      expect($scope.listOperations.operations[0].requireRole).to.equal('cp');
    });

    describe('delete:', function(done) {
      it('should delete presentation on actionCall', function() {
        expect($scope.listOperations.operations[0].actionCall('presentationObject')).to.equal('delete');

        editorFactory.deletePresentationByObject.should.have.been.calledWith('presentationObject', true);
      });

      describe('showActionError:', function() {
        it('should show for 409 errors', function() {
          expect($scope.listOperations.operations[0].showActionError({status: 409})).to.be.true;
        });

        it('should not show for other errors', function() {
          expect($scope.listOperations.operations[0].showActionError()).to.be.false;
          expect($scope.listOperations.operations[0].showActionError({status: 400})).to.be.false;
        });
      });

    });

  });

  it('should init list service', function() {
    ScrollingListService.should.have.been.calledWith('listService', $scope.search, $scope.listOperations);
  });

  describe('$loading: ', function() {
    it('should stop spinner', function() {
      $loading.stop.should.have.been.calledWith('presentation-list-loader');
    });

    it('should start spinner', function(done) {
      $scope.presentations.loadingItems = true;
      $scope.$digest();
      setTimeout(function() {
        $loading.start.should.have.been.calledWith('presentation-list-loader');

        done();
      }, 10);
    });
  });

});
