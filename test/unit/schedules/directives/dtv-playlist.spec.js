'use strict';
describe('directive: playlist (schedule)', function() {
  var $rootScope;
  var testitem = {name: 'testitem'};
  var items = [testitem,{name:'item2'}];
  var element;

  beforeEach(module('risevision.schedules.directives'));
  beforeEach(module(function ($provide) {
    $provide.service('playlistFactory', function() {
      return {
        removePlaylistItem: function(item) {
            expect(item).to.be.ok;
            expect(item).to.deep.equal(testitem);
            items.splice(items.indexOf(item),1);
        },
        moveItem: sinon.stub()
      };
    });
    $provide.service('$modal', function() {
      return {
        open: function(item) {
          expect(item).to.be.ok;
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
  }));

  beforeEach(inject(function($compile, _$rootScope_, $templateCache){
    $templateCache.put('partials/schedules/playlist.html', '<p>mock</p>');
    $rootScope = _$rootScope_;
    $rootScope.playlistItems = items;
    
    element = $compile("<playlist playlist-items=\"playlistItems\"></playlist>")($rootScope);
    $rootScope.$digest();
  }));

  afterEach(inject(function(playlistFactory) {
    playlistFactory.moveItem.reset();
  }));

  it('should replace the element with the appropriate content', function() {
    expect(element.html()).to.equal('<p>mock</p>');
  });

  describe('remove:', function(){
    it('should have remove function in scope', function() {
      expect(element.isolateScope().remove).to.be.a('function');
    });

    it('should open modal and remove item on confirm', function() {
      element.isolateScope().remove(testitem);
      expect(items).to.not.include(testitem);
    });
  });

  describe('sortItem:', function() {
    it('should initialize the function', function() {
      expect(element.isolateScope().sortItem).to.be.a('function');
    });

    it('should call moveItem upon invocation', inject(function(playlistFactory) {
      expect(playlistFactory.moveItem).not.to.have.been.called;
      element.isolateScope().sortItem({data: {oldIndex: 0, newIndex: 2}});
      $rootScope.$digest();
      expect(playlistFactory.moveItem).to.have.been.calledWith(0, 2);
    }));
  });
  
  describe('manage: ', function() {

  });

});
