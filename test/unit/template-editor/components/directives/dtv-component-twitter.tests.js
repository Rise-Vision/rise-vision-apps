'use strict';

describe('directive: templateComponentTwitter', function() {
  var $scope,
    element,
    factory,
    oauthService;

  beforeEach(function() {
    factory = { selected: { id: "TEST-ID" } };
    oauthService = {};
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

    $provide.service('TwitterOAuthService', function() {
      return oauthService;
    });
  }));

  beforeEach(inject(function($compile, $rootScope, $templateCache){
    $templateCache.put('partials/template-editor/components/component-twitter.html', '<p>mock</p>');
    $scope = $rootScope.$new();

    $scope.registerDirective = sinon.stub();
    $scope.setAttributeData = sinon.stub();

    element = $compile("<template-component-twitter></template-component-twitter>")($scope);
    $scope = element.scope();
    $scope.$digest();
  }));

  it('should exist', function() {
    expect($scope).to.be.ok;
    expect($scope.factory).to.be.ok;
    expect($scope.factory).to.deep.equal({ selected: { id: "TEST-ID" } });
    expect($scope.registerDirective).to.have.been.called;

    var directive = $scope.registerDirective.getCall(0).args[0];
    expect(directive).to.be.ok;
    expect(directive.type).to.equal('rise-data-twitter');
    expect(directive.iconType).to.equal('streamline');
    expect(directive.icon).to.exist;
    expect(directive.show).to.be.a('function');
  });

  it('should set flags when oauth service connection works', function(done) {
    oauthService.authenticate = function() {
      return Q.resolve();
    };

    expect($scope.connected).to.be.false;
    expect($scope.connectionFailure).to.be.false;

    $scope.connectToTwitter().then( function() {
      expect($scope.connected).to.be.true;
      expect($scope.connectionFailure).to.be.false;

      done();
    });
  });

});
