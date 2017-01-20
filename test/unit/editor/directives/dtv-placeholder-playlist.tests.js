'use strict';
describe('directive: placeholder-playlist', function() {
  var $compile, $rootScope;
  var testitem = {name: 'testitem'};
  var items = [testitem,{name:'item2'}];

  beforeEach(module('risevision.editor.controllers'));
  beforeEach(module('risevision.editor.services'));
  beforeEach(module('risevision.editor.directives'));
  beforeEach(module(mockTranlate()));
  beforeEach(module(function ($provide) {
    $provide.service('placeholderPlaylistFactory', function() {
      return {
        removeItem: function(item) {
            expect(item).to.be.ok;
            expect(item).to.deep.equal(testitem);
            items.splice(items.indexOf(item),1);
        },
        moveItem: sinon.stub()
      };
    });
    $provide.service('playlistItemFactory', function() {
      return {
      };
    });

    $provide.service('widgetModalFactory', function() {

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

  beforeEach(inject(function(_$compile_, _$rootScope_, $templateCache, placeholderPlaylistFactory){
    $templateCache.put('partials/editor/placeholder-playlist.html', '<p>mock</p>');
    $compile = _$compile_;
    $rootScope = _$rootScope_;
  }));

  afterEach(inject(function(placeholderPlaylistFactory) {
    placeholderPlaylistFactory.moveItem.reset();
  }));

  it('should replace the element with the appropriate content', function() {
    var element = $compile("<placeholder-playlist></placeholder-playlist>")($rootScope);
    $rootScope.$digest();
    expect(element.html()).to.equal('<p>mock</p>');
  });

  describe('remove:', function(){
    it('should have remove function in scope', function() {
      var element = $compile("<placeholder-playlist></placeholder-playlist>")($rootScope);
      $rootScope.$digest();
      expect(element.scope().remove).to.be.a('function');
    });

    it('should open modal and remove item on confirm', function() {
      var element = $compile("<placeholder-playlist></placeholder-playlist>")($rootScope);
      $rootScope.$digest();
      element.scope().remove(testitem);
      expect(items).to.not.include(testitem);
    });
  });

  describe('getDurationTooltip:',function(){
    it('should return Play Until Done for PUD',function(){
      var element = $compile("<placeholder-playlist></placeholder-playlist>")($rootScope);
      $rootScope.$digest();
      var item = {playUntilDone: true};
      expect(element.scope().getDurationTooltip(item)).to.be.equal('editor-app.playlistItem.duration: editor-app.playlistItem.playUntilDone');
    });

    it('should return Duration in seconds when not PUD',function() {
      var element = $compile("<placeholder-playlist></placeholder-playlist>")($rootScope);
      $rootScope.$digest();
      var item = {playUntilDone: false, duration: 33};
      expect(element.scope().getDurationTooltip(item)).to.be.equal('editor-app.playlistItem.duration: 33 editor-app.playlistItem.seconds');
    })
  });

  describe('sortItem:', function() {
    it('should initialize the function', function() {
      var element = $compile("<placeholder-playlist></placeholder-playlist>")($rootScope);
      $rootScope.$digest();
      expect(element.scope().sortItem).to.be.a('function');
    });

    it('should call moveItem upon invocation', inject(function(placeholderPlaylistFactory) {
      var element = $compile("<placeholder-playlist></placeholder-playlist>")($rootScope);
      $rootScope.$digest();
      expect(placeholderPlaylistFactory.moveItem).not.to.have.been.called;
      element.scope().sortItem({oldIndex: 0, newIndex: 2});
      $rootScope.$digest();
      expect(placeholderPlaylistFactory.moveItem).to.have.been.calledWith(0, 2);
    }));
  });

});
