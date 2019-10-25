'use strict';
describe('directive: placeholder-playlist', function() {
  var $compile, $rootScope;
  var testitem = {name: 'testitem'};
  var items = [testitem,{name:'item2'}];
  var element;

  beforeEach(module('risevision.editor.controllers'));
  beforeEach(module('risevision.editor.services'));
  beforeEach(module('risevision.editor.directives'));
  beforeEach(module(mockTranslate()));
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

    $provide.service('settingsFactory', function() {
      return {
        showSettingsModal: sinon.stub()
      }
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

  beforeEach(inject(function($compile, _$rootScope_, $templateCache, placeholderPlaylistFactory){
    $templateCache.put('partials/editor/placeholder-playlist.html', '<p>mock</p>');
    $rootScope = _$rootScope_;
    
    element = $compile("<placeholder-playlist></placeholder-playlist>")($rootScope);
    $rootScope.$digest();
  }));

  afterEach(inject(function(placeholderPlaylistFactory) {
    placeholderPlaylistFactory.moveItem.reset();
  }));

  it('should replace the element with the appropriate content', function() {
    expect(element.html()).to.equal('<p>mock</p>');
  });

  describe('remove:', function(){
    it('should have remove function in scope', function() {
      expect(element.scope().remove).to.be.a('function');
    });

    it('should open modal and remove item on confirm', function() {
      element.scope().remove(testitem);
      expect(items).to.not.include(testitem);
    });
  });

  describe('getDurationTooltip:',function(){
    it('should return Play Until Done for PUD',function(){
      var item = {playUntilDone: true};
      expect(element.scope().getDurationTooltip(item)).to.be.equal('editor-app.playlistItem.duration: editor-app.playlistItem.playUntilDone');
    });

    it('should return Duration in seconds when not PUD',function() {
      var item = {playUntilDone: false, duration: 33};
      expect(element.scope().getDurationTooltip(item)).to.be.equal('editor-app.playlistItem.duration: 33 editor-app.playlistItem.seconds');
    })
  });

  describe('sortItem:', function() {
    it('should initialize the function', function() {
      expect(element.scope().sortItem).to.be.a('function');
    });

    it('should call moveItem upon invocation', inject(function(placeholderPlaylistFactory) {
      expect(placeholderPlaylistFactory.moveItem).not.to.have.been.called;
      element.scope().sortItem({data: {oldIndex: 0, newIndex: 2}});
      $rootScope.$digest();
      expect(placeholderPlaylistFactory.moveItem).to.have.been.calledWith(0, 2);
    }));
  });
  
  describe('showSettingsModal: ', function() {
    var settingsFactory;
    beforeEach(function() {
      inject(function($injector){
        settingsFactory = $injector.get('settingsFactory');
      });
    });
    
    it('should open widget settings', function() {
      var item = {type: 'widget'};
      element.scope().showSettingsModal(item);
      
      expect(settingsFactory.showSettingsModal).to.have.been.calledWith(item);
    });
  });
    
  it('isEditable: ', function() {
    expect(element.scope().isEditable({})).to.be.false;
    expect(element.scope().isEditable({type:'presentation'})).to.be.true;
    expect(element.scope().isEditable({type:'widget'})).to.be.false;
    expect(element.scope().isEditable({type:'widget', objectReference:'widgetId'})).to.be.true;
    expect(element.scope().isEditable({type:'widget', settingsUrl:'settingsUrl'})).to.be.true;
  });

});
