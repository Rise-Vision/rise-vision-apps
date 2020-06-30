'use strict';

/*jshint -W030 */

describe('controller: subcompany modal', function() {
  beforeEach(module('risevision.common.header'));
  beforeEach(module(function ($provide, $translateProvider) {
    $provide.service('userState', function(){
      return {
        getSelectedCompanyId : function(){
          return 'some_company_id';
        },
        _restoreState : function(){

        }
      };
    });
    $provide.service('$loading', function() {
      return {
        start: sinon.stub(),
        stop: sinon.stub()
      };
    });
    $provide.service('$modal',function(){
      return {
        open : sinon.stub()
      };
    });
    $provide.service('$modalInstance',function(){
      return {
        _dismissed : false,
        _closed: false,
        dismiss : function(reason){
          expect(reason).to.equal('cancel');
          this._dismissed = true;
        },
        close: function(reason) {
          expect(reason).to.equal('success');
          this._closed = true;
        }
      };
    });
    $provide.value('companyId', 'RV_test_id');
    $provide.value('countries', []);
    $provide.service('createCompany', function() {
      return sinon.stub().returns(Q.resolve({id: 'companyId', name: 'companyName'}));
    });
    $provide.service('companyTracker', function() {
      return sinon.stub();
    });
    $provide.service('addressFactory', function() {
      return {
        isValidOrEmptyAddress: sinon.spy(function() {
          if (validateAddress) {
            return Q.resolve();  
          }
          return Q.reject('ERROR; invalid address');
        })
      };
    });
    $provide.service('$loading', function() {
      return {
        start: sinon.stub(),
        stop: sinon.stub()
      }
    });
    $provide.factory('humanReadableError', function() {
      return sinon.stub().returns('humanError');
    });
    $provide.factory('customLoader', function ($q) {
      return function () {
        var deferred = $q.defer();
        deferred.resolve({});
        return deferred.promise;
      };
    });

    $translateProvider.useLoader('customLoader');

  }));

  var $scope, addressFactory, $modal, $modalInstance, createCompany,
  companyTracker, validateAddress, $loading, humanReadableError;
  beforeEach(function(){
    validateAddress = true;

    inject(function($injector,$rootScope, $controller){
      $scope = $rootScope.$new();
      $modal = $injector.get('$modal');
      $modalInstance = $injector.get('$modalInstance');
      $loading = $injector.get('$loading');
      addressFactory = $injector.get('addressFactory');
      createCompany = $injector.get('createCompany');
      humanReadableError = $injector.get('humanReadableError');
      companyTracker = $injector.get('companyTracker');

      $controller('SubCompanyModalCtrl', {
        $scope : $scope,
        $modalInstance: $modalInstance,
        companyId: $injector.get('companyId'),
        userState : $injector.get('userState')
      });
      $scope.$digest();
    });
  });

  it('should exist',function(){
    expect($scope).to.be.ok;
    expect($scope.company).to.be.ok;

    expect($scope).to.have.property('countries');
    expect($scope).to.have.property('regionsCA');
    expect($scope).to.have.property('regionsUS');
    expect($scope).to.have.property('COMPANY_INDUSTRY_FIELDS');
    expect($scope).to.have.property('COMPANY_SIZE_FIELDS');
    expect($scope.forms).to.be.ok;
    expect($scope.formError).to.be.null;
    expect($scope.apiError).to.be.null;
    expect($scope.isAddressError).to.be.false;

    expect($scope.closeModal).to.exist;
    expect($scope.save).to.exist;
    expect($scope.moveCompany).to.exist;
  });

  describe('$loading spinner: ', function() {
    it('should start and stop spinner', function() {
      $scope.loading = true;
      $scope.$digest();

      $loading.start.should.have.been.calledWith('add-subcompany-modal');

      $scope.loading = false;
      $scope.$digest();

      $loading.stop.should.have.been.calledTwice;
    });
  });

  describe('save: ',function(){
    beforeEach(function(){
      $scope.forms.companyForm = {
        $valid: true
      };
    });

    it('should not save if the form is invalid', function() {
      $scope.forms.companyForm.$valid = false;

      $scope.save();

      expect($scope.loading).to.not.be.ok;
      addressFactory.isValidOrEmptyAddress.should.not.have.been.called;

    });

    it('should save the company and close the modal',function(done){
      $scope.save();

      expect($scope.loading).to.be.true;
      setTimeout(function() {
        expect($scope.loading).to.be.false;

        addressFactory.isValidOrEmptyAddress.should.have.been.called;
        createCompany.should.have.been.called;

        companyTracker.should.have.been.calledWith('Company Created', 'companyId', 'companyName');
        expect($modalInstance._closed).to.be.true;

        done();
      },10);
    });

    it('should handle failure to create company correctly',function(done){
      createCompany.returns(Q.reject('ERROR; could not create company'));

      $scope.save();

      setTimeout(function(){
        expect($scope.loading).to.be.false;
        expect($modalInstance._closed).to.be.false;

        addressFactory.isValidOrEmptyAddress.should.have.been.called;
        createCompany.should.have.been.called;

        humanReadableError.should.have.been.calledWith('ERROR; could not create company');
        expect($scope.formError).to.be.equal("Failed to Add Sub-Company.");
        expect($scope.apiError).to.be.equal("humanError");
        expect($scope.isAddressError).to.be.false;

        done();
      },10);
    });

    it('should report error if company address is not valid', function(done){
      validateAddress = false;

      $scope.$digest();
      $scope.save();

      expect($scope.isAddressError).to.be.false;
      setTimeout(function(){
        expect($scope.loading).to.be.false;
        expect($modalInstance._closed).to.be.false;

        addressFactory.isValidOrEmptyAddress.should.have.been.called;
        createCompany.should.not.have.been.called;

        humanReadableError.should.have.been.calledWith('ERROR; invalid address');
        expect($scope.formError).to.be.equal("We couldn't update your address.");
        expect($scope.apiError).to.be.equal("humanError");
        expect($scope.isAddressError).to.be.true;

        done();
      },10);
    });
  });

  it('should close modal on cancel',function(){
    $scope.closeModal();
    expect($modalInstance._dismissed).to.be.true;
  });

  it('moveCompany:', function() {
    $scope.moveCompany('size');

    $modal.open.should.have.been.calledWithMatch({
      controller: 'MoveCompanyModalCtrl',
      size: 'size',
    });
  });

});
