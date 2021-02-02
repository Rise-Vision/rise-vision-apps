'use strict';
describe('directive: artboard-placeholder', function() {
  var $compile,
      $rootScope,
      $scope,
      placeholder,
      selectedPlaceholder,
      widgetRenderer;

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
      "backgroundStyle": "rgb(222, 33, 90)",
      'backgroundScaleToFit': true
  };

  beforeEach(module('risevision.editor.services'));
  beforeEach(module('risevision.editor.directives'));
  beforeEach(module(mockTranslate()));
  beforeEach(module(function ($provide) {
    $provide.service('placeholderFactory', function() {
      return {
        placeholder: selectedPlaceholder
      };
    });
    $provide.service('widgetRenderer', function() {
      return {
        register: function(){},
        unregister: function(){},
        notifyChanges: function(){},
        forceReload: function(){}
      };
    });
  }));

  beforeEach(inject(function(_$compile_, _$rootScope_, $templateCache, _widgetRenderer_){
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    $scope = $rootScope.$new();
    $scope.placeholder = placeholder;
    widgetRenderer = _widgetRenderer_;
  }));

  describe('placeholder:', function () {
    it('should watch its placeholder and selected placeholder',function(){
      var element = $compile('<artboard-placeholder placeholder="placeholder"></artboard-placeholder>')($scope);
      $scope.$digest();
      expect(element.isolateScope().$$watchers[0].exp).to.equal('factory.placeholder');
      expect(element.isolateScope().$$watchers[1].exp).to.equal('placeholder');
    });

    it('should add class',function(){
      var element = $compile('<artboard-placeholder placeholder="placeholder"></artboard-placeholder>')($scope);
      $scope.$digest();
      expect(element.hasClass('ph-block')).to.be.truely;
    });

    it('should apply placeholder properties',function(){
      var element = $compile('<artboard-placeholder placeholder="placeholder"></artboard-placeholder>')($scope);
      $scope.$digest();
      expect(element.css('top')).to.equal(placeholder.top+placeholder.topUnits);
      expect(element.css('left')).to.equal(placeholder.left+placeholder.leftUnits);
      expect(element.css('width')).to.equal(placeholder.width+placeholder.widthUnits);
      expect(element.css('height')).to.equal(placeholder.height+placeholder.heightUnits);
      expect(element.css('background')).to.contain(placeholder.backgroundStyle);
      expect(element.css('backgroundSize')).to.equal('contain');
      expect(parseInt(element.css('z-index'))).to.equal(placeholder.zIndex);    
    });

    it('should apply placeholder properties when they change',function(){
      var element = $compile('<artboard-placeholder placeholder="placeholder"></artboard-placeholder>')($scope);
      $scope.$apply();
      placeholder.width = 100;
      placeholder.height = 420;
      placeholder.top = 220;
      placeholder.left = 120;
      placeholder.zIndex = 40;
      placeholder.backgroundStyle = "rgb(11, 43, 60)"
      $scope.$apply();
      expect(element.css('top')).to.equal(placeholder.top+placeholder.topUnits);
      expect(element.css('left')).to.equal(placeholder.left+placeholder.leftUnits);
      expect(element.css('width')).to.equal(placeholder.width+placeholder.widthUnits);
      expect(element.css('height')).to.equal(placeholder.height+placeholder.heightUnits);
      expect(element.css('background')).to.contain(placeholder.backgroundStyle);
      expect(element.css('backgroundSize')).to.equal('contain');
      expect(parseInt(element.css('z-index'))).to.equal(placeholder.zIndex);        
    });

    it('should increase z-index and change class when selected',function(){
      selectedPlaceholder = placeholder;
      var element = $compile('<artboard-placeholder placeholder="placeholder"></artboard-placeholder>')($scope);
      $scope.$apply();   
      expect(element.hasClass('edit-mode')).to.be.truely;
      expect(parseInt(element.css('z-index'))).to.equal(100);
    });

    it('should register renderer on init',function(){
      var spy = sinon.spy(widgetRenderer,"register");
      var element = $compile('<artboard-placeholder placeholder="placeholder"></artboard-placeholder>')($scope);
      spy.should.have.been.calledWith($scope.placeholder);
    });

    it('should unregister renderer on destroy',function(){
      var spy = sinon.spy(widgetRenderer,"unregister");
      var element = $compile('<artboard-placeholder placeholder="placeholder"></artboard-placeholder>')($scope);
      $scope.$destroy();
      spy.should.have.been.calledWith($scope.placeholder);
    });

    it('should notify placeholder changes',function(){
      var spy = sinon.spy(widgetRenderer,"notifyChanges");
      var element = $compile('<artboard-placeholder placeholder="placeholder"></artboard-placeholder>')($scope);
      $scope.placeholder.top = 200;
      $scope.$apply();
      spy.should.have.been.calledWith($scope.placeholder);
    });

    it('should force placeholder render reload if additionalParams has changed',function(){
      var spy = sinon.spy(widgetRenderer,"forceReload");
      $scope.placeholder.items = [{additionalParams: "original"}];
      var element = $compile('<artboard-placeholder placeholder="placeholder"></artboard-placeholder>')($scope);      
      $scope.$apply();
      $scope.placeholder.items[0].additionalParams = "changed";
      $scope.$apply();
      spy.should.have.been.calledWith($scope.placeholder);
    });

    it('should not unregister previous element if id is unchanged',function(){
      var unregister = sinon.spy(widgetRenderer, "unregister");

      var element = $compile('<artboard-placeholder placeholder="placeholder"></artboard-placeholder>')($scope);
      $scope.placeholder.id = "id1";
      $scope.$apply();
      unregister.should.not.have.been.called;
      $scope.$apply();
      unregister.should.not.have.been.called;
    });

    it('should unregister previous element if id changed',function(){
      var unregister = sinon.spy(widgetRenderer, "unregister");

      var element = $compile('<artboard-placeholder placeholder="placeholder"></artboard-placeholder>')($scope);
      $scope.placeholder.id = "id1";
      $scope.$apply();
      unregister.should.not.have.been.called;
      $scope.placeholder.id = "id2";
      $scope.$apply();
      unregister.should.have.been.called;
    });
  })
});
