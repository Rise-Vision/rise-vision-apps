'use strict';
describe('directive: send another email', function() {
  beforeEach(module('risevision.displays.directives'));
  beforeEach(module(function ($provide) {
    $provide.value('translateFilter', function(key){
      return key;
    });
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
            return Q.reject();
          } else {
            return Q.resolve();  
          }          
        }),
        sendingEmail: false
      }
    });

  }));

  var elm, $scope, displayEmail, failSendEmail, $loading;

  beforeEach(inject(function($compile, $rootScope, $templateCache){
    var tpl = '<send-another-email></send-another-email>';
    $templateCache.put('partials/displays/send-another-email.html', '<p></p>');

    elm = $compile(tpl)($rootScope.$new());
    $rootScope.$digest();
    
    $scope = elm.scope();

    $scope.display = {};
  }));

  it('should compile html', function() {
    expect(elm.html()).to.equal('<p></p>');
    expect($scope.display).to.be.ok;
    expect($scope.sendToAnotherEmail).to.be.a('function');
  });

  describe('$loading: ', function() {
    it('should stop spinner', function() {
      $loading.stop.should.have.been.calledWith('send-another-email');
    });
    
    it('should start spinner', function(done) {
      $scope.displayEmail.sendingEmail = true;
      $scope.$digest();
      setTimeout(function() {
        $loading.start.should.have.been.calledWith('send-another-email');
        
        done();
      }, 10);
    });
  });

  describe('sendToAnotherEmail:',function(){
    it('should send instructions to another email address',function(done){
      $scope.display.id = 'ID';
      $scope.anotherEmail = 'another@email.com';
      $scope.sendToAnotherEmail();

      displayEmail.send.should.have.been.calledWith('ID', 'another@email.com');
      setTimeout(function() {
        expect($scope.anotherEmail).to.not.be.ok;
        expect($scope.errorMessage).to.be.null;

        done();
      }, 10);
    });

    it('should handle send failure',function(done){
      failSendEmail = true;
      $scope.sendToAnotherEmail();

      setTimeout(function() {
        expect($scope.errorMessage).to.equal('displays-app.fields.email.failed');

        done();
      }, 10);
    });
  });
  
});
