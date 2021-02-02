'use strict';
describe('directive: artboard-presentation', function() {
  var $compile,
      $rootScope,
      widthIncrement,
      heightIncrement,
      $scope,
      presentation,
      editorFactory,
      artboardFactory,
      $stateParams;

  presentation = {
      height: 1080,
      heightUnits: "px",
      width: 1920,
      widthUnits: "px",
      backgroundStyle: "rgb(222, 33, 90)",
      backgroundScaleToFit: true
  };

  beforeEach(module('risevision.editor.services'));
  beforeEach(module('risevision.editor.directives'));
  beforeEach(module(mockTranslate()));
  beforeEach(module(function ($provide) {
    $provide.service('editorFactory', function() {
      return {
        presentation: presentation
      };
    });
    $provide.service('artboardFactory', function() {
      return {
        zoomLevel: 0.5,
        zoomIn: function(){},
        zoomOut: function(){},
        zoomFit: function(){
          artboardFactory.zoomLevel = 0.5;
        }
      };      
    });
  }));

  beforeEach(inject(function(_$compile_, _$rootScope_, $templateCache,
    PRESENTATION_BORDER_SIZE, _$stateParams_, _editorFactory_, _artboardFactory_){
    $templateCache.put('partials/editor/artboard-presentation.html', '<p>mock</p>');
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    $stateParams = _$stateParams_;
    editorFactory = _editorFactory_;
    artboardFactory = _artboardFactory_;
    heightIncrement = 2 * PRESENTATION_BORDER_SIZE;
    widthIncrement = 2 * PRESENTATION_BORDER_SIZE;
    $scope = $rootScope.$new();
  }));

  it('should compile html', function() {
    var element = $compile("<artboard-presentation></artboard-presentation>")($scope);
    $scope.$digest();
    expect(element.html()).to.equal('<p>mock</p>');
  });

  describe('zoom:', function () {
    it('should watch artboardFactory zoomLevel',function() {
      var scopeWatchSpy = sinon.spy($scope, '$watch');
      var element = $compile("<artboard-presentation></artboard-presentation>")($scope);
      $scope.$digest();
      scopeWatchSpy.should.have.been.called;
    });

    it('should scale',function(){
      var element = $compile("<artboard-presentation></artboard-presentation>")($scope);
      $scope.$apply();
      expect(element.css('transform')).to.equal('scale(0.5)');
      expect(element.css('transform-origin')).to.equal('0% 0%');
      expect(element.css('transition')).to.contain('all 0.4s');
    });

    it('should re-scale when zoom changes',function(){
      var element = $compile("<artboard-presentation></artboard-presentation>")($scope);
      $scope.$apply();
      artboardFactory.zoomLevel = 0.1;
      $scope.$apply();
      expect(element.css('transform')).to.equal('scale(0.1)');
      expect(element.css('transform-origin')).to.equal('0% 0%');
    });

    it('should zoom out on mouse wheel+CTRL',function(){
      var zoomOutSpy = sinon.spy(artboardFactory,'zoomOut')
      var element = $compile("<artboard-presentation></artboard-presentation>")($scope);
      $scope.$apply();
      element.triggerHandler({type:'mousewheel', ctrlKey:true,pageX:30,pageY:30, originalEvent: new CustomEvent('dummy',{detail:-130})});
      $scope.$apply();
      zoomOutSpy.should.have.been.called;
    });

    it('should zoom in on mouse wheel+CTRL',function(){
      var zoomInSpy = sinon.spy(artboardFactory,'zoomIn')
      var element = $compile("<artboard-presentation></artboard-presentation>")($scope);
      $scope.$apply();
      element.triggerHandler({type:'mousewheel',ctrlKey:true,pageX:30,pageY:30, originalEvent: new CustomEvent('dummy',{detail:0})});
      $scope.$apply();
      zoomInSpy.should.have.been.called;
    });
  });

  describe('presentation:', function () {
    it('should watch artboardFactory presentation',function(){
      var scopeWatchSpy = sinon.spy($scope, '$watch');
      var element = $compile("<artboard-presentation></artboard-presentation>")($scope);
      $scope.$digest();
      scopeWatchSpy.should.have.been.calledWith('editorFactory.presentation');
    });

    it('should add class',function(){
      var element = $compile("<artboard-presentation></artboard-presentation>")($scope);
      $scope.$digest();
      expect(element.hasClass('artboard-presentation')).to.be.ok;
    });

    it('should apply presentation properties',function(){
      var element = $compile("<artboard-presentation></artboard-presentation>")($scope);
      $scope.$digest();
      expect(element.css('width')).to.equal((presentation.width + widthIncrement)+presentation.widthUnits);
      expect(element.css('height')).to.equal((presentation.height + heightIncrement)+presentation.heightUnits);
      expect(element.css('background')).to.contain(presentation.backgroundStyle);
      expect(element.css('backgroundSize')).to.equal('contain');
    });

    it('should apply presentation properties when they change',function(){
      var element = $compile("<artboard-presentation></artboard-presentation>")($scope);
      $scope.$apply();
      presentation.width = 100;
      presentation.height = 400;
      $scope.$apply();
      expect(element.css('width')).to.equal((presentation.width + widthIncrement)+presentation.widthUnits);
      expect(element.css('height')).to.equal((presentation.height+ heightIncrement)+presentation.heightUnits);
      expect(element.css('background')).to.contain(presentation.backgroundStyle);  
      expect(element.css('backgroundSize')).to.equal('contain');  
    });
  });

  describe('show empty state:',function() {
    it('should show empty state',function() {
      var element = $compile("<artboard-presentation></artboard-presentation>")($scope);
      $scope.$apply();
      expect(element.scope().showEmptyState()).to.be.true;
    });

    it('should not show empty state for existing presentations',function(){
      presentation.id = '123';
      var element = $compile("<artboard-presentation></artboard-presentation>")($scope);
      $scope.$apply();
      expect(element.scope().showEmptyState()).to.be.false;
    });


    it('should not show empty state after changes',function(){
      $scope.hasUnsavedChanges = true;
      var element = $compile("<artboard-presentation></artboard-presentation>")($scope);
      $scope.$apply();
      expect(element.scope().showEmptyState()).to.be.false;
    });


    it('should not show empty state for Templates',function(){
      $stateParams.copyOf = true;
      var element = $compile("<artboard-presentation></artboard-presentation>")($scope);
      $scope.$apply();
      expect(element.scope().showEmptyState()).to.be.false;
    });
  });

});
