'use strict';
describe('directive: artboard-presentation', function() {
  var $compile,
      $rootScope,
      widthIncrement,
      heightIncrement,
      $scope,
      presentation;

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
  beforeEach(module(mockTranlate()));
  beforeEach(module(function ($provide) {
    $provide.service('editorFactory', function() {
      return {
        presentation: presentation
      };
    });
  }));

  beforeEach(inject(function(_$compile_, _$rootScope_, $templateCache, PRESENTATION_TOOLBAR_SIZE, PRESENTATION_BORDER_SIZE){
    $templateCache.put('partials/editor/artboard-presentation.html', '<p>mock</p>');
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    heightIncrement = PRESENTATION_TOOLBAR_SIZE + PRESENTATION_BORDER_SIZE;
    widthIncrement = 2 * PRESENTATION_BORDER_SIZE;
    $scope = $rootScope.$new();
  }));

  it('should compile html', function() {
    var element = $compile("<artboard-presentation></artboard-presentation>")($scope);
    $scope.$digest();
    expect(element.html()).to.equal('<p>mock</p>');
  });

  describe('presentation:', function () {
    it('should watch editorFactory presentation',function(){
      var scopeWatchSpy = sinon.spy($scope, '$watch');
      var element = $compile("<artboard-presentation></artboard-presentation>")($scope);
      $scope.$digest();
      scopeWatchSpy.should.have.been.calledWith('editorFactory.presentation');
    });

    it('should add class',function(){
      var element = $compile("<artboard-presentation></artboard-presentation>")($scope);
      $scope.$digest();
      expect(element.hasClass('artboard-presentation')).to.be.truely;
    });

    it('should apply presentation properties',function(){
      var element = $compile("<artboard-presentation></artboard-presentation>")($scope);
      $scope.$digest();
      expect(element.css('width')).to.equal((presentation.width + widthIncrement)+presentation.widthUnits);
      expect(element.css('height')).to.equal((presentation.height + heightIncrement)+presentation.heightUnits);
      expect(element.css('background')).to.equal(presentation.backgroundStyle);
      expect(element.css('backgroundSize')).to.equal('contain');    
    });

    it('should apply presentation properties when they cahnge',function(){
      var element = $compile("<artboard-presentation></artboard-presentation>")($scope);
      $scope.$apply();
      presentation.width = 100;
      presentation.height = 400;
      $scope.$apply();
      expect(element.css('width')).to.equal((presentation.width + widthIncrement)+presentation.widthUnits);
      expect(element.css('height')).to.equal((presentation.height+ heightIncrement)+presentation.heightUnits);
      expect(element.css('background')).to.equal(presentation.backgroundStyle);  
      expect(element.css('backgroundSize')).to.equal('contain');  
    });
  })
});
