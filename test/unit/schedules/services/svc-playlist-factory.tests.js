'use strict';
describe('service: playlistFactory:', function() {
  beforeEach(module('risevision.schedules.services'));
  beforeEach(module(function ($provide) {
    playlistItem = {
      name: 'Item 1',
      type: 'url',
      objectReference: 'http://www.risevision.com'
    };
    playlistItem0 = {
      name: 'Item 0'
    };
    playlistItem2 = {
      name: 'Item 2'
    };
    
    playlist = [playlistItem0, playlistItem, playlistItem2];

    scheduleFactory = {
      schedule: {
        content: playlist
      }
    };
    
    $provide.service('$q', function() {return Q;});

    $provide.service('scheduleFactory',function () {
      return scheduleFactory;
    });
    $provide.service('scheduleTracker', function() { 
      return function(name) {
        trackerCalled = name;
      };
    });
  }));
  var playlist, playlistItem, playlistItem0, playlistItem2, playlistFactory, trackerCalled, updateSchedule, currentState;
  var scheduleFactory;
  beforeEach(function(){
    trackerCalled = undefined;
    currentState = undefined;
    updateSchedule = true;
    
    inject(function($injector){  
      playlistFactory = $injector.get('playlistFactory');
    });
  });

  it('should exist',function(){
    expect(playlistFactory).to.be.truely;
    
    expect(playlistFactory.getPlaylist).to.be.a('function');
    expect(playlistFactory.isNew).to.be.a('function');    
    expect(playlistFactory.getNewUrlItem).to.be.a('function');    
    expect(playlistFactory.getNewPresentationItem).to.be.a('function');
    expect(playlistFactory.removePlaylistItem).to.be.a('function');
    expect(playlistFactory.duplicatePlaylistItem).to.be.a('function');    
    expect(playlistFactory.updatePlaylistItem).to.be.a('function');
    expect(playlistFactory.canPlaylistItemMoveDown).to.be.a('function');
    expect(playlistFactory.canPlaylistItemMoveUp).to.be.a('function');
    expect(playlistFactory.movePlaylistItemDown).to.be.a('function');
    expect(playlistFactory.movePlaylistItemUp).to.be.a('function');
  });
  
  describe('getPlaylist: ', function() {
    it('should get the playlist', function() {
      expect(playlistFactory.getPlaylist()).to.equal(playlist);
    });
    
    it('should initialize playlist if undefined', function() {
      scheduleFactory.schedule.content = undefined;
      
      var _playlist = playlistFactory.getPlaylist();
      
      expect(_playlist).to.be.a('array');
      expect(_playlist.length).to.equal(0);
    });
  });
  
  it('isNew: ', function() {
    expect(playlistFactory.isNew(playlistItem)).to.be.false;
    expect(playlistFactory.isNew(playlistFactory.getNewUrlItem())).to.be.true;
  });
  
  it('getNewUrlItem: ', function() {
    var playlistItem = playlistFactory.getNewUrlItem();
    
    expect(trackerCalled).to.equal('Add URL Item to Schedule');
    expect(playlistItem.duration).to.equal(10);
    expect(playlistItem.type).to.equal('url');
    expect(playlistItem.name).to.equal('URL Item');
  });
  
  it('getNewPresentationItem: ', function() {
    var playlistItem = playlistFactory.getNewPresentationItem();
    
    expect(trackerCalled).to.equal('Add Presentation to Schedule');
    expect(playlistItem.duration).to.equal(10);
    expect(playlistItem.type).to.equal('presentation');
  });

  describe('removePlaylistItem: ',function(){
    it('should remove the item',function(){
      playlistFactory.removePlaylistItem(playlistItem);

      expect(playlist.length).to.equal(2);
    });
    
    it('should not remove missing item',function(){
      playlistFactory.removePlaylistItem({});

      expect(playlist.length).to.equal(3);
      expect(playlist[1]).to.equal(playlistItem);    
    });
  });

  describe('updatePlaylistItem: ',function(){
    it('should add the item',function(){
      var newItem = {
        name: 'Item 2'
      };
      playlistFactory.updatePlaylistItem(newItem);

      expect(playlist.length).to.equal(4);
      expect(playlist[3]).to.equal(newItem);    
    });
    
    it('should not add duplicate item',function(){
      playlistFactory.updatePlaylistItem(playlistItem);

      expect(playlist.length).to.equal(3);
      expect(playlist[1]).to.equal(playlistItem);    
    });
  });
  
  describe('duplicatePlaylistItem: ', function() {
    it('should duplicate the item', function() {
      playlistFactory.duplicatePlaylistItem(playlistItem);
      
      expect(playlist.length).to.equal(4);
      expect(playlist[2].name).to.equal('Copy of Item 1')
    });
  });
  
  it('canPlaylistItemMoveUp/Down: ', function() {
    expect(playlistFactory.canPlaylistItemMoveDown(playlistItem0)).to.be.true;
    expect(playlistFactory.canPlaylistItemMoveDown(playlistItem2)).to.be.false;
    
    expect(playlistFactory.canPlaylistItemMoveUp(playlistItem0)).to.be.false;
    expect(playlistFactory.canPlaylistItemMoveUp(playlistItem2)).to.be.true;
  }); 
  
  it('movePlaylistItemUp/Down: ', function() {
    playlistFactory.movePlaylistItemDown(playlistItem0);
    
    expect(playlist.indexOf(playlistItem0)).to.equal(1);
    
    playlistFactory.movePlaylistItemUp(playlistItem2);
    
    expect(playlist.indexOf(playlistItem2)).to.equal(1);
    expect(playlist.indexOf(playlistItem0)).to.equal(2);

    playlistFactory.movePlaylistItemDown(playlistItem0);
    expect(playlist.indexOf(playlistItem0)).to.equal(2);
  }); 


});
