'use strict';

describe('directive: templateComponentRichText', function() {
  var $scope,
      element,
      factory;

  beforeEach(function() {
    factory = { selected: { id: "TEST-ID" } };
  });

  beforeEach(module('risevision.template-editor.directives'));
  beforeEach(module('risevision.template-editor.controllers'));
  beforeEach(module('risevision.template-editor.services'));
  beforeEach(module('risevision.editor.services'));
  beforeEach(module('ui.tinymce'));
  beforeEach(module(mockTranslate()));
  beforeEach(module(function ($provide) {
    $provide.service('templateEditorFactory', function() {
      return factory;
    });
  }));

  beforeEach(inject(function($compile, $rootScope, $templateCache){
    $templateCache.put('partials/template-editor/components/component-rich-text.html', '<p>mock</p>');
    $scope = $rootScope.$new();

    $scope.registerDirective = sinon.stub();
    $scope.setAttributeData = sinon.stub();
    $scope.getAvailableAttributeData = sinon.stub().returns('data');
    $scope.getBlueprintData = sinon.stub().returns(false);

    element = $compile("<template-component-rich-text></template-component-rich-text>")($scope);
    $scope = element.scope();
    $scope.$digest();
  }));

  it('should exist', function() {
    expect($scope).to.be.ok;
    expect($scope.factory).to.be.ok;
    expect($scope.factory).to.deep.equal({ selected: { id: "TEST-ID" } })
    expect($scope.registerDirective).to.have.been.called;

    var directive = $scope.registerDirective.getCall(0).args[0];
    expect(directive).to.be.ok;
    expect(directive.type).to.equal('rise-rich-text');
    expect(directive.iconType).to.equal('streamline');
    expect(directive.icon).to.exist;
    expect(directive.show).to.be.a('function');
  });

  it('should load richText from attribute data', function() {
    var directive = $scope.registerDirective.getCall(0).args[0];
    var sampleRichText = "test text";
    $scope.getAvailableAttributeData.returns(sampleRichText);

    directive.show();

    expect($scope.componentId).to.equal("TEST-ID");
    expect($scope.data.richText).to.equal(sampleRichText);
  });

  it('should save richText to attribute data', function() {
    var directive = $scope.registerDirective.getCall(0).args[0];
    var sampleRichText = "test text";
    $scope.getAvailableAttributeData.returns(sampleRichText);

    directive.show();

    $scope.data.richText = "updated text";

    $scope.save();

    expect($scope.setAttributeData.calledWith(
      "TEST-ID", "richtext", "updated text"
    )).to.be.true;
  });

  it('should save googleFonts to attribute data', function() {
    var directive = $scope.registerDirective.getCall(0).args[0];
    var sampleRichText = "plain text" + 
      "<span style='font-family: arial, helvetica;'>Standard font</span>" +
      "<span style='font-family: Roboto, sans-serif;'>Google font</span>";
    $scope.getAvailableAttributeData.returns(sampleRichText);

    directive.show();

    $scope.save();

    expect($scope.setAttributeData.calledWith(
      "TEST-ID", "googlefonts",  ['Roboto']
    )).to.be.true;
  });

  it('should configure font sizes', function() {
    expect($scope.tinymceOptions.fontsize_formats).to.include(" 96px");
    expect($scope.tinymceOptions.fontsize_formats).to.include(" 300px");
  });
});
