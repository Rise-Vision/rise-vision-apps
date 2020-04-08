"use strict";

describe("directive: templateComponentPlaylist", function() {
  var sandbox = sinon.sandbox.create(),
      $scope,
      $loading,
      element,
      factory,
      editorFactory,
      sampleAttributeData,
      sampleSelectedTemplates,
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
              "presentation-id": "presentation-id-2",
              "template-id": "template-id-2"
            },
            "tagName": "rise-embedded-template"
          },
          "play-until-done": true,
          "transition-type": "fadeIn"
        }
      ]
    };

    sampleSelectedTemplates = [{
      "duration": 20,
      "play-until-done": true,
      "transition-type": "fadeIn",
      "id": "presentation-id-1",
      "productCode": "template-id-1"
    },{
      "duration": 20,
      "play-until-done": true,
      "transition-type": "fadeIn",
      "id": "presentation-id-2",
      "productCode": "template-id-2"
    }];

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
        isPlayUntilDone: function() {return Q.resolve(true)}
      };
    });
  }));

  beforeEach(inject(function($injector, $compile, $rootScope, $templateCache){
    $templateCache.put("partials/template-editor/components/component-playlist.html", "<p>mock</p>");
    $scope = $rootScope.$new();
    $loading = $injector.get('$loading');
    editorFactory = $injector.get('editorFactory');

    $scope.registerDirective = sinon.stub();
    $scope.setAttributeData = sinon.stub();

    element = $compile("<template-component-playlist></template-component-playlistt>")($scope);
    $scope = element.scope();
    $scope.$digest();
  }));

  it("should exist", function() {
    expect($scope).to.be.ok;
    expect($scope.factory).to.be.ok;
    expect($scope.factory).to.deep.equal({ selected: { id: "TEST-ID" }, presentation: { id: "TEST-ID" }});
    expect($scope.registerDirective).to.have.been.called;

    var directive = $scope.registerDirective.getCall(0).args[0];
    expect(directive).to.be.ok;
    expect(directive.type).to.equal("rise-playlist");
    expect(directive.iconType).to.equal("streamline");
    expect(directive.icon).to.exist;
    expect(directive.show).to.be.a("function");
  });

  it("should load items from attribute data", function(done) {
    var directive = $scope.registerDirective.getCall(0).args[0];

    $scope.getAvailableAttributeData = function(componentId, attributeName) {
      return sampleAttributeData[attributeName];
    };

    $scope.selectedTemplates = sampleSelectedTemplates; //some garbage data from past session

    directive.show();

    expect($scope.componentId).to.equal("TEST-ID");
    expect($scope.selectedTemplates).to.eql([]);

    setTimeout(function() {

      expect($scope.selectedTemplates.length).to.equal(1);
      expect($scope.selectedTemplates[0]["duration"]).to.equal(10);
      expect($scope.selectedTemplates[0]["play-until-done"]).to.equal(true);
      expect($scope.selectedTemplates[0]["transition-type"]).to.equal("fadeIn");
      expect($scope.selectedTemplates[0]["id"]).to.equal("presentation-id-1");
      expect($scope.selectedTemplates[0]["productCode"]).to.equal("template-id-1");
      //check if name is loaded from server
      expect($scope.selectedTemplates[0]["name"]).to.equal("some name");

      done();
    }, 10);

  });

  it("should indicate any templates that are now 'Unknown' from being deleted", function() {
    var directive = $scope.registerDirective.getCall(0).args[0];

    $scope.getAvailableAttributeData = function(componentId, attributeName) {
      return sampleAttributeData[attributeName];
    };

    $scope.selectedTemplates = sampleSelectedTemplates;

    directive.show();

    setTimeout(function() {
      expect($scope.selectedTemplates[1]["id"]).to.equal("presentation-id-2");
      expect($scope.selectedTemplates[1]["productCode"]).to.equal("template-id-2");
      expect($scope.selectedTemplates[1]["name"]).to.equal("Unknown");
      expect($scope.selectedTemplates[1]["revisionStatusName"]).to.equal("Template not found.");
      expect($scope.selectedTemplates[1]["removed"]).to.be.true;

      done();
    }, 10);
  });

  it("should save items to attribute data", function() {
    $scope.componentId = "TEST-ID";
    sandbox.stub($scope, "selectedTemplatesToJson").callsFake(function(){ return "fake data"; });

    $scope.save();

    expect($scope.selectedTemplatesToJson).to.be.calledOnce;
    expect($scope.setAttributeData.calledWith(
      "TEST-ID", "items", "fake data"
    )).to.be.true;
  });

  it("should convert selectedTemplates to 'items' field", function() {
    $scope.selectedTemplates = sampleSelectedTemplates;
    var items = $scope.selectedTemplatesToJson();

    expect(items.length).to.equal(1);
    expect(items[0]["play-until-done"]).to.equal(true);
    expect(items[0]["duration"]).to.equal(20);
    expect(items[0]["transition-type"]).to.equal("fadeIn");
    expect(items[0].element["tagName"]).to.equal("rise-embedded-template");
    expect(items[0].element.attributes["template-id"]).to.equal("template-id-1");
    expect(items[0].element.attributes["presentation-id"]).to.equal("presentation-id-1");
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
    $scope.showSelectedTemplates();
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
    $scope.selectedTemplates = [];
    sandbox.stub($scope, "save");

    // select second template
    $scope.selectTemplate(1);

    $scope.addTemplates();

    setTimeout(function() {
      // Propagate $q.all promise resolution using $apply()
      $scope.$apply();

      expect($scope.selectedTemplates.length).to.equal(1);
      expect($scope.selectedTemplates[0].id).to.equal("id2");

      //confirm PUD value is copied from the blueprint
      expect($scope.selectedTemplates[0]["play-until-done"]).to.equal(true);

      expect($loading.start).to.be.calledOnce;
      expect($loading.stop).to.be.calledOnce;
      done();
    }, 10);
  });

  it("should remove templates from playlist", function() {
    $scope.selectedTemplates = sampleSelectedTemplates;
    sandbox.stub($scope, "save");

    $scope.removeTemplate(0);

    expect($scope.selectedTemplates.length).to.equal(0);
  });

  it("calling sortItem should move item in playlist", function() {
    $scope.selectedTemplates = [{id:1},{id:2}];

    $scope.sortItem({data:{oldIndex:0,newIndex:1}});

    expect($scope.selectedTemplates[0].id).to.equal(2);
    expect($scope.selectedTemplates[1].id).to.equal(1);
  });

  it("should move item in playlist", function() {
    $scope.selectedTemplates = [{id:1},{id:2}];

    $scope.moveItem(0, 1);

    expect($scope.selectedTemplates[0].id).to.equal(2);
    expect($scope.selectedTemplates[1].id).to.equal(1);
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

  it("should edit properties of a playlist item", function() {
    $scope.selectedTemplates = sampleSelectedTemplates;

    $scope.editProperties(0);

    expect($scope.selectedItem["key"]).to.equal(0);
    expect($scope.selectedItem["play-until-done"]).to.equal("true");
    expect($scope.selectedItem["duration"]).to.equal(20);
    expect($scope.selectedItem["transition-type"]).to.equal("fadeIn");
  });

  it("should save properties of a playlist item", function() {
    $scope.selectedTemplates = sampleSelectedTemplates;
    $scope.selectedItem = {
      "key": 0,
      "duration": 30,
      "play-until-done": false,
      "transition-type": "some-transition"
    };

    sandbox.stub($scope, "save");

    $scope.saveProperties();

    expect($scope.selectedTemplates[0]["play-until-done"]).to.equal(false);
    expect($scope.selectedTemplates[0]["duration"]).to.equal(30);
    expect($scope.selectedTemplates[0]["transition-type"]).to.equal("some-transition");
    expect($scope.save).to.be.calledOnce;
  });

  it("should call editorFactory.addPresentationModal()", function() {
    $scope.createNewTemplate();

    expect(editorFactory.addPresentationModal).to.be.calledOnce;
  });

});
