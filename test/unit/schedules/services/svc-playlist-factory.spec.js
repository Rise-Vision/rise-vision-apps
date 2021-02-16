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
    $provide.service('blueprintFactory', function() {
      return {
       isPlayUntilDone: sinon.stub().returns(Q.resolve(true))
      };
    });
    $provide.service('presentationFactory', function() {
      return {
        setPresentation: sinon.spy()
      };
    });
    $provide.service('scheduleTracker', function() { 
      return sinon.spy();
    });
    $provide.service('insecureUrl', function() { 
      return sinon.stub().returns(true);
    });

  }));
  var playlist, playlistItem, playlistItem0, playlistItem2, playlistFactory, blueprintFactory, presentationFactory;
  var scheduleTracker, insecureUrl, updateSchedule, currentState;
  var scheduleFactory;
  beforeEach(function(){
    currentState = undefined;
    updateSchedule = true;
    
    inject(function($injector){  
      playlistFactory = $injector.get('playlistFactory');
      blueprintFactory = $injector.get('blueprintFactory');
      presentationFactory = $injector.get('presentationFactory');
      scheduleTracker = $injector.get('scheduleTracker');
      insecureUrl = $injector.get('insecureUrl');
    });
  });

  it('should exist',function(){
    expect(playlistFactory).to.be.ok;

    expect(playlistFactory.newPresentationItem).to.be.a('function');    
    expect(playlistFactory.initPlayUntilDone).to.be.a('function');
    expect(playlistFactory.addPresentationItem).to.be.a('function');
    expect(playlistFactory.addPresentationItems).to.be.a('function');
    expect(playlistFactory.getPlaylist).to.be.a('function');
    expect(playlistFactory.isNew).to.be.a('function');    
    expect(playlistFactory.getNewUrlItem).to.be.a('function');
    expect(playlistFactory.removePlaylistItem).to.be.a('function');
    expect(playlistFactory.duplicatePlaylistItem).to.be.a('function');    
    expect(playlistFactory.updatePlaylistItem).to.be.a('function');
    expect(playlistFactory.moveItem).to.be.a('function');
    expect(playlistFactory.getItemTimeline).to.be.a('function');
    expect(playlistFactory.getItemTransition).to.be.a('function');
    expect(playlistFactory.hasInsecureUrl).to.be.a('function');
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
    
    expect(scheduleTracker).to.have.been.calledWith('Add URL Item to Schedule');
    expect(playlistItem.duration).to.equal(10);
    expect(playlistItem.type).to.equal('url');
    expect(playlistItem.name).to.equal('URL Item');
  });


  describe('presentationItem', function() {
    var presentation, mockPlaylistItem;

    beforeEach(function() {
      presentation = {
        id: 'presentationId',
        name: 'presentationName',
        presentationType: 'presentationType'
      };
      mockPlaylistItem = {
        duration: 10,
        type: 'presentation',
        name: 'presentationName',
        objectReference: 'presentationId',
        presentationType: 'presentationType'
      };
    });

    describe('newPresentationItem:', function() {
      it('should cache presentation', function() {
        playlistFactory.newPresentationItem(presentation);

        expect(scheduleTracker).to.have.been.calledWith( 'Add Presentation to Schedule', 
          scheduleFactory.schedule.id, scheduleFactory.schedule.name, {
          presentationId: presentation.id,
          presentationName: presentation.name
        });

        presentationFactory.setPresentation.should.have.been.calledWith(presentation);
      });

      it('should return playlistItem', function() {
        expect(playlistFactory.newPresentationItem(presentation)).to.deep.equal(mockPlaylistItem);
      });

    });

    describe('initPlayUntilDone:', function() {
      var item;

      beforeEach(function() {
        item = {};
      });

      it('should resolve to true if item is not HTML_PRESENTATION_TYPE', function(done) {
        playlistFactory.initPlayUntilDone(item, {presentationType: 'legacy'}, true)
          .then(function(result) {
            expect(result).to.be.true;

            blueprintFactory.isPlayUntilDone.should.not.have.been.called;

            done();
          });
      });

      it('should resolve to true if HTML Template supports playUntilDone', function(done) {
        playlistFactory.initPlayUntilDone(item, {presentationType: 'HTML Template', productCode: 'productCode'}, true)
          .then(function(result) {
            expect(result).to.be.true;
            expect(item.playUntilDone).to.be.true;

            blueprintFactory.isPlayUntilDone.should.have.been.calledWith('productCode');

            done();
          });
      });

      it('should not update item if existing', function(done) {
        item.playUntilDone = false;

        playlistFactory.initPlayUntilDone(item, {presentationType: 'HTML Template', productCode: 'productCode'}, false)
          .then(function(result) {
            expect(result).to.be.true;
            expect(item.playUntilDone).to.be.false;

            done();
          });
      });

      it('should not overwrite if item playUntilDone is false', function(done) {
        item.playUntilDone = false;

        playlistFactory.initPlayUntilDone(item, {presentationType: 'HTML Template', productCode: 'productCode'}, false)
          .then(function(result) {
            expect(result).to.be.true;
            expect(item.playUntilDone).to.be.false;

            done();
          });
      });

      it('should resolve to false if HTML Template does not support playUntilDone', function(done) {
        blueprintFactory.isPlayUntilDone.returns(Q.resolve(false));

        playlistFactory.initPlayUntilDone(item, {presentationType: 'HTML Template', productCode: 'productCode'}, true)
          .then(function(result) {
            expect(result).to.be.false;
            expect(item.playUntilDone).to.be.false;

            done();
          });
      });

      it('should update to false if playUntilDone retrieval fails', function(done) {
        item.playUntilDone = true;
        blueprintFactory.isPlayUntilDone.returns(Q.reject('error'));

        playlistFactory.initPlayUntilDone(item, {presentationType: 'HTML Template', productCode: 'productCode'}, false)
          .then(function(result) {
            expect(result).to.be.false;
            expect(item.playUntilDone).to.be.false;

            blueprintFactory.isPlayUntilDone.should.have.been.calledWith('productCode');

            done();
          });
      });

    });

    describe('addPresentationItem:', function() {
      beforeEach(function() {
        sinon.stub(playlistFactory, 'initPlayUntilDone').returns(Q.resolve());
        sinon.stub(playlistFactory, 'updatePlaylistItem');      
      });

      it('should init playUntilDone', function() {
        playlistFactory.addPresentationItem(presentation);

        playlistFactory.initPlayUntilDone.should.have.been.calledWith(mockPlaylistItem, presentation, true);
      });

      it('should add item', function(done) {
        playlistFactory.addPresentationItem(presentation)
          .then(function() {
            playlistFactory.updatePlaylistItem.should.have.been.calledWith(mockPlaylistItem);

            done();
          });
      });

    });

    it('addPresentationItems:', function() {
      sinon.stub(playlistFactory, 'addPresentationItem');

      playlistFactory.addPresentationItems([1, 2]);

      playlistFactory.addPresentationItem.should.have.been.calledTwice;

      expect(playlistFactory.addPresentationItem.getCall(0).args[0]).to.equal(1);
      expect(playlistFactory.addPresentationItem.getCall(1).args[0]).to.equal(2);
    });

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

  describe('moveItem: ', function() {
    it('movePlaylistItemUp/Down: ', function() {
      playlistFactory.moveItem(0, 1);

      expect(playlist.indexOf(playlistItem0)).to.equal(1);

      playlistFactory.moveItem(2, 1);

      expect(playlist.indexOf(playlistItem2)).to.equal(1);
      expect(playlist.indexOf(playlistItem0)).to.equal(2);

      playlistFactory.moveItem(2, 0);
      expect(playlist.indexOf(playlistItem0)).to.equal(0);
    });
  });

  it('getItemTransition:', function() {
    expect(playlistFactory.getItemTransition({})).to.equal('No transition');

    expect(playlistFactory.getItemTransition({
      transitionType: 'normal'
    })).to.equal('No transition');

    expect(playlistFactory.getItemTransition({
      transitionType: 'slideFromTop'
    })).to.equal('Slide from top');
  });

  describe('hasInsecureUrl:', function() {
    it('should not show if playlistItem is null', function() {
      var playlistItem = null;

      expect(playlistFactory.hasInsecureUrl(playlistItem)).to.be.false;

      insecureUrl.should.not.have.been.called;
    });

    it('should not show if playlistItem is a presentation', function() {
      var playlistItem = {type:'presentation'};

      expect(playlistFactory.hasInsecureUrl(playlistItem)).to.be.false;

      insecureUrl.should.not.have.been.called;
    });

    it('should show if url is insecure', function() {
      var playlistItem = {type:'url', objectReference: 'http://someinsecure.site'};

      expect(playlistFactory.hasInsecureUrl(playlistItem)).to.be.true;

      insecureUrl.should.have.been.calledWith(playlistItem.objectReference);
    });

    it('should not show if url is secure', function() {
      insecureUrl.returns(false);
      var playlistItem = {type:'url', objectReference: 'https://risevision.com'};

      expect(playlistFactory.hasInsecureUrl(playlistItem)).to.be.false;

      insecureUrl.should.have.been.calledWith(playlistItem.objectReference);
    });

  });

});
