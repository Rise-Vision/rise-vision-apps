'use strict';
describe('directive: placeholder-drag', function() {
  var $compile,
      $rootScope,
      $document,
      $scope,
      placeholder,
      artboardFactory,
      element;

  beforeEach(module('risevision.editor.services'));
  beforeEach(module('risevision.editor.directives'));
  beforeEach(module(function ($provide) {
    $provide.service('artboardFactory', function(){
      return {
        zoomLevel: 1
      };
    });
  }));
  beforeEach(module(mockTranslate()));
  beforeEach(inject(function(_$compile_, _$rootScope_,_$document_,_artboardFactory_){
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    $document = _$document_;
    artboardFactory = _artboardFactory_;
    $scope = $rootScope.$new();
    placeholder = {
      "width": 294,
      "widthUnits": "px",
      "height": 500,
      "heightUnits": "px",
      "left": 50,
      "leftUnits": "px",
      "top": 530,
      "topUnits": "px",
      "zIndex": 1,
      "backgroundStyle": "rgb(222, 33, 90)"
    };
    $scope.placeholder = placeholder;
    element = $compile('<div placeholder-drag></div>')($scope);
    $scope.$digest();
  }));

  describe('drag:', function () {
    it('should move placeholder horizontally',function(){
      element.triggerHandler({type:'mousedown',pageX:10,pageY:10});
      $document.triggerHandler({type:'mousemove',pageX:15,pageY:10});
      $document.triggerHandler({type:'mouseup',pageX:15,pageY:10});
      expect(placeholder.top).to.equal(530);
      expect(placeholder.left).to.equal(55);  
    });

    it('should move placeholder vertically',function(){
      element.triggerHandler({type:'mousedown',pageX:10,pageY:10});
      $document.triggerHandler({type:'mousemove',pageX:10,pageY:20});
      $document.triggerHandler({type:'mouseup',pageX:10,pageY:20});
      expect(placeholder.top).to.equal(540);
      expect(placeholder.left).to.equal(50);       
    });

    it('should move placeholder in both directions',function(){
      element.triggerHandler({type:'mousedown',pageX:10,pageY:10});
      $document.triggerHandler({type:'mousemove',pageX:30,pageY:30});
      $document.triggerHandler({type:'mouseup',pageX:30,pageY:30});
      expect(placeholder.top).to.equal(550);
      expect(placeholder.left).to.equal(70);       
    });

    it('should consider zoomLevel',function(){
      artboardFactory.zoomLevel = 0.1;
      $scope.$apply();
      element.triggerHandler({type:'mousedown',pageX:10,pageY:10});
      $document.triggerHandler({type:'mousemove',pageX:30,pageY:30});
      $document.triggerHandler({type:'mouseup',pageX:30,pageY:30});
      $scope.$apply();
      expect(placeholder.top).to.equal(730);
      expect(placeholder.left).to.equal(250);       
    });
  });
});
