'use strict';
describe('directive: display email', function() {
  beforeEach(module('risevision.displays.directives'));
  beforeEach(module('risevision.common.header.directives'));
  beforeEach(module(function ($provide) {
    $provide.service('$loading',function(){
      return $loading = {
        start: sinon.spy(),
        stop: sinon.spy()
      }
    });

    $provide.service('displayEmail',function(){
      return displayEmail = {
        send: sinon.spy(function() {
          if (failSendEmail) {
            return Q.reject('error');
          } else {
            return Q.resolve();  
          }          
        }),
        sendingEmail: false
      }
    });

    $provide.service('processErrorCode', function() {
      return function(error) {
        return 'processed ' + error;
      };
    });

  }));

  var elm, $scope, displayEmail, failSendEmail, $loading;

  beforeEach(inject(function($compile, $rootScope, $templateCache){
    failSendEmail = false;

    var tpl = '<display-email></display-email>';
    $templateCache.put('partials/displays/display-email.html', '<p></p>');

    elm = $compile(tpl)($rootScope.$new());
    $rootScope.$digest();
    
    $scope = elm.scope();

    $scope.display = {};
    $scope.emailForm = {
      $setPristine: sinon.spy()
    };
  }));

  it('should compile html', function() {
    expect(elm.html()).to.equal('<p></p>');
    expect($scope.display).to.be.ok;
    expect($scope.sendEmail).to.be.a('function');
  });

  describe('$loading: ', function() {
    it('should stop spinner', function() {
      $loading.stop.should.have.been.calledWith('display-email');
    });
    
    it('should start spinner', function(done) {
      $scope.displayEmail.sendingEmail = true;
      $scope.$digest();
      setTimeout(function() {
        $loading.start.should.have.been.calledWith('display-email');
        
        done();
      }, 10);
    });
  });

  describe('validation:', function() {
    it('empty email is invalid', function() {
      $scope.email = '';
      $scope.$digest();
      expect($scope.emailInvalid).to.be.true;
    });

    it('test for invalid emails', function() {
      $scope.email = 'invalid';
      $scope.$digest();
      expect($scope.emailInvalid).to.be.true;
    });

    it('test for valid emails', function() {
      $scope.email = 'example@email.com';
      $scope.$digest();
      expect($scope.emailInvalid).to.be.false;
    });

  });

  describe('sendEmail:',function(){
    it('should not send if email is invalid',function(){
      $scope.emailInvalid = true;

      $scope.sendEmail();

      displayEmail.send.should.not.have.been.called;
    });

    it('should send instructions to another email address',function(done){
      $scope.display.id = 'ID';
      $scope.email = 'another@email.com';
      $scope.emailInvalid = false;

      $scope.sendEmail();

      displayEmail.send.should.have.been.calledWith('ID', 'another@email.com');
      setTimeout(function() {
        expect($scope.email).to.not.be.ok;
        expect($scope.emailError).to.be.false;
        expect($scope.emailSent).to.be.true;
        
        $scope.emailForm.$setPristine.should.have.been.calledWith(true);

        done();
      }, 10);
    });

    it('should handle send failure',function(done){
      failSendEmail = true;
      $scope.emailInvalid = false;

      $scope.sendEmail();

      setTimeout(function() {
        expect($scope.emailError).to.equal('processed error');

        done();
      }, 10);
    });
  });

});
