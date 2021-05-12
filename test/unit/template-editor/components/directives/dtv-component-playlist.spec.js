"use strict";

describe("directive: templateComponentPlaylist", function() {
  var sandbox = sinon.sandbox.create(),
      $scope,
      $loading,
      element,
      factory,
      attributeDataFactory,
      editorFactory,
      blueprintFactory,
      sampleAttributeData,
      samplePlaylistItems,
      sampleTemplatesFactory;

  //add polyfill for Number.isInteger if phantomjs does not have it
  Number.isInteger = Number.isInteger || function(value) {
    return typeof value === "number" &&
      isFinite(value) &&
      Math.floor(value) === value;
  };

  beforeEach(function() {
    factory = {
      selected: { id: "TEST-ID" },
      presentation: { id: "TEST-ID" }
    };

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
  beforeEach(module("risevision.template-editor.controllers"));
  beforeEach(module("risevision.template-editor.services"));
  beforeEach(module("risevision.editor.services"));
  beforeEach(module(mockTranslate()));
  beforeEach(module(function ($provide) {
    $provide.service("templateEditorFactory", function() {
      return factory;
    });

    $provide.service('attributeDataFactory', function() {
      return {
        setAttributeData: sandbox.stub(),
        getBlueprintData: sandbox.stub()
      };
    });

    $provide.service("ScrollingListService", function() {
      return function () {};
    });

    $provide.service("presentation", function() {
      return {
        list: function() {return Q.resolve({items:[{id: "presentation-id-1", name: "some name"}]})},
        buildFilterString: function() { return ""; }
      };
    });

    $provide.service('$loading', function() {
      return {
        start: sandbox.stub(),
        stop: sandbox.stub()
      };
    });

    $provide.service("editorFactory", function() {
      return {
        addPresentationModal: sandbox.stub()
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
    $templateCache.put("partials/template-editor/components/component-playlist.html", "<p>mock</p>");
    $scope = $rootScope.$new();
    $loading = $injector.get('$loading');
    attributeDataFactory = $injector.get('attributeDataFactory');
    editorFactory = $injector.get('editorFactory');
    blueprintFactory = $injector.get('blueprintFactory');

    $scope.registerDirective = sandbox.stub();
    $scope.editComponent = sandbox.stub();

    element = $compile("<template-component-playlist></template-component-playlistt>")($scope);
    $scope = element.scope();
    $scope.$digest();
  }));

  it("should exist", function() {
    expect($scope).to.be.ok;
    expect($scope.factory).to.be.ok;
    expect($scope.factory).to.deep.equal({ selected: { id: "TEST-ID" }, presentation: { id: "TEST-ID" }});
    expect($scope.registerDirective).to.have.been.called;

    expect($scope.playlistComponents).to.be.an('array');
    expect($scope.addVisualComponents).to.be.false;

    expect($scope.showComponentsDropdown).to.be.a('function')

    expect($scope.getComponentByType).to.be.a('function');
    expect($scope.addPlaylistItem).to.be.a('function');
    expect($scope.editPlaylistItem).to.be.a('function');

    var directive = $scope.registerDirective.getCall(0).args[0];
    expect(directive).to.be.ok;
    expect(directive.type).to.equal("rise-playlist");
    expect(directive.show).to.be.a("function");
  });

  describe('registerDirective:', function() {
    it('should initialize', function() {
      $scope.registerDirective.should.have.been.called;

      var directive = $scope.registerDirective.getCall(0).args[0];
      expect(directive).to.be.ok;
      expect(directive.type).to.equal("rise-playlist");
      expect(directive.show).to.be.a("function");
      expect(directive.onBackHandler).to.be.a("function");
    });

    describe('onBackHandler:', function() {
      it ('should enable default navigation if no view is active:', function() {
        expect($scope.registerDirective.getCall(0).args[0].onBackHandler()).to.not.be.ok;
        expect($scope.view).to.not.be.ok;
      });

      it ('should reset view and return true:', function() {
        $scope.view = 'some-view';

        expect($scope.registerDirective.getCall(0).args[0].onBackHandler()).to.be.true;
        expect($scope.view).to.not.be.ok;
      });
    });

    describe('show:', function() {
      describe('_updatePlaylistComponents:', function() {
        var playlistComponents;

        beforeEach(function() {
          playlistComponents = $scope.playlistComponents;

          attributeDataFactory.getAvailableAttributeData = sandbox.stub();
        });

        it('should set addVisualComponents to false based on isRiseInit being false', function() {
          blueprintFactory.isRiseInit.returns(false);

          $scope.addVisualComponents = true;

          $scope.registerDirective.getCall(0).args[0].show();

          expect($scope.addVisualComponents).to.be.false;
        });

        it('should check blueprint data for allowed-components', function() {
          $scope.registerDirective.getCall(0).args[0].show();

          attributeDataFactory.getBlueprintData.should.have.been.calledWith('TEST-ID', 'allowed-components');

          expect($scope.playlistComponents).to.equal(playlistComponents);
        });

        it('should reset playlist components', function() {
          $scope.playlistComponents = null;

          $scope.registerDirective.getCall(0).args[0].show();

          expect($scope.playlistComponents).to.equal(playlistComponents);
        });

        it('should handle * for allowed-components', function() {
          attributeDataFactory.getBlueprintData.returns('*');
          $scope.registerDirective.getCall(0).args[0].show();

          expect($scope.playlistComponents).to.equal(playlistComponents);
        });

        it('should parse csv values for allowed-components', function() {
          attributeDataFactory.getBlueprintData.returns('rise-video,rise-slides');
          $scope.registerDirective.getCall(0).args[0].show();

          expect($scope.playlistComponents).to.have.length(2);
        });

        it('should ignore rise-embedded-template', function() {
          attributeDataFactory.getBlueprintData.returns('rise-embedded-template,rise-video,rise-slides');
          $scope.registerDirective.getCall(0).args[0].show();

          expect($scope.playlistComponents).to.have.length(2);
        });

      });
    });
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

  it("should load items from attribute data", function(done) {
    var directive = $scope.registerDirective.getCall(0).args[0];

    attributeDataFactory.getAvailableAttributeData = function(componentId, attributeName) {
      return sampleAttributeData[attributeName];
    };

    $scope.playlistItems = samplePlaylistItems; //some garbage data from past session

    directive.show();

    expect($scope.componentId).to.equal("TEST-ID");
    expect($scope.playlistItems).to.eql([]);

    setTimeout(function() {

      expect($scope.playlistItems.length).to.equal(2);
      expect($scope.playlistItems[0]["duration"]).to.equal(10);
      expect($scope.playlistItems[0]["play-until-done"]).to.be.true;
      expect($scope.playlistItems[0]["transition-type"]).to.equal("fadeIn");
      expect($scope.playlistItems[0]["id"]).to.equal("presentation-id-1");
      expect($scope.playlistItems[0]["productCode"]).to.equal("template-id-1");
      //check if name is loaded from server
      expect($scope.playlistItems[0]["name"]).to.equal("some name");
      
      expect($scope.playlistItems[0]["removed"]).to.be.false;

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
      expect($scope.playlistItems[1]["name"]).to.not.be.ok;

      expect($scope.playlistItems[1]["tagName"]).to.equal("rise-text");
      expect($scope.playlistItems[1].attributes).to.deep.equal({
        "id": "text1",
        "value": "Sample"
      });

      done();
    }, 10);

  });

  it("should indicate any templates that are now 'Unknown' from being deleted", function(done) {
    var directive = $scope.registerDirective.getCall(0).args[0],
        copySampleAttributeData = angular.copy(sampleAttributeData);

    // add deleted item
    copySampleAttributeData.items.push({
      "duration": 10,
      "element": {
        "attributes": {
          "presentation-id": "presentation-id-2",
          "template-id": "template-id-2"
        },
        "tagName": "rise-embedded-template"
      },
      "play-until-done": true,
      "transition-type": "fadeIn"
    });

    attributeDataFactory.getAvailableAttributeData = function(componentId, attributeName) {
      return copySampleAttributeData[attributeName];
    };

    directive.show();

    setTimeout(function() {
      expect($scope.playlistItems[2]["id"]).to.equal("presentation-id-2");
      expect($scope.playlistItems[2]["productCode"]).to.equal("template-id-2");
      expect($scope.playlistItems[2]["name"]).to.equal("Unknown");
      expect($scope.playlistItems[2]["revisionStatusName"]).to.equal("Template not found.");
      expect($scope.playlistItems[2]["removed"]).to.be.true;

      done();
    }, 10);
  });

  it("should load attribute data correctly even without embedded templates", function() {
    var directive = $scope.registerDirective.getCall(0).args[0];
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
    expect($scope.playlistItems[0]["name"]).to.not.be.ok;

    expect($scope.playlistItems[0]["tagName"]).to.equal("rise-text");
    expect($scope.playlistItems[0].attributes).to.deep.equal({
      "id": "text1",
      "value": "Sample"
    });

  });

  it("should save items to attribute data", function() {
    $scope.componentId = "TEST-ID";
    sandbox.stub($scope, "playlistItemsToJson").callsFake(function(){ return "fake data"; });

    $scope.save();

    expect($scope.playlistItemsToJson).to.be.calledOnce;
    expect(attributeDataFactory.setAttributeData.calledWith(
      "TEST-ID", "items", "fake data"
    )).to.be.true;
  });

  it("should convert playlistItems to 'items' field", function() {
    $scope.playlistItems = samplePlaylistItems;
    var items = $scope.playlistItemsToJson();

    expect(items.length).to.equal(2);
    expect(items[0]["play-until-done"]).to.equal(true);
    expect(items[0]["duration"]).to.equal(20);
    expect(items[0]["transition-type"]).to.equal("fadeIn");
    expect(items[0].element["tagName"]).to.equal("rise-embedded-template");
    expect(items[0].element.attributes["template-id"]).to.equal("template-id-1");
    expect(items[0].element.attributes["presentation-id"]).to.equal("presentation-id-1");

    expect(items[1]["play-until-done"]).to.equal(false);
    expect(items[1]["duration"]).to.equal(10);
    expect(items[1]["transition-type"]).to.equal("fadeIn");
    expect(items[1].element["tagName"]).to.equal("rise-text");
    expect(items[1].element.attributes["id"]).to.equal("text1");
    expect(items[1].element.attributes["value"]).to.equal("sample");
  });

  it("should show spinner when templates factory is initializing", function(done) {
    $scope.initTemplatesFactory();
    $scope.templatesFactory = {loadingItems: true};
    $scope.$digest();
    setTimeout(function() {
      expect($loading.start).to.be.calledOnce;
      done();
    }, 10);
  });

  it("should hide spinner when templates factory finished initializing", function(done) {
    $scope.templatesFactory = {loadingItems: true};
    $scope.initTemplatesFactory();
    $scope.templatesFactory.loadingItems = false;
    $scope.$digest();
    setTimeout(function() {
      expect($loading.stop).to.be.calledOnce;
      done();
    }, 10);
  });

  it("should show default view", function() {
    $scope.showPlaylistItems();
    expect($scope.view).to.equal("");
  });

  it("should show properties view", function() {
    $scope.showProperties();
    expect($scope.view).to.equal("edit");
  });

  it("should show add-templates view", function() {
    sandbox.stub($scope, "searchTemplates");

    $scope.showAddTemplates();

    expect($scope.view).to.equal("add-templates");
    expect($scope.searchTemplates).to.be.calledOnce;
  });

  it("should reset search keyword", function() {
    sandbox.stub($scope, "searchTemplates");
    $scope.searchKeyword = "something";

    $scope.resetSearch();

    expect($scope.searchKeyword).to.equal("");
    expect($scope.searchTemplates).to.be.calledOnce;
  });

  it("searchTemplates should call initTemplatesFactory if factory is not initialized", function() {
    sandbox.stub($scope, "initTemplatesFactory");
    $scope.templatesFactory = null;

    $scope.searchTemplates();

    expect($scope.initTemplatesFactory).to.be.calledOnce;
    expect($scope.templatesSearch.filter).to.equal(" AND NOT id:TEST-ID");
  });

  it("searchTemplates should call doSearch if factory is initialized", function() {
    $scope.templatesFactory = {doSearch:function(){}};
    sandbox.stub($scope.templatesFactory, "doSearch");

    $scope.searchTemplates();

    expect($scope.templatesFactory.doSearch).to.be.calledOnce;
  });

  it("should search templates when user presses enter", function() {
    sandbox.stub($scope, "searchTemplates");

    $scope.searchKeyPressed({which: 13});

    expect($scope.searchTemplates).to.be.calledOnce;
  });

  it("should sort templates by last modified date in descending order", function() {
    expect($scope.templatesSearch.sortBy).to.equal("changeDate");
    expect($scope.templatesSearch.reverse).to.equal(true);
  });

  it("should select / deselect a template", function() {
    $scope.templatesFactory = sampleTemplatesFactory;

    // calling selectTemplate(0) first time should select a template
    $scope.selectTemplate(0);
    expect($scope.canAddTemplates).to.equal(true);

    // calling selectTemplate(0) second time should deselect a template
    $scope.selectTemplate(0);
    expect($scope.canAddTemplates).to.equal(false);
  });

  it("should add selected templates to playlist and assign default PUD value", function(done) {
    $scope.templatesFactory = sampleTemplatesFactory;
    $scope.playlistItems = [];
    sandbox.stub($scope, "save");

    // select second template
    $scope.selectTemplate(1);

    $scope.addTemplates();

    setTimeout(function() {
      // Propagate $q.all promise resolution using $apply()
      $scope.$apply();

      expect($scope.playlistItems.length).to.equal(1);
      expect($scope.playlistItems[0].id).to.equal("id2");

      //confirm PUD value is copied from the blueprint
      expect($scope.playlistItems[0]["play-until-done"]).to.equal(true);

      expect($loading.start).to.be.calledOnce;
      expect($loading.stop).to.be.calledOnce;
      done();
    }, 10);
  });

  it("should remove templates from playlist", function() {
    $scope.playlistItems = samplePlaylistItems;
    sandbox.stub($scope, "save");

    $scope.removeItem(0);

    expect($scope.playlistItems.length).to.equal(1);
  });

  it("calling sortItem should move item in playlist", function() {
    $scope.playlistItems = [{id:1},{id:2}];

    $scope.sortItem({data:{oldIndex:0,newIndex:1}});

    expect($scope.playlistItems[0].id).to.equal(2);
    expect($scope.playlistItems[1].id).to.equal(1);
  });

  it("should move item in playlist", function() {
    $scope.playlistItems = [{id:1},{id:2}];

    $scope.moveItem(0, 1);

    expect($scope.playlistItems[0].id).to.equal(2);
    expect($scope.playlistItems[1].id).to.equal(1);
  });

  it("should format the duration label", function() {
    var item = {};

    item["play-until-done"] = true;
    expect($scope.durationToText(item)).to.equal("PUD");

    item["play-until-done"] = false;
    expect($scope.durationToText(item)).to.equal("10 seconds");

    item["duration"] = 12345;
    expect($scope.durationToText(item)).to.equal("12345 seconds");
  });

  describe('editProperties:', function() {
    describe('embedded template:', function() {
      it("should edit properties of a playlist item", function(done) {
        $scope.playlistItems = samplePlaylistItems;

        $scope.editProperties(0);

        blueprintFactory.isPlayUntilDone.should.have.been.calledWith($scope.selectedItem.productCode);

        setTimeout(function() {
          expect($scope.selectedItem["key"]).to.equal(0);
          expect($scope.selectedItem["play-until-done"]).to.equal("true");
          expect($scope.selectedItem["play-until-done-supported"]).to.equal(true);
          expect($scope.selectedItem["duration"]).to.equal(20);
          expect($scope.selectedItem["transition-type"]).to.equal("fadeIn");

          expect($scope.view).to.equal("edit");

          done();
        }, 10);

      });
      
      it("should set play-until-done-supported to false", function(done) {
        $scope.playlistItems = samplePlaylistItems;

        blueprintFactory.isPlayUntilDone.resolves(false);

        $scope.editProperties(0);

        setTimeout(function() {
          expect($scope.selectedItem["key"]).to.equal(0);
          expect($scope.selectedItem["play-until-done"]).to.equal("false");
          expect($scope.selectedItem["play-until-done-supported"]).to.equal(false);
          expect($scope.selectedItem["duration"]).to.equal(20);
          expect($scope.selectedItem["transition-type"]).to.equal("fadeIn");

          expect($scope.view).to.equal("edit");

          done();
        }, 10);

      });

      it("should set play-until-done-supported to false on failure", function(done) {
        $scope.playlistItems = samplePlaylistItems;

        blueprintFactory.isPlayUntilDone.rejects();

        $scope.editProperties(0);

        setTimeout(function() {
          expect($scope.selectedItem["key"]).to.equal(0);
          expect($scope.selectedItem["play-until-done"]).to.equal("false");
          expect($scope.selectedItem["play-until-done-supported"]).to.equal(false);
          expect($scope.selectedItem["duration"]).to.equal(20);
          expect($scope.selectedItem["transition-type"]).to.equal("fadeIn");

          expect($scope.view).to.equal("edit");

          done();
        }, 10);
      });
    });

    describe('visual components:', function() {
      it('should populate play-until-done', function() {
        $scope.playlistItems = samplePlaylistItems;

        $scope.editProperties(1);

        blueprintFactory.isPlayUntilDone.should.not.have.been.called;

        expect($scope.selectedItem["key"]).to.equal(1);
        expect($scope.selectedItem["play-until-done"]).to.equal("false");
        expect($scope.selectedItem["play-until-done-supported"]).to.equal(false);
        expect($scope.selectedItem["duration"]).to.equal(10);
        expect($scope.selectedItem["transition-type"]).to.equal("fadeIn");

        expect($scope.view).to.equal("edit");
      });
    });
  });

  it("should save properties of a playlist item", function() {
    $scope.playlistItems = samplePlaylistItems;
    $scope.selectedItem = {
      "key": 0,
      "duration": 30,
      "play-until-done": false,
      "transition-type": "some-transition"
    };

    sandbox.stub($scope, "save");

    $scope.saveProperties();

    expect($scope.playlistItems[0]["play-until-done"]).to.equal(false);
    expect($scope.playlistItems[0]["duration"]).to.equal(30);
    expect($scope.playlistItems[0]["transition-type"]).to.equal("some-transition");
    expect($scope.save).to.be.calledOnce;
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

    $scope.editComponent.should.have.been.calledWith({
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

      $scope.editComponent.should.have.been.calledWith({
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

  it("should call editorFactory.addPresentationModal()", function() {
    $scope.createNewTemplate();

    expect(editorFactory.addPresentationModal).to.be.calledOnce;
  });

});
