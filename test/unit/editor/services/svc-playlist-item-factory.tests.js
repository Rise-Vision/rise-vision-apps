'use strict';
  
describe('service: playlistItemFactory:', function() {
  beforeEach(module('risevision.apps.config'));
  beforeEach(module('risevision.editor.services'));
  beforeEach(module(function ($provide) {
    item = {
      'name': 'item1',
      'duration': '10',
      'type': 'gadget',
      'objectReference': null,
      'index': '0',
      'playUntilDone': 'false',
      'objectData': 'Hello Digital',
      'additionalParams': null,
      'timeDefined': 'false'
    };

    $provide.service('$modal',function(){
      return {
        open : function(obj){
          var deferred = Q.defer();

          openModal = obj.controller;
          if (obj.resolve) {
            currentItem = obj.resolve.item ? obj.resolve.item() : undefined;
            obj.resolve.category ? obj.resolve.category() : undefined;
          }

          if(openModal === 'WidgetItemModalController') {
            deferred.resolve({
              url:'http://www.risevision.com/widget.html',
              settingsUrl:'http://www.risevision.com/settings.html'
            });
          } else {
            deferred.resolve({additionalParams: 'updatedParams'});
          }
         
          return {
            result: deferred.promise
          };
        }
      }
    });
    
    $provide.service('gadgetFactory', function() {
      return {
        getGadget: function(gadgetId) {
          var deferred = Q.defer();

          deferred.resolve({
            id: gadgetId,
            name: 'gadgetName',
            url: 'http://someurl.com/gadget.html',
            gadgetType: 'Widget'
          });
          
          return deferred.promise;
        },
        getGadgetByProduct: function() {
          var deferred = Q.defer();

          deferred.resolve({
            id: 'gadgetId',
            name: 'gadgetName',
            url: 'http://someurl.com/gadget.html',
            gadgetType: 'Widget'
          });
          
          return deferred.promise;
        }
      };
    });

    $provide.service('presentationTracker', function() {
      return function(eventName){
        trackedEvent = eventName;
      };
    });

    $provide.service('editorFactory', function() {
      return {
        presentation: {}
      };
    });
    
    $provide.service('fileSelectorFactory', function() {
      return fileSelectorFactory = {
        openSelector: function(type) {
          return Q.resolve(['file1', 'file2']);
        },
        getSelectedFiles: function() {
          return [
            {name:'name1'},
            {}
          ];
        }
      };
    });
    
    $provide.service('placeholderPlaylistFactory', function() {
      var items = [];
      
      return placeholderPlaylistFactory = {
        updateItem: function(item) {
          placeholderPlaylistFactory.items.push(item);
        },
        items: items
      };
    });
    $provide.value('SELECTOR_TYPES', {});    

  }));
  var item, playlistItemFactory, placeholderPlaylistFactory, fileSelectorFactory, openModal, currentItem, trackedEvent;

  beforeEach(function(){
    openModal = null;
    currentItem = null;
    trackedEvent = null;
    
    inject(function($injector){  
      playlistItemFactory = $injector.get('playlistItemFactory');
      playlistItemFactory.item = item;
    });
  });

  it('should exist',function(){
    expect(playlistItemFactory).to.be.truely;

    expect(playlistItemFactory.addContent).to.be.a('function');
    expect(playlistItemFactory.addTextWidget).to.be.a('function');
    expect(playlistItemFactory.edit).to.be.a('function');

  });
  
  it('edit: ', function() {
    playlistItemFactory.edit(item);
    
    expect(openModal).to.equal('PlaylistItemModalController');
    expect(currentItem).to.equal(item);
  });
  
  describe('add widget: ', function() {
    it('should add new widget', function(done) {
      playlistItemFactory.addContent();

      expect(trackedEvent).to.equal('Add Content');
      expect(openModal).to.equal('storeProductsModal');
      expect(currentItem).to.not.be.ok;

      setTimeout(function() {
        expect(openModal).to.equal('PlaylistItemModalController');
        expect(currentItem).to.deep.equal({
          duration: 10,
          distributeToAll: true,
          timeDefined: false,
          additionalParams: null,
          type: 'widget',
          objectReference: 'gadgetId',
          name: 'gadgetName',
          objectData: 'http://someurl.com/gadget.html',
          settingsUrl: undefined
        });
        
        done();
      }, 10);
    });
  });
  
  it('addTextWidget:', function(done) {
    playlistItemFactory.addTextWidget();

    expect(trackedEvent).to.equal('Add Text Widget');
    expect(currentItem).to.not.be.ok;

    setTimeout(function() {
      expect(openModal).to.equal('PlaylistItemModalController');
      expect(currentItem).to.deep.equal({
        duration: 10,
        distributeToAll: true,
        timeDefined: false,
        additionalParams: null,
        type: 'widget',
        objectReference: '64cc543c-c2c6-49ab-a4e9-40ceba48a253',
        name: 'gadgetName',
        objectData: 'http://someurl.com/gadget.html',
        settingsUrl: undefined
      });
      
      done();
    }, 10);
  });
  
  describe('selectFiles: ', function() {
    it('should open selector', function() {
      var openSelectorSpy = sinon.spy(fileSelectorFactory, 'openSelector');
      
      playlistItemFactory.selectFiles();
      
      openSelectorSpy.should.have.been.called;
    });
    
    it('should add 2 images', function(done) {
      playlistItemFactory.selectFiles('image');
      
      setTimeout(function() {
        expect(trackedEvent).to.equal('Add Image Widget');

        expect(placeholderPlaylistFactory.items).to.have.length(2);
        expect(placeholderPlaylistFactory.items[0]).to.have.property('name');
        expect(placeholderPlaylistFactory.items[0]).to.have.property('additionalParams');
        expect(placeholderPlaylistFactory.items[0]).to.have.property('objectData');
        expect(placeholderPlaylistFactory.items[0]).to.have.property('objectReference');

        expect(placeholderPlaylistFactory.items[0].name).to.equal('name1');
        expect(placeholderPlaylistFactory.items[0].additionalParams).to.equal('{"selector":{"storageName":"name1","url":"file1"},"storage":{"companyId":null,"fileName":"name1"},"resume":true,"scaleToFit":true,"position":"middle-center","duration":10,"pause":10,"autoHide":false,"url":"","background":{}}');
        expect(placeholderPlaylistFactory.items[0].objectData).to.equal('http://someurl.com/gadget.html');
        expect(placeholderPlaylistFactory.items[0].objectReference).to.equal('2707fc05-5051-4d7b-bcde-01fafd6eaa5e');

        done();
      }, 10);
    });
    
    it('should add a folder of images', function(done) {
      fileSelectorFactory.getSelectedFiles = function() {
        return [{name: 'folder', kind: 'folder'}, {}];
      };
      playlistItemFactory.selectFiles('image');
      
      setTimeout(function() {
        expect(trackedEvent).to.equal('Add Image Widget');

        expect(placeholderPlaylistFactory.items).to.have.length(2);
        expect(placeholderPlaylistFactory.items[0]).to.have.property('name');
        expect(placeholderPlaylistFactory.items[0]).to.have.property('additionalParams');
        expect(placeholderPlaylistFactory.items[0]).to.have.property('objectData');
        expect(placeholderPlaylistFactory.items[0]).to.have.property('objectReference');

        expect(placeholderPlaylistFactory.items[0].name).to.equal('folder');
        expect(placeholderPlaylistFactory.items[0].additionalParams).to.equal('{"selector":{"storageName":"folder","url":"file1"},"storage":{"companyId":null,"folder":"folder"},"resume":true,"scaleToFit":true,"position":"middle-center","duration":10,"pause":10,"autoHide":false,"url":"","background":{}}');
        expect(placeholderPlaylistFactory.items[0].objectData).to.equal('http://someurl.com/gadget.html');
        expect(placeholderPlaylistFactory.items[0].objectReference).to.equal('2707fc05-5051-4d7b-bcde-01fafd6eaa5e');

        done();
      }, 10);
    });
    
    it('should add 2 videos', function(done) {
      playlistItemFactory.selectFiles('video');
      
      setTimeout(function() {
        expect(trackedEvent).to.equal('Add Video Widget');

        expect(placeholderPlaylistFactory.items).to.have.length(2);
        expect(placeholderPlaylistFactory.items[0]).to.have.property('name');
        expect(placeholderPlaylistFactory.items[0]).to.have.property('additionalParams');
        expect(placeholderPlaylistFactory.items[0]).to.have.property('objectData');
        expect(placeholderPlaylistFactory.items[0]).to.have.property('objectReference');

        expect(placeholderPlaylistFactory.items[0].name).to.equal('name1');
        expect(placeholderPlaylistFactory.items[0].playUntilDone).to.be.true;
        expect(placeholderPlaylistFactory.items[0].additionalParams).to.equal('{"selector":{"storageName":"name1","url":"file1"},"url":"","storage":{"companyId":null,"fileName":"name1"},"video":{"scaleToFit":true,"volume":50,"controls":true,"autoplay":true,"resume":true,"pause":5}}');
        expect(placeholderPlaylistFactory.items[0].objectData).to.equal('http://someurl.com/gadget.html');
        expect(placeholderPlaylistFactory.items[0].objectReference).to.equal('4bf6fb3d-1ead-4bfb-b66f-ae1fcfa3c0c6');

        done();
      }, 10);
    });
  });

  describe('add widget by url: ', function() {
    it('should add widget by url', function(done) {
      playlistItemFactory.addWidgetByUrl();
      
      expect(trackedEvent).to.equal('Add Widget By URL');
      expect(openModal).to.equal('WidgetItemModalController');
      expect(currentItem).to.not.be.ok;
      setTimeout(function() {
        expect(openModal).to.equal('PlaylistItemModalController');
        expect(currentItem).to.deep.equal({
          duration: 10,
          distributeToAll: true,
          timeDefined: false,
          additionalParams: null,
          type: 'widget',
          name: 'Widget from URL',
          objectData: 'http://www.risevision.com/widget.html',
          settingsUrl:'http://www.risevision.com/settings.html' 
        });
        done();
      }, 10);
    });
  });
});
