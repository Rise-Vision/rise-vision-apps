"use strict";

describe("directive: templateComponentPlaylist", function() {
  var sandbox = sinon.sandbox.create(),
      $scope,
      $loading,
      element,
      componentsFactory,
      attributeDataFactory,
      playlistComponentFactory,
      blueprintFactory,
      sampleAttributeData,
      samplePlaylistItems,
      sampleTemplatesFactory;

  beforeEach(function() {
    sampleAttributeData = {
      "items": [
        {
          "duration": 10,
          "element": {
            "attributes": {
              "presentation-id": "presentation-id-1",
              "template-id": "template-id-1"
            },
            "tagName": "rise-embedded-template"
          },
          "play-until-done": true,
          "transition-type": "fadeIn"
        },
        {
          "duration": 10,
          "element": {
            "attributes": {
              "id": "text1",
              "value": "Sample"
            },
            "tagName": "rise-text"
          },
          "play-until-done": false,
          "transition-type": "fadeIn"
        }
      ]
    };

    samplePlaylistItems = [
      {
        "tagName": "rise-embedded-template",
        "duration": 20,
        "play-until-done": true,
        "transition-type": "fadeIn",
        "id": "presentation-id-1",
        "productCode": "template-id-1",
        "attributes": {
          "presentation-id": "old-presentation-id-1",
          "template-id": "old-template-id-1"
        }
      }, 
      {
        "tagName": "rise-text",
        "duration": 10,
        "play-until-done": false,
        "transition-type": "fadeIn",
        "attributes": {
          "id": "text1",
          "value": "sample"
        }
      }
    ];

    sampleTemplatesFactory = {
      items: {
        list: [
          {id: "id1"},
          {id: "id2"}
        ]
      }
    };
  });

  beforeEach(module("risevision.template-editor.directives"));
  beforeEach(module(function ($provide) {
    $provide.service("componentsFactory", function() {
      return {
        selected: { id: "TEST-ID" },
        registerDirective: sandbox.stub(),
        editComponent: sandbox.stub()
      };
    });

    $provide.service('playlistComponentFactory', function() {
      return {
        loadPresentationNames: sandbox.stub()
      };
    });

    $provide.service('attributeDataFactory', function() {
      return {
        setAttributeData: sandbox.stub(),
        getBlueprintData: sandbox.stub()
      };
    });

    $provide.service('$loading', function() {
      return {
        start: sandbox.stub(),
        stop: sandbox.stub()
      };
    });

    $provide.service("blueprintFactory", function() {
      return {
        isPlayUntilDone: sandbox.stub().resolves(true),
        isRiseInit: sandbox.stub().returns(true)
      };
    });
  }));

  beforeEach(inject(function($injector, $compile, $rootScope, $templateCache){
    $loading = $injector.get('$loading');
    componentsFactory = $injector.get('componentsFactory');
    attributeDataFactory = $injector.get('attributeDataFactory');
    playlistComponentFactory = $injector.get('playlistComponentFactory');
    blueprintFactory = $injector.get('blueprintFactory');

    $templateCache.put("partials/template-editor/components/component-playlist.html", "<p>mock</p>");
    $scope = $rootScope.$new();

    element = $compile("<template-component-playlist></template-component-playlistt>")($scope);
    $scope = element.scope();
    $scope.$digest();
  }));

  it("should exist", function() {
    expect($scope).to.be.ok;

    expect($scope.playlistComponentFactory).to.equal(playlistComponentFactory);

    expect($scope.playlistComponents).to.be.an('array');
    expect($scope.addVisualComponents).to.be.false;

    expect($scope.showComponentsDropdown).to.be.a('function')

    expect($scope.getComponentByType).to.be.a('function');
    expect($scope.addPlaylistItem).to.be.a('function');
    expect($scope.editPlaylistItem).to.be.a('function');
  });

  describe('registerDirective:', function() {
    it('should initialize', function() {
      componentsFactory.registerDirective.should.have.been.calledTwice;

      var playlistDirective = componentsFactory.registerDirective.getCall(0).args[0];
      expect(playlistDirective).to.be.ok;
      expect(playlistDirective.type).to.equal("rise-playlist");
      expect(playlistDirective.show).to.be.a("function");

      var playlistItemDirective = componentsFactory.registerDirective.getCall(1).args[0];
      expect(playlistItemDirective).to.be.ok;
      expect(playlistItemDirective.type).to.equal("rise-playlist-item");
    });

    describe('show:', function() {
      var playlistComponents;

      beforeEach(function() {
        playlistComponents = $scope.playlistComponents;

        attributeDataFactory.getAvailableAttributeData = sandbox.stub();
      });

      it('should initialize variables', function() {
        $scope.playlistItems.push('item');

        componentsFactory.registerDirective.getCall(0).args[0].show();

        expect($scope.componentId).to.equal('TEST-ID');
        expect($scope.playlistItems).to.deep.equal([]);

        expect(playlistComponentFactory.onAddHandler).to.equal($scope.addItems);
      });

      describe('_updatePlaylistComponents:', function() {
        it('should set addVisualComponents to false based on isRiseInit being false', function() {
          blueprintFactory.isRiseInit.returns(false);

          $scope.addVisualComponents = true;

          componentsFactory.registerDirective.getCall(0).args[0].show();

          expect($scope.addVisualComponents).to.be.false;
        });

        it('should check blueprint data for allowed-components', function() {
          componentsFactory.registerDirective.getCall(0).args[0].show();

          attributeDataFactory.getBlueprintData.should.have.been.calledWith('TEST-ID', 'allowed-components');

          expect($scope.playlistComponents).to.equal(playlistComponents);
        });

        it('should reset playlist components', function() {
          $scope.playlistComponents = null;

          componentsFactory.registerDirective.getCall(0).args[0].show();

          expect($scope.playlistComponents).to.equal(playlistComponents);
        });

        it('should handle * for allowed-components', function() {
          attributeDataFactory.getBlueprintData.returns('*');
          componentsFactory.registerDirective.getCall(0).args[0].show();

          expect($scope.playlistComponents).to.equal(playlistComponents);
        });

        it('should parse csv values for allowed-components', function() {
          attributeDataFactory.getBlueprintData.returns('rise-video,rise-slides');
          componentsFactory.registerDirective.getCall(0).args[0].show();

          expect($scope.playlistComponents).to.have.length(2);
        });

        it('should ignore rise-embedded-template', function() {
          attributeDataFactory.getBlueprintData.returns('rise-embedded-template,rise-video,rise-slides');
          componentsFactory.registerDirective.getCall(0).args[0].show();

          expect($scope.playlistComponents).to.have.length(2);
        });

      });

      describe('_loadPresentationNames:', function() {
        it("should load items from attribute data", function() {
          var directive = componentsFactory.registerDirective.getCall(0).args[0];

          attributeDataFactory.getAvailableAttributeData = function(componentId, attributeName) {
            return sampleAttributeData[attributeName];
          };

          $scope.playlistItems = samplePlaylistItems; //some garbage data from past session

          directive.show();

          expect($scope.playlistItems.length).to.equal(2);
          expect($scope.playlistItems[0]["duration"]).to.equal(10);
          expect($scope.playlistItems[0]["play-until-done"]).to.be.true;
          expect($scope.playlistItems[0]["transition-type"]).to.equal("fadeIn");
          expect($scope.playlistItems[0]["id"]).to.equal("presentation-id-1");
          expect($scope.playlistItems[0]["productCode"]).to.equal("template-id-1");

          expect($scope.playlistItems[0]["tagName"]).to.equal("rise-embedded-template");
          expect($scope.playlistItems[0].attributes).to.deep.equal({
            "presentation-id": "presentation-id-1",
            "template-id": "template-id-1"
          });

          expect($scope.playlistItems[1]["duration"]).to.equal(10);
          expect($scope.playlistItems[1]["play-until-done"]).to.be.false;
          expect($scope.playlistItems[1]["transition-type"]).to.equal("fadeIn");
          expect($scope.playlistItems[1]["id"]).to.not.be.ok;
          expect($scope.playlistItems[1]["productCode"]).to.not.be.ok;

          expect($scope.playlistItems[1]["tagName"]).to.equal("rise-text");
          expect($scope.playlistItems[1].attributes).to.deep.equal({
            "id": "text1",
            "value": "Sample"
          });

          playlistComponentFactory.loadPresentationNames.should.have.been.calledWith([$scope.playlistItems[0]]);
        });

        it("should load attribute data correctly even without embedded templates", function() {
          var directive = componentsFactory.registerDirective.getCall(0).args[0];
          var copySampleAttributeData = {
            items: [
              sampleAttributeData.items[1]
            ]
          };

          attributeDataFactory.getAvailableAttributeData = function(componentId, attributeName) {
            return copySampleAttributeData[attributeName];
          };

          $scope.playlistItems = samplePlaylistItems; //some garbage data from past session

          directive.show();

          expect($scope.componentId).to.equal("TEST-ID");

          expect($scope.playlistItems.length).to.equal(1);
          expect($scope.playlistItems[0]["duration"]).to.equal(10);
          expect($scope.playlistItems[0]["play-until-done"]).to.be.false;
          expect($scope.playlistItems[0]["transition-type"]).to.equal("fadeIn");
          expect($scope.playlistItems[0]["id"]).to.not.be.ok;
          expect($scope.playlistItems[0]["productCode"]).to.not.be.ok;

          expect($scope.playlistItems[0]["tagName"]).to.equal("rise-text");
          expect($scope.playlistItems[0].attributes).to.deep.equal({
            "id": "text1",
            "value": "Sample"
          });

          playlistComponentFactory.loadPresentationNames.should.not.have.been.called;
        });

      });
    });
  });

  it("save:", function() {
    $scope.componentId = "TEST-ID";
    sandbox.stub($scope, "playlistItemsToJson").callsFake(function(){ return "fake data"; });

    $scope.save();

    expect($scope.playlistItemsToJson).to.be.calledOnce;
    expect(attributeDataFactory.setAttributeData.calledWith(
      "TEST-ID", "items", "fake data"
    )).to.be.true;
  });

  it("playlistItemsToJson:", function() {
    $scope.playlistItems = samplePlaylistItems;
    var items = $scope.playlistItemsToJson();

    expect(items.length).to.equal(2);
    expect(items[0]["play-until-done"]).to.be.true;
    expect(items[0]["duration"]).to.equal(20);
    expect(items[0]["transition-type"]).to.equal("fadeIn");
    expect(items[0].element["tagName"]).to.equal("rise-embedded-template");
    expect(items[0].element.attributes["template-id"]).to.equal("template-id-1");
    expect(items[0].element.attributes["presentation-id"]).to.equal("presentation-id-1");

    expect(items[1]["play-until-done"]).to.be.false;
    expect(items[1]["duration"]).to.equal(10);
    expect(items[1]["transition-type"]).to.equal("fadeIn");
    expect(items[1].element["tagName"]).to.equal("rise-text");
    expect(items[1].element.attributes["id"]).to.equal("text1");
    expect(items[1].element.attributes["value"]).to.equal("sample");
  });

  describe('showComponentsDropdown:', function() {
    it('should not show by default', function() {
      expect($scope.showComponentsDropdown()).to.be.false;
    });

    it('should not show if playlistComponents does not exist', function() {
      $scope.addVisualComponents = true;
      $scope.playlistComponents = null;

      expect($scope.showComponentsDropdown()).to.be.false;
    });

    it('should not show if there are no visual components', function() {
      $scope.addVisualComponents = true;
      $scope.playlistComponents = [];

      expect($scope.showComponentsDropdown()).to.be.false;
    });

    it('should show if there are visual components', function() {
      $scope.addVisualComponents = true;
      $scope.playlistComponents = ['rise-video'];

      expect($scope.showComponentsDropdown()).to.be.true;
    });
  });

  it("showProperties:", function() {
    $scope.showProperties();

    componentsFactory.editComponent.should.have.been.calledWith({
      type: 'rise-playlist-item'      
    });
  });

  it("showAddTemplates:", function() {
    $scope.showAddTemplates();

    componentsFactory.editComponent.should.have.been.calledWith({
      type: 'rise-presentation-selector'      
    });
  });

  it("addItems:", function() {
    $scope.playlistItems = ['item1'];
    sandbox.stub($scope, "save");

    $scope.addItems(['item2', 'item3']);

    expect($scope.playlistItems).to.deep.equal(['item1', 'item2', 'item3']);

    $scope.save.should.have.been.called;
  });

  it("removeItem:", function() {
    $scope.playlistItems = samplePlaylistItems;
    sandbox.stub($scope, "save");

    $scope.removeItem(0);

    expect($scope.playlistItems.length).to.equal(1);
  });

  it("sortItem:", function() {
    $scope.playlistItems = [{id:1},{id:2}];

    $scope.sortItem({data:{oldIndex:0,newIndex:1}});

    expect($scope.playlistItems[0].id).to.equal(2);
    expect($scope.playlistItems[1].id).to.equal(1);
  });

  it("moveItem:", function() {
    $scope.playlistItems = [{id:1},{id:2}];

    $scope.moveItem(0, 1);

    expect($scope.playlistItems[0].id).to.equal(2);
    expect($scope.playlistItems[1].id).to.equal(1);
  });

  it("durationToText:", function() {
    var item = {};

    item["play-until-done"] = true;
    expect($scope.durationToText(item)).to.equal("PUD");

    item["play-until-done"] = false;
    expect($scope.durationToText(item)).to.equal("10s");

    item["duration"] = 12345;
    expect($scope.durationToText(item)).to.equal("12345s");
  });

  describe('editProperties:', function() {
    beforeEach(function() {
      sandbox.stub($scope, 'showProperties');

      $scope.playlistItems = samplePlaylistItems;
    });

    describe('embedded template:', function() {
      it("should edit properties of a playlist item", function(done) {
        $scope.editProperties(0);

        blueprintFactory.isPlayUntilDone.should.have.been.calledWith($scope.selectedItem.productCode);

        setTimeout(function() {
          expect($scope.selectedItem["key"]).to.equal(0);
          expect($scope.selectedItem["play-until-done"]).to.be.true;
          expect($scope.selectedItem["play-until-done-supported"]).to.be.true;
          expect($scope.selectedItem["duration"]).to.equal(20);
          expect($scope.selectedItem["transition-type"]).to.equal("fadeIn");

          $scope.showProperties.should.have.been.called;

          done();
        }, 10);

      });
      
      it("should set play-until-done-supported to false", function(done) {
        blueprintFactory.isPlayUntilDone.resolves(false);

        $scope.editProperties(0);

        setTimeout(function() {
          expect($scope.selectedItem["key"]).to.equal(0);
          expect($scope.selectedItem["play-until-done"]).to.be.false;
          expect($scope.selectedItem["play-until-done-supported"]).to.be.false;
          expect($scope.selectedItem["duration"]).to.equal(20);
          expect($scope.selectedItem["transition-type"]).to.equal("fadeIn");

          $scope.showProperties.should.have.been.called;

          done();
        }, 10);

      });

      it("should set play-until-done-supported to false on failure", function(done) {
        blueprintFactory.isPlayUntilDone.rejects();

        $scope.editProperties(0);

        setTimeout(function() {
          expect($scope.selectedItem["key"]).to.equal(0);
          expect($scope.selectedItem["play-until-done"]).to.be.false;
          expect($scope.selectedItem["play-until-done-supported"]).to.be.false;
          expect($scope.selectedItem["duration"]).to.equal(20);
          expect($scope.selectedItem["transition-type"]).to.equal("fadeIn");

          $scope.showProperties.should.have.been.called;

          done();
        }, 10);
      });
    });

    it('should handle invalid duration and set default transition-type', function() {
      $scope.playlistItems[1].duration = 'invalid';
      $scope.playlistItems[1]['transition-type'] = '';

      $scope.editProperties(1);

      expect($scope.selectedItem["duration"]).to.equal(10);
      expect($scope.selectedItem["transition-type"]).to.equal('normal');
    });

    describe('visual components:', function() {
      it('should populate play-until-done', function() {
        $scope.editProperties(1);

        blueprintFactory.isPlayUntilDone.should.not.have.been.called;

        expect($scope.selectedItem["key"]).to.equal(1);
        expect($scope.selectedItem["play-until-done"]).to.be.false;
        expect($scope.selectedItem["play-until-done-supported"]).to.be.false;
        expect($scope.selectedItem["duration"]).to.equal(10);
        expect($scope.selectedItem["transition-type"]).to.equal("fadeIn");

        $scope.showProperties.should.have.been.called;
      });
    });
  });

  describe("saveProperties:", function() {
    beforeEach(function() {
      $scope.playlistItems = samplePlaylistItems;
      $scope.selectedItem = {
        "key": 0,
        "duration": 30,
        "play-until-done": false,
        "transition-type": "some-transition"
      };

      sandbox.stub($scope, "save");      
    });

    it('should update item and save', function() {
      $scope.saveProperties();

      expect($scope.playlistItems[0]["play-until-done"]).to.be.false;
      expect($scope.playlistItems[0]["duration"]).to.equal(30);
      expect($scope.playlistItems[0]["transition-type"]).to.equal("some-transition");
      expect($scope.save).to.be.calledOnce;
    });

    it('should handle invalid duration', function() {
      $scope.selectedItem.duration = 'invalid';

      $scope.saveProperties();

      expect($scope.playlistItems[0]["duration"]).to.equal(10);
    });

  });

  it('savePlayUntilDone:', function() {
    sandbox.stub($scope, 'saveProperties');

    $scope.selectedItem = {
      'play-until-done': true
    };

    $scope.savePlayUntilDone();

    expect($scope.selectedItem['play-until-done']).to.be.false;

    $scope.saveProperties.should.have.been.called;
  });

  it('getComponentByType:', function() {
    expect($scope.getComponentByType('rise-image')).to.be.ok;
    expect($scope.getComponentByType('rise-image').title).to.equal('Image');

    expect($scope.getComponentByType('rise-playlist')).to.not.be.ok;
  });

  it('editPlaylistItem:', function() {
    $scope.componentId = 'playlist1';
    $scope.playlistItems = [
      'template1',
      {
        tagName: 'tag'
      }
    ];

    $scope.editPlaylistItem(1);

    componentsFactory.editComponent.should.have.been.calledWith({
      type: 'tag',
      id: 'playlist1 1'
    });
  });

  describe('addPlaylistItem:', function() {
    beforeEach(function() {
      sandbox.stub($scope, "save");
    });

    it('should add the component and edit it', function() {
      $scope.componentId = 'playlist1';
      $scope.playlistItems = [
        'template1'
      ];

      $scope.addPlaylistItem('rise-text');

      expect($scope.playlistItems).to.have.length(2);
      expect($scope.playlistItems[1]['duration']).to.equal(10);
      expect($scope.playlistItems[1]['play-until-done']).to.be.false;
      expect($scope.playlistItems[1]['transition-type']).to.equal('normal');
      expect($scope.playlistItems[1]['tagName']).to.equal('rise-text');
      expect($scope.playlistItems[1]['attributes']).to.be.an('object');

      $scope.save.should.have.been.called;

      componentsFactory.editComponent.should.have.been.calledWith({
        type: 'rise-text',
        id: 'playlist1 1'
      });
    });

    it('should set playUntilDone', function() {
      $scope.playlistItems = [];

      $scope.addPlaylistItem('rise-video');

      expect($scope.playlistItems[0]['duration']).to.equal(10);
      expect($scope.playlistItems[0]['play-until-done']).to.be.true;
      expect($scope.playlistItems[0]['transition-type']).to.equal('normal');
      expect($scope.playlistItems[0]['tagName']).to.equal('rise-video');
      expect($scope.playlistItems[0]['attributes']).to.deep.equal({});
    });

  });

  describe('$loading: ', function() {
    it('should stop spinner', function() {
      $loading.stop.should.have.been.calledWith('rise-playlist-loader');
    });

    it('should start spinner', function(done) {
      playlistComponentFactory.loading = true;
      $scope.$digest();
      setTimeout(function() {
        $loading.start.should.have.been.calledWith('rise-playlist-loader');

        done();
      }, 10);
    });
  });

});
