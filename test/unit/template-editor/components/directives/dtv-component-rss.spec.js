'use strict';

describe('directive: templateComponentRss', function() {
  var $scope,
    element,
    factory,
    attributeDataFactory,
    rssFeedValidation,
    sandbox = sinon.sandbox.create();

  beforeEach(function() {
    factory = { selected: { id: "TEST-ID" } };

    rssFeedValidation = {
      isParsable: sandbox.stub().returns(Q.resolve('VALID')),
      isValid: sandbox.stub().returns(Q.resolve('VALID'))
    };
  });

  beforeEach(module('risevision.template-editor.directives'));
  beforeEach(module('risevision.template-editor.controllers'));
  beforeEach(module('risevision.template-editor.services'));
  beforeEach(module('risevision.editor.services'));
  beforeEach(module(mockTranslate()));
  beforeEach(module(function ($provide) {
    $provide.service('templateEditorFactory', function() {
      return factory;
    });

    $provide.service('attributeDataFactory', function() {
      return {
        setAttributeData: sinon.stub()
      };
    });

    $provide.service('rssFeedValidation', function() {
      return rssFeedValidation;
    });
  }));

  beforeEach(inject(function($compile, $rootScope, $templateCache, $injector){
    attributeDataFactory = $injector.get('attributeDataFactory');

    $templateCache.put('partials/template-editor/components/component-rss.html', '<p>mock</p>');
    $scope = $rootScope.$new();

    $scope.registerDirective = sinon.stub();

    element = $compile("<template-component-rss></template-component-rss>")($scope);
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
    expect(directive.type).to.equal('rise-data-rss');
    expect(directive.show).to.be.a('function');
  });

  it('should load feed url from attribute data', function() {
    var directive = $scope.registerDirective.getCall(0).args[0];
    var sampleData = {
      'feedurl': 'http://rss.cnn.com/rss/cnn_topstories.rss'
    };

    attributeDataFactory.getAvailableAttributeData = function(componentId, attributeName) {
      return sampleData[attributeName];
    };

    directive.show();

    expect($scope.componentId).to.equal("TEST-ID");
    expect($scope.feedUrl).to.equal(sampleData['feedurl']);
  });

  it('should load max items from attribute data', function() {
    var directive = $scope.registerDirective.getCall(0).args[0];
    var sampleData = {
      'feedurl': 'http://rss.cnn.com/rss/cnn_topstories.rss',
      'maxitems': 5
    };

    attributeDataFactory.getAvailableAttributeData = function(componentId, attributeName) {
      return sampleData[attributeName];
    };

    directive.show();

    expect($scope.componentId).to.equal("TEST-ID");
    expect($scope.maxItems).to.equal(sampleData['maxitems'].toString());
  });

  it('should set maxItems to 1 when default value and blueprint are undefined', function() {
    var directive = $scope.registerDirective.getCall(0).args[0];

    attributeDataFactory.getAvailableAttributeData = function(componentId, attributeName) {
      return undefined;
    };

    directive.show();

    expect($scope.componentId).to.equal("TEST-ID");
    expect($scope.maxItems).to.equal('1');
  });

  it('should save feed and check feed parsability and check if valid RSS when is shown', function(done) {
    var directive = $scope.registerDirective.getCall(0).args[0];
    var sampleData = {
      'feedurl': 'http://rss.cnn.com/rss/cnn_topstories.rss',
      'maxitems': 5
    };

    attributeDataFactory.getAvailableAttributeData = function(componentId, attributeName) {
      return sampleData[attributeName];
    };

    directive.show();

    expect($scope.feedUrl).to.equal(sampleData['feedurl']);
    expect(rssFeedValidation.isParsable).to.have.been.called;

    setTimeout(function(){
      expect(rssFeedValidation.isValid).to.have.been.called;
      expect(attributeDataFactory.setAttributeData).to.have.been.called;

      done();
    }, 200);
  });

  it('should not save or check feed parsability if invalid URL format', function() {
    var directive = $scope.registerDirective.getCall(0).args[0];
    var sampleData = {};

    attributeDataFactory.getAvailableAttributeData = function(componentId, attributeName) {
      return sampleData[attributeName];
    };

    directive.show();

    var invalidUrl = 'http://rss';
    $scope.feedUrl = invalidUrl;
    $scope.saveFeed();

    // only 1 call from initial load, no subsequent call from invalid url entry
    expect(rssFeedValidation.isParsable.callCount).to.equal(1);
    expect(attributeDataFactory.setAttributeData).to.not.have.been.called;
  });

  it('should not save or check feed validity if feed parser response is not VALID', function(done) {
    var directive = $scope.registerDirective.getCall(0).args[0];
    var sampleData = {};

    rssFeedValidation.isParsable = sandbox.stub().returns(Q.resolve('NON_FEED'));

    attributeDataFactory.getAvailableAttributeData = function(componentId, attributeName) {
      return sampleData[attributeName];
    };

    directive.show();

    var invalidUrl = 'http://test.com';
    $scope.feedUrl = invalidUrl;
    $scope.saveFeed();

    // 1 call from initial load and 1 call from feed url change
    expect(rssFeedValidation.isParsable.callCount).to.equal(2);

    setTimeout(function(){
      expect(attributeDataFactory.setAttributeData).to.not.have.been.called;
      expect(rssFeedValidation.isValid).to.not.have.been.called;

      done();
    }, 200);
  });

});
