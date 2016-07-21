'use strict';
describe('directive: storage-selector', function() {
  var $rootScope, element, fileSelectorFactory;
  var testitem = {name: 'image.jpg'};

  beforeEach(module('risevision.storage.directives'));
  beforeEach(module(function ($provide) {
    $provide.service('storageFactory', function() {
      return {selectorType: 'single-file'};
    });
    $provide.service('fileSelectorFactory', function() {
      return fileSelectorFactory;
    });
  }));

  beforeEach(inject(function(_$compile_, _$rootScope_, $templateCache){
    fileSelectorFactory = {
      openSelector: function() {
        return Q.resolve(testitem);
      }
    };

    $templateCache.put('partials/storage/storage-selector.html', '<p>mock</p>');
    var $compile = _$compile_;
    $rootScope = _$rootScope_;
    
    element = $compile("<storage-selector type='single-file'></storage-selector>")($rootScope);
    $rootScope.$digest();
  }));

  it('should replace the element with the appropriate content', function() {
    expect(element.html()).to.equal('<p>mock</p>');
  });

  describe('open:', function(){
    it('should have open function in scope', function() {
      expect(element.isolateScope().open).to.be.a('function');
    });
    
    it('should have open function in scope', function() {
      var openSelectorSpy = sinon.spy(fileSelectorFactory, 'openSelector');

      element.isolateScope().open();

      openSelectorSpy.should.have.been.called;
    });

    it('should open modal and emit "picked"', function(done) {
      var isolateScope = element.isolateScope();
      var $emitSpy = sinon.spy(isolateScope, '$emit');

      isolateScope.open();    
      setTimeout(function() {
        $emitSpy.should.have.been.calledWith('picked', testitem, 'single-file');

        done();        
      }, 10);
    });
  });
  
});
