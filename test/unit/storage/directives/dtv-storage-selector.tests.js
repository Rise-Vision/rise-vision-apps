'use strict';
describe('directive: storage-selector', function() {
  var $compile, $rootScope, element;
  var testitem = {name: 'image.jpg'};

  beforeEach(module('risevision.storage.directives'));
  beforeEach(module(function ($provide) {
    $provide.service('$modal', function() {
      return {
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
    $provide.value('SELECTOR_TYPES', {SINGLE_FILE: 'single-file'});
  }));

  beforeEach(inject(function(_$compile_, _$rootScope_, $templateCache){
    $templateCache.put('partials/storage/storage-selector.html', '<p>mock</p>');
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    
    element = $compile("<storage-selector></storage-selector>")($rootScope);
    $rootScope.$digest();
  }));

  it('should replace the element with the appropriate content', function() {
    expect(element.html()).to.equal('<p>mock</p>');
  });

  describe('remove:', function(){
    it('should have remove function in scope', function() {
      $rootScope.$digest();
      expect(element.isolateScope().open).to.be.a('function');
    });

    it('should open modal and emit "picked"', function(done) {
      $rootScope.$digest();
      element.isolateScope().open();

      setTimeout(function() {
        expect(element.isolateScope().files).to.equal(testitem);
        
        done();
      }, 10);
    });
  });
  
});
