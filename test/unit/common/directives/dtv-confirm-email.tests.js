'use strict';
describe('directive: confirm-email', function() {
  var sandbox = sinon.sandbox.create();
  var $compile,
      $rootScope,
      $scope,
      element,
      userState,
      userauth,
      messageBox;
  beforeEach(module('risevision.apps.directives'));
  beforeEach(module(function ($provide) {
    $provide.service('userState', function() {
      return {
        getUsername: sandbox.stub().returns('username@email'),
        _restoreState: sandbox.stub()
      };
    });
    $provide.service('userauth', function() {
      return {
        requestConfirmationEmail: sandbox.stub().returns(Q.resolve())
      };
    });
    $provide.service('messageBox', function() {
      return sandbox.spy();
    });

  }));
  beforeEach(inject(function(_$compile_, _$rootScope_, $templateCache, $injector){
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    userState = $injector.get('userState');
    userauth = $injector.get('userauth');
    messageBox = $injector.get('messageBox');

    $templateCache.put('partials/common/confirm-email.html', '<p>mock</p>');
  }));

  afterEach(function() {
    sandbox.restore();
  });

  function compileDirective() {
    element = $compile('<confirm-email></confirm-email>')($rootScope.$new());
    $rootScope.$digest();
    $scope = element.isolateScope();   
  }

  describe('initialization', function() {
    beforeEach(compileDirective);

    it('should compile', function() {
      expect(element[0].outerHTML).to.equal('<confirm-email class="ng-scope ng-isolate-scope"><p>mock</p></confirm-email>');
    });

    it('should initialize scope', function() {
      expect($scope.username).to.equal('username@email');
      expect($scope.requestConfirmationEmail).to.be.a('function');
    });

    it('should request email', function(done) {
      $scope.requestConfirmationEmail()
        .then(function() {
          expect(userauth.requestConfirmationEmail).to.have.been.calledWith('username@email');
          expect($scope.emailSent).to.be.true;

          done();
        })
        .catch(function() {
          done('error');
        });

    });

    it('should show and clear emailSending wording', function(done) {
      $scope.requestConfirmationEmail()
        .then(function() {
          expect($scope.emailSending).to.be.false;

          done();
        });

      expect($scope.emailSending).to.be.true;
    });

    it('should handle failure to request email', function(done) {
      userauth.requestConfirmationEmail.returns(Q.reject());

      $scope.requestConfirmationEmail()
        .then(function() {
          expect(messageBox).to.have.been.called;
          expect($scope.emailSent).to.not.be.true;

          done();
        })
        .catch(function() {
          done('error');
        });

    });

  });

});
