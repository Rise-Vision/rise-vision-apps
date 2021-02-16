'use strict';

describe('directive: templateComponentTwitter', function() {
  var $scope,
    element,
    factory,
    oauthService,
    twitterCredentialsValidation,
    templateEditorUtils,
    sandbox = sinon.sandbox.create();

  beforeEach(function() {
    factory = { selected: { id: "TEST-ID" }, presentation: {companyId: "abc123"} };
    oauthService = {};
    twitterCredentialsValidation = {};
    templateEditorUtils = {isStaging: sandbox.stub()};
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

    $provide.service('twitterCredentialsValidation', function() {
      return twitterCredentialsValidation;
    });

    $provide.service('templateEditorUtils', function() {
      return templateEditorUtils;
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
    expect($scope.factory).to.deep.equal({ selected: { id: "TEST-ID" }, presentation: {companyId: "abc123"} });
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

      expect($scope.setAttributeData).to.have.been.called;
      expect($scope.setAttributeData.lastCall.args[1]).to.equal('credentialsUpdated');
      expect($scope.setAttributeData.lastCall.args[2]).to.be.ok;

      done();
    });
  });

  it('should detect failure when oauth service connection does not work', function(done) {
    oauthService.authenticate = function() {
      return Q.reject();
    };

    expect($scope.connected).to.be.false;
    expect($scope.connectionFailure).to.be.false;

    $scope.connectToTwitter().then( function() {
      expect($scope.connected).to.be.false;
      expect($scope.connectionFailure).to.be.true;

      expect($scope.setAttributeData).to.have.not.been.called;

      done();
    });
  });

  it('should attempt to verify credentials when Twitter is shown', function() {
    var directive = $scope.registerDirective.getCall(0).args[0];

    twitterCredentialsValidation.verifyCredentials = sandbox.stub().returns(Q.resolve(true));
    $scope.getAvailableAttributeData = sandbox.stub().returns('@twitterHandle');

    directive.show();

    expect(twitterCredentialsValidation.verifyCredentials).to.have.been.called;
  });

  it('should detect when no credentials exist or token is invalid/expired', function(done) {
    var directive = $scope.registerDirective.getCall(0).args[0];

    twitterCredentialsValidation.verifyCredentials = sandbox.stub().returns(Q.resolve(false));
    $scope.getAvailableAttributeData = sandbox.stub().returns('@twitterHandle');

    directive.show();

    expect($scope.connectionFailure).to.be.false;
    expect($scope.connected).to.be.false;

    setTimeout(function(){
      expect($scope.connected).to.be.false;
      expect($scope.connectionFailure).to.be.false;

      done();
    }, 200);
  });

  it('should detect when credentials exist', function(done) {
    var directive = $scope.registerDirective.getCall(0).args[0];

    twitterCredentialsValidation.verifyCredentials = sandbox.stub().returns(Q.resolve(true));
    $scope.getAvailableAttributeData = sandbox.stub().returns('@twitterHandle');

    directive.show();

    expect($scope.connectionFailure).to.be.false;
    expect($scope.connected).to.be.false;

    setTimeout(function(){
      expect($scope.connected).to.be.true;
      expect($scope.connectionFailure).to.be.false;

      done();
    }, 200);
  });

  it('should detect when a verifying credentials encountered a problem', function(done) {
    var directive = $scope.registerDirective.getCall(0).args[0];

    twitterCredentialsValidation.verifyCredentials = sandbox.stub().returns(Q.reject());
    $scope.getAvailableAttributeData = sandbox.stub().returns('@twitterHandle');

    directive.show();

    expect($scope.connectionFailure).to.be.false;
    expect($scope.connected).to.be.false;

    setTimeout(function(){
      expect($scope.connected).to.be.false;
      expect($scope.connectionFailure).to.be.true;

      done();
    }, 200);
  });

  describe('load', function () {
    describe('username', function () {
      it('should load data and indicate the username is valid', function() {
        var directive = $scope.registerDirective.getCall(0).args[0];

        $scope.getAvailableAttributeData = sandbox.stub().returns('@twitterHandle');
        twitterCredentialsValidation.verifyCredentials = sandbox.stub().returns(Q.resolve(true));

        directive.show();

        expect($scope.username).to.equal('@twitterHandle');
        expect($scope.usernameStatus).to.equal('VALID');
      });

      it('should load data and indicate the username is not valid', function() {
        var directive = $scope.registerDirective.getCall(0).args[0];

        $scope.getAvailableAttributeData = sandbox.stub().returns('@twitterHandleButReallyLongAndNotValid');
        twitterCredentialsValidation.verifyCredentials = sandbox.stub().returns(Q.resolve(true));

        directive.show();

        expect($scope.username).to.equal('@twitterHandleButReallyLongAndNotValid');
        expect($scope.usernameStatus).to.equal('INVALID_USERNAME');
      });
    });

    describe('maxitems', function () {
      it('should load data and indicate maxitems is valid', function() {
        var directive = $scope.registerDirective.getCall(0).args[0];

        $scope.getAvailableAttributeData = sandbox.stub().returns('20');
        twitterCredentialsValidation.verifyCredentials = sandbox.stub().returns(Q.resolve(true));

        directive.show();

        expect($scope.maxitems).to.equal('20');
        expect($scope.maxitemsStatus).to.equal('VALID');
      });

      it('should load data and indicate maxitems is not valid', function() {
        var directive = $scope.registerDirective.getCall(0).args[0];

        $scope.getAvailableAttributeData = sandbox.stub().returns('300');
        twitterCredentialsValidation.verifyCredentials = sandbox.stub().returns(Q.resolve(true));

        directive.show();

        expect($scope.maxitems).to.equal('300');
        expect($scope.maxitemsStatus).to.equal('INVALID_RANGE');
      });
    });
  });

  describe('save', function () {
    beforeEach(function() {
      templateEditorUtils.isStaging = sandbox.stub();
    });

    describe('username', function () {
      it('should save data and indicate the username is valid', function() {
        $scope.setAttributeData = sandbox.stub();
        $scope.username = '@twitterHandle';

        $scope.save();

        expect($scope.setAttributeData).to.have.been.called;
        expect($scope.setAttributeData.lastCall.args[2]).to.equal('twitterHandle');
        expect($scope.usernameStatus).to.equal('VALID');
      });

      it('should load data and indicate the username is not valid', function() {
        $scope.setAttributeData = sandbox.stub();
        $scope.username = '@twitterHandleButReallyLongAndNotValid';

        $scope.save();

        expect($scope.setAttributeData.callCount).to.equal(1);
        expect($scope.usernameStatus).to.equal('INVALID_USERNAME');
      });
    });

    describe('maxitems', function () {
      it('should save data and indicate maxitems is valid', function() {
        $scope.setAttributeData = sandbox.stub();
        $scope.maxitems = '20';

        $scope.save();

        expect($scope.setAttributeData).to.have.been.called;
        expect($scope.setAttributeData.lastCall.args[2]).to.equal(20);
        expect($scope.maxitemsStatus).to.equal('VALID');
      });

      it('should load data and indicate maxitems is not valid', function() {
        $scope.setAttributeData = sandbox.stub();
        $scope.maxitems = '300';

        $scope.save();

        expect($scope.setAttributeData.callCount).to.equal(1);
        expect($scope.maxitemsStatus).to.equal('INVALID_RANGE');
      });
    });

    describe('isStaging', function () {
      it('should save isStaging to true', function() {
        $scope.setAttributeData = sandbox.stub();
        $scope.isStaging = true;
        $scope.username = '@twitterHandle';

        $scope.save();

        expect($scope.setAttributeData.callCount).to.equal(2);
        console.log($scope.setAttributeData.firstCall.args);
        expect($scope.setAttributeData.firstCall.args[2]).to.be.true;
      });

      it('should save isStaging to false', function() {
        $scope.setAttributeData = sandbox.stub();
        $scope.isStaging = false;
        $scope.username = '@twitterHandle';

        $scope.save();

        expect($scope.setAttributeData.callCount).to.equal(2);
        console.log($scope.setAttributeData.firstCall.args);
        expect($scope.setAttributeData.firstCall.args[2]).to.be.false;
      });
    });
  });
});
