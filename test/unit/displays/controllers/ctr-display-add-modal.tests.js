'use strict';
describe('controller: display add modal', function() {
  var displayId = 1234;
  beforeEach(module('risevision.displays.controllers'));
  beforeEach(module('risevision.displays.services'));
  beforeEach(module(mockTranlate()));
  beforeEach(module(function ($provide) {
    $provide.service('displayFactory',function(){
      return {
        display: {},
        loadingDisplay: true,
        addDisplay : function(){
          displayAdded = true;

          return Q.resolve();
        }
      };
    });
    
    $provide.service('$modalInstance',function(){
      return {
        dismiss : function(action){
          return;
        }
      }
    });

    $provide.service('displayEmail',function(){
      return {
        send : function(){
          if (failSendEmail) {
            return Q.reject();
          } else {
            return Q.resolve();  
          }          
        }
      }
    });

  }));
  var $scope, displayFactory, $modalInstanceDismissSpy, displayAdded, displayEmail, failSendEmail;
  beforeEach(function(){
    displayAdded = false;
    failSendEmail = false;
    
    inject(function($injector,$rootScope, $controller){
      $scope = $rootScope.$new();
      displayFactory = $injector.get('displayFactory');
      displayEmail = $injector.get('displayEmail');
      var $modalInstance = $injector.get('$modalInstance');
      $modalInstanceDismissSpy = sinon.spy($modalInstance, 'dismiss');

      $controller('displayAddModal', {
        $scope : $scope,
        displayFactory: displayFactory,
        $modalInstance: $modalInstance,
        $log: $injector.get('$log'),
        downloadOnly: false
      });
      $scope.$digest();
    });
  });
  
  it('should exist',function(){
    expect($scope).to.be.truely;

    expect($scope.showEmailForm).to.be.false;
    expect($scope.anotherEmail).to.be.null;
    expect($scope.errorMessage).to.be.null;

    expect($scope.displayEmail).to.be.ok;
    expect($scope.factory).to.be.ok;

    expect($scope.save).to.be.a('function');
    expect($scope.dismiss).to.be.a('function');
    expect($scope.toggleEmailForm).to.be.a('function');    
    expect($scope.sendToAnotherEmail).to.be.a('function');
  });

  it('should init the correct defaults',function(){
    expect($scope.display).to.be.truely;
    expect($scope.display).to.deep.equal({});
  });

  it('should return early if the form is invalid',function(){
    $scope.displayAdd = {};
    $scope.displayAdd.$valid = false;
    $scope.save();
  });

  it('should save the display',function(){
    $scope.displayAdd = {};
    $scope.displayAdd.$valid = true;
    $scope.display = {id:123};
    $scope.save();

    expect(displayAdded).to.be.true;

  });

  it('should dismiss modal when clicked on close with no action',function(){
    $scope.dismiss();

    $modalInstanceDismissSpy.should.have.been.called;
  });

  it('should toggle email form',function(){
    expect($scope.showEmailForm).to.be.false;
    $scope.toggleEmailForm();
    expect($scope.showEmailForm).to.be.true;
    $scope.toggleEmailForm();
    expect($scope.showEmailForm).to.be.false;
  });

  describe('sendToAnotherEmail:',function(){
    it('should send instructions to another email address',function(done){
      var spy = sinon.spy(displayEmail,'send')
      $scope.display.id = 'ID';
      $scope.display.name = 'Name';
      $scope.anotherEmail = 'another@email.com';
      $scope.sendToAnotherEmail();

      spy.should.have.been.calledWith('ID','Name','another@email.com');
      setTimeout(function() {
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
