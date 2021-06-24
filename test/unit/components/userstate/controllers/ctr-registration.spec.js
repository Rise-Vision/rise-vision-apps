"use strict";

/*jshint -W030 */
/*global sinon*/

describe("controller: registration", function() {
  beforeEach(module("risevision.common.components.userstate"));
  beforeEach(module(function ($provide) {
    $provide.factory('registrationFactory', function() {
      return {
        register: sinon.stub()
      };
    });

    $provide.service('$loading',function(){
      return {
        start : sinon.spy(),
        stop : sinon.spy()
      }
    });

    $provide.value('COMPANY_INDUSTRY_FIELDS', []);
  }));
  var $scope, $loading, registrationFactory;
  
  beforeEach(function() {
    inject(function($injector,$rootScope, $controller){
      $scope = $rootScope.$new();
      $loading = $injector.get('$loading');
      registrationFactory = $injector.get("registrationFactory");

      $controller("RegistrationCtrl", {
        $scope: $scope
      });
      $scope.$digest();
      $scope.forms = {
        registrationForm: {
          accepted: {},
          firstName: {},
          lastName: {},
          companyName: {},
          companyIndustry: {},
          email: {}
        }
      };
    });
  });
  
  it("should initialize",function(){
    expect($scope).to.be.ok;
    expect($scope.registrationFactory).to.be.ok;

    expect($scope.save).to.exist;
  });
  
  describe("save new user: ", function() {      
    it("should not save if form is invalid", function() {
      $scope.forms.registrationForm.$invalid = true;
      $scope.save();

      registrationFactory.register.should.not.have.been.called;
    });

    it("should register user",function(){
      $scope.forms.registrationForm.$invalid = false;
      $scope.save();

      registrationFactory.register.should.have.been.called;
    });

  });

  describe('$loading: ', function() {
    it('should stop spinner', function() {
      $loading.stop.should.have.been.calledWith('registration-loader');
    });
    
    it('should start spinner', function(done) {
      registrationFactory.loading = true;
      $scope.$digest();
      setTimeout(function() {
        $loading.start.should.have.been.calledWith('registration-loader');
        
        done();
      }, 10);
    });
  });


});
  
