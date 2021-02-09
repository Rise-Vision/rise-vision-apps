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

    selectedWidget = {
      additionalParams: 'updatedParams',
      productCode: '123'
    };

    $provide.service('$q', function() {return Q;});
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
            deferred.resolve(selectedWidget);
          }
         
          return {
            result: deferred.promise
          };
        }
      }
    });
    
    $provide.service('gadgetFactory', function() {
      return gadgetFactory = {
        getGadgetById: function(gadgetId) {
          var deferred = Q.defer();

          deferred.resolve({
            id: gadgetId,
            name: 'gadgetName',
            url: 'http://someurl.com/gadget.html',
            gadgetType: 'Widget'
          });
          
          return deferred.promise;
        },
        getGadgetByProduct: sinon.spy(function() {
          var deferred = Q.defer();

          deferred.resolve({
            id: 'gadgetId',
            name: 'gadgetName',
            url: 'http://someurl.com/gadget.html',
            gadgetType: returnWidget
          });
          
          return deferred.promise;
        })
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
    
    $provide.service('storageUtils', function() {
      return fileSelectorFactory = {
        openSelector: function(type) {
          if (returnFiles) {
            return Q.resolve(returnFiles);
          }
          else {
            return Q.resolve();
          }
        },
        getFileUrls: function() {
          return ['folder/file1', 'file2'];
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
    
    $provide.service('settingsFactory', function() {
      return settingsFactory = {
        showSettingsModal: sinon.stub()
      };
    });
    
    $provide.value('SELECTOR_TYPES', {
      MULTIPLE_FILES_FOLDERS: 'multiple-files-folders'
    });    

  }));
  var item, selectedWidget, playlistItemFactory, placeholderPlaylistFactory, fileSelectorFactory, 
  settingsFactory, gadgetFactory, openModal, currentItem, trackedEvent, returnFiles, returnWidget;

  beforeEach(function(){
    openModal = null;
    currentItem = null;
    trackedEvent = null;
    returnFiles = [
      {name:'folder/file1'},
      {name:'file2'}
    ];
    returnWidget = 'Widget';
    
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
    it('should add new widget and open widget settings', function(done) {
      playlistItemFactory.addContent();

      expect(trackedEvent).to.equal('Add Content');
      expect(openModal).to.equal('storeContentModal');
      expect(currentItem).to.not.be.ok;

      setTimeout(function() {
        gadgetFactory.getGadgetByProduct.should.have.been.calledWith('123');

        settingsFactory.showSettingsModal.should.have.been.called;
        settingsFactory.showSettingsModal.should.have.been.calledWith({
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

    it('should add in App widget and open widget settings', function(done) {
      selectedWidget = {
        name: 'InApp',
        id: 'widgetId',
        url: 'widgetUrl'
      };

      playlistItemFactory.addContent();

      expect(trackedEvent).to.equal('Add Content');
      expect(openModal).to.equal('storeContentModal');
      expect(currentItem).to.not.be.ok;

      setTimeout(function() {
        gadgetFactory.getGadgetByProduct.should.not.have.been.called;

        settingsFactory.showSettingsModal.should.have.been.called;
        settingsFactory.showSettingsModal.should.have.been.calledWith({
          duration: 10,
          distributeToAll: true,
          timeDefined: false,
          additionalParams: null,
          type:'widget',
          name:'InApp',
          objectReference: 'widgetId',
          objectData: 'widgetUrl',
          settingsUrl: undefined
        });
        
        done();
      }, 10);
    });

    it('should add new presentation item and open settings', function(done) {
      returnWidget = 'presentation';
      playlistItemFactory.addContent();

      expect(trackedEvent).to.equal('Add Content');
      expect(openModal).to.equal('storeContentModal');
      expect(currentItem).to.not.be.ok;

      setTimeout(function() {
        gadgetFactory.getGadgetByProduct.should.have.been.calledWith('123');

        settingsFactory.showSettingsModal.should.have.been.called;
        settingsFactory.showSettingsModal.should.have.been.calledWith({
          duration: 10,
          distributeToAll: true,
          timeDefined: false,
          additionalParams: null,
          type: 'presentation',
          name: 'gadgetName'
        });
        
        done();
      }, 10);
    });    

    it('should open playlist item properties for non-widgets', function(done) {
      returnWidget = 'Gadget';

      playlistItemFactory.addContent();

      setTimeout(function() {
        gadgetFactory.getGadgetByProduct.should.have.been.calledWith('123');

        expect(openModal).to.equal('PlaylistItemModalController');
        expect(currentItem).to.deep.equal({
          duration: 10,
          distributeToAll: true,
          timeDefined: false,
          additionalParams: null,
          type: 'gadget',
          objectReference: 'gadgetId',
          name: 'gadgetName',
          objectData: 'http://someurl.com/gadget.html',
          settingsUrl: undefined
        });
        
        done();
      }, 10);
    });
  });
  
  describe('addTextWidget: ', function() {
    it('should open the Widget settings', function(done) {
      playlistItemFactory.addTextWidget();

      setTimeout(function() {
        settingsFactory.showSettingsModal.should.have.been.called;
        settingsFactory.showSettingsModal.should.have.been.calledWith({
      	  additionalParams: null,
      	  distributeToAll: true,
      	  duration: 10,
      	  name: "gadgetName",
      	  objectData: "http://someurl.com/gadget.html",
      	  objectReference: "64cc543c-c2c6-49ab-a4e9-40ceba48a253",
      	  settingsUrl: undefined,
      	  timeDefined: false,
      	  type: "widget"
      	});

        done();
      }, 10);
    });
  });
  
  describe('selectFiles: ', function() {
    it('should open selector', function(done) {
      var openSelectorSpy = sinon.spy(fileSelectorFactory, 'openSelector');
      
      playlistItemFactory.selectFiles('images');
      
      setTimeout(function() {
        openSelectorSpy.should.have.been.calledWith('multiple-files-folders', 'images', true);

        done();
      }, 10);
    });
    
    it('should add 2 images', function(done) {
      playlistItemFactory.selectFiles('images');
      
      setTimeout(function() {
        expect(trackedEvent).to.equal('Add Image Widget');

        expect(placeholderPlaylistFactory.items).to.have.length(2);

        expect(placeholderPlaylistFactory.items[0].name).to.equal('file1');
        expect(placeholderPlaylistFactory.items[0].additionalParams).to.equal('{"selector":{"storageName":"folder/file1","url":"folder/file1"},"storage":{"companyId":null,"fileName":"file1","folder":"folder/"},"resume":true,"scaleToFit":true,"position":"middle-center","duration":10,"pause":10,"autoHide":false,"url":"","background":{}}');
        expect(placeholderPlaylistFactory.items[0].objectData).to.equal('http://someurl.com/gadget.html');
        expect(placeholderPlaylistFactory.items[0].objectReference).to.equal('2707fc05-5051-4d7b-bcde-01fafd6eaa5e');

        expect(placeholderPlaylistFactory.items[1].name).to.equal('file2');
        expect(placeholderPlaylistFactory.items[1].additionalParams).to.equal('{"selector":{"storageName":"file2","url":"file2"},"storage":{"companyId":null,"fileName":"file2","folder":""},"resume":true,"scaleToFit":true,"position":"middle-center","duration":10,"pause":10,"autoHide":false,"url":"","background":{}}');
        expect(placeholderPlaylistFactory.items[1].objectData).to.equal('http://someurl.com/gadget.html');
        expect(placeholderPlaylistFactory.items[1].objectReference).to.equal('2707fc05-5051-4d7b-bcde-01fafd6eaa5e');

        done();
      }, 10);
    });
    
    it('should add a folder of images', function(done) {
      returnFiles = [{name: 'folder/folder1/', kind: 'folder'}, {}];
      playlistItemFactory.selectFiles('images');
      
      setTimeout(function() {
        expect(trackedEvent).to.equal('Add Image Widget');

        expect(placeholderPlaylistFactory.items).to.have.length(2);
        expect(placeholderPlaylistFactory.items[0]).to.have.property('name');
        expect(placeholderPlaylistFactory.items[0]).to.have.property('additionalParams');
        expect(placeholderPlaylistFactory.items[0]).to.have.property('objectData');
        expect(placeholderPlaylistFactory.items[0]).to.have.property('objectReference');

        expect(placeholderPlaylistFactory.items[0].name).to.equal('folder1');
        expect(placeholderPlaylistFactory.items[0].additionalParams).to.equal('{"selector":{"storageName":"folder/folder1/","url":"folder/file1"},"storage":{"companyId":null,"folder":"folder/folder1/"},"resume":true,"scaleToFit":true,"position":"middle-center","duration":10,"pause":10,"autoHide":false,"url":"","background":{}}');
        expect(placeholderPlaylistFactory.items[0].objectData).to.equal('http://someurl.com/gadget.html');
        expect(placeholderPlaylistFactory.items[0].objectReference).to.equal('2707fc05-5051-4d7b-bcde-01fafd6eaa5e');

        done();
      }, 10);
    });
    
    it('Image URL option should open widget settings', function(done) {
      returnFiles = false;

      playlistItemFactory.selectFiles('images');

      setTimeout(function() {
        settingsFactory.showSettingsModal.should.have.been.called;
        settingsFactory.showSettingsModal.should.have.been.calledWith({
	        additionalParams: '{"selector":{"selection":"custom"},"storage":{},"resume":true,"scaleToFit":true,"position":"middle-center","duration":10,"pause":10,"autoHide":false,"url":"","background":{}}',
      	  distributeToAll: true,
      	  duration: 10,
      	  name: "gadgetName",
      	  objectData: "http://someurl.com/gadget.html",
      	  objectReference: "2707fc05-5051-4d7b-bcde-01fafd6eaa5e",
      	  settingsUrl: undefined,
      	  timeDefined: false,
      	  type: "widget"
      	});

        done();
      }, 10);
    });
    
    it('should add 2 videos', function(done) {
      playlistItemFactory.selectFiles('videos');
      
      setTimeout(function() {
        expect(trackedEvent).to.equal('Add Video Widget');

        expect(placeholderPlaylistFactory.items).to.have.length(2);

        expect(placeholderPlaylistFactory.items[0].name).to.equal('file1');
        expect(placeholderPlaylistFactory.items[0].playUntilDone).to.be.true;
        expect(placeholderPlaylistFactory.items[0].additionalParams).to.equal('{"selector":{"storageName":"folder/file1","url":"folder/file1"},"url":"","storage":{"companyId":null,"fileName":"file1","folder":"folder/"},"video":{"scaleToFit":true,"volume":50,"controls":true,"autoplay":true,"resume":true,"pause":5}}');
        expect(placeholderPlaylistFactory.items[0].objectData).to.equal('http://someurl.com/gadget.html');
        expect(placeholderPlaylistFactory.items[0].objectReference).to.equal('4bf6fb3d-1ead-4bfb-b66f-ae1fcfa3c0c6');

        expect(placeholderPlaylistFactory.items[1].name).to.equal('file2');
        expect(placeholderPlaylistFactory.items[1].playUntilDone).to.be.true;
        expect(placeholderPlaylistFactory.items[1].additionalParams).to.equal('{"selector":{"storageName":"file2","url":"file2"},"url":"","storage":{"companyId":null,"fileName":"file2","folder":""},"video":{"scaleToFit":true,"volume":50,"controls":true,"autoplay":true,"resume":true,"pause":5}}');
        expect(placeholderPlaylistFactory.items[1].objectData).to.equal('http://someurl.com/gadget.html');
        expect(placeholderPlaylistFactory.items[1].objectReference).to.equal('4bf6fb3d-1ead-4bfb-b66f-ae1fcfa3c0c6');

        done();
      }, 10);
    });
    
    it('Video URL option should open widget settings', function(done) {
      returnFiles = false;

      playlistItemFactory.selectFiles('videos');

      setTimeout(function() {
        settingsFactory.showSettingsModal.should.have.been.called;
        settingsFactory.showSettingsModal.should.have.been.calledWith({
      	  additionalParams: '{"selector":{"selection":"custom"},"url":"","storage":{},"video":{"scaleToFit":true,"volume":50,"controls":true,"autoplay":true,"resume":true,"pause":5}}',
      	  distributeToAll: true,
      	  duration: 10,
      	  name: "gadgetName",
      	  objectData: "http://someurl.com/gadget.html",
      	  objectReference: "4bf6fb3d-1ead-4bfb-b66f-ae1fcfa3c0c6",
      	  playUntilDone: true,
      	  settingsUrl: undefined,
      	  timeDefined: false,
      	  type: "widget"
      	});

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
