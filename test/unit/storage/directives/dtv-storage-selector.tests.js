'use strict';
describe('directive: storage-selector', function() {
  var $rootScope, element, storageFactory, $modal;
  var testitem = {name: 'image.jpg'};

  beforeEach(module('risevision.storage.directives'));
  beforeEach(module(function ($provide) {
    $provide.service('$modal', function() {
      return $modal = {
        open: function() {
          return {
            result:{
              then:function(func){
                  expect(func).to.be.a('function');
                  func(testitem);
              }
            }
          };
        }
      };
    });
    $provide.service('storageFactory', function() {
        return storageFactory = {};
    });
    $provide.value('SELECTOR_TYPES', {SINGLE_FILE: 'single-file'});
  }));

  beforeEach(inject(function(_$compile_, _$rootScope_, $templateCache){
    $templateCache.put('partials/storage/storage-selector.html', '<p>mock</p>');
    var $compile = _$compile_;
    $rootScope = _$rootScope_;
    
    element = $compile("<storage-selector type='single-file'></storage-selector>")($rootScope);
    $rootScope.$digest();
  }));

  it('should replace the element with the appropriate content', function() {
    expect(element.html()).to.equal('<p>mock</p>');
  });
  
  it('should initialize constants', function() {
    expect(storageFactory.selectorType).to.equal('single-file');
    expect(storageFactory.storageFull).to.be.false;
  });
  
  describe('open:', function(){
    it('should have open function in scope', function() {
      expect(element.isolateScope().open).to.be.a('function');
    });
    
    it('should open modal', function() {
      var $modalSpy = sinon.spy($modal, 'open');
      
      element.isolateScope().open();      
      
      $modalSpy.should.have.been.calledWith({
        templateUrl: 'partials/storage/storage-modal.html',
        controller: 'StorageSelectorModalController',
        size: 'lg'
      });
    });

    it('should open modal and emit "picked"', function() {
      var isolateScope = element.isolateScope();
      var $emitSpy = sinon.spy(isolateScope, '$emit');

      isolateScope.open();

      $emitSpy.should.have.been.calledWith('picked', testitem, 'single-file');
    });
  });
  
});
