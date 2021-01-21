'use strict';
describe('controller: AddPaymentSourceCtrl', function () {
  var sandbox = sinon.sandbox.create();
  var $scope, $loading, $state, subscriptionFactory, creditCardFactory, addPaymentSourceFactory;

  beforeEach(module('risevision.apps.billing.controllers'));

  beforeEach(module(function ($provide) {
    $provide.service('$loading', function () {
      return {
        start: sandbox.stub(),
        stop: sandbox.stub()
      };
    });
    $provide.service('$state', function () {
      return {
        go: sandbox.stub()
      };
    });
    $provide.service('userState', function () {
      return {
        getUserEmail: function () {
          return 'userEmail';
        }
      };
    });
    $provide.service('subscriptionFactory', function() {
      return {
        reloadSubscription: sandbox.spy()
      };
    });
    $provide.service('addPaymentSourceFactory', function() {
      return {
        init: sinon.stub(),
        changePaymentToInvoice: sinon.stub().returns(Q.resolve()),
        changePaymentSource: sinon.stub().returns(Q.resolve())
      };
    });
    $provide.value('creditCardFactory', {
      paymentMethods: {}
    });

  }));

  beforeEach(inject(function($injector, $rootScope, $controller) {
    $scope = $rootScope.$new();
    $loading = $injector.get('$loading');
    $state = $injector.get('$state');
    subscriptionFactory = $injector.get('subscriptionFactory');
    creditCardFactory = $injector.get('creditCardFactory');
    addPaymentSourceFactory = $injector.get('addPaymentSourceFactory');

    $scope.form = {
      paymentMethodsForm: {
        $valid: true
      }
    };

    $controller('AddPaymentSourceCtrl', {
      $scope: $scope
    });
    $scope.$digest();
  }));

  afterEach(function () {
    sandbox.restore();
  });

  it('should exist',function () {
    expect($scope).to.be.ok;

    expect($scope.subscriptionFactory).to.equal(subscriptionFactory);
    expect($scope.creditCardFactory).to.equal(creditCardFactory);
    expect($scope.addPaymentSourceFactory).to.equal(addPaymentSourceFactory);
    expect($scope.contactEmail).to.equal('userEmail');

    expect($scope.addPaymentMethod).to.be.a('function');
  });

  it('should initialize factories', function() {
    addPaymentSourceFactory.init.should.have.been.called;
  });

  describe('$loading: ', function() {
    it('should stop spinner', function() {
      $loading.stop.should.have.been.calledWith('payment-source-loader');
    });

    it('should start spinner', function(done) {
      subscriptionFactory.loading = true;
      $scope.$digest();
      setTimeout(function() {
        $loading.start.should.have.been.calledWith('payment-source-loader');

        done();
      }, 10);
    });

    it('should start and stop spinner from addPaymentSourceFactory', function() {
      addPaymentSourceFactory.loading = true;
      $scope.$digest();

      $loading.start.should.have.been.calledWith('payment-source-loader');

      addPaymentSourceFactory.loading = false;
      $scope.$digest();

      $loading.stop.should.have.been.calledTwice;
    });

  });

  describe('addPaymentMethod:', function() {
    describe('invoice:', function() {
      beforeEach(function() {
        creditCardFactory.paymentMethods.paymentMethod = 'invoice';
      });

      it('should not check form validity', function() {
        $scope.form.paymentMethodsForm.$valid = false;

        $scope.addPaymentMethod('subscriptionId');

        addPaymentSourceFactory.changePaymentToInvoice.should.have.been.called;
      });

      it('should change payment to invoice and redirect', function(done) {
        creditCardFactory.paymentMethods.purchaseOrderNumber = 'poNumber';

        $scope.addPaymentMethod('subscriptionId');

        addPaymentSourceFactory.changePaymentToInvoice.should.have.been.calledWith('subscriptionId', 'poNumber');

        setTimeout(function() {
          $state.go.should.have.been.calledWith('apps.billing.subscription', {
            subscriptionId: 'subscriptionId'
          });

          done();
        }, 10);
      });

      it('should not redirect on failure', function(done) {
        addPaymentSourceFactory.changePaymentToInvoice.returns(Q.reject());

        $scope.addPaymentMethod('subscriptionId');

        addPaymentSourceFactory.changePaymentToInvoice.should.have.been.called;

        setTimeout(function() {
          $state.go.should.not.have.been.called;

          done();
        }, 10);
      });
    });

    describe('credit card:', function() {
      beforeEach(function() {
        creditCardFactory.paymentMethods.paymentMethod = 'card';
      });

      it('should not update the payment source if the form is not valid', function() {
        $scope.form.paymentMethodsForm.$valid = false;

        $scope.addPaymentMethod('subscriptionId');

        addPaymentSourceFactory.changePaymentSource.should.not.have.been.called;
      });

      it('should change payment source and redirect', function(done) {
        $scope.addPaymentMethod('subscriptionId');

        addPaymentSourceFactory.changePaymentSource.should.have.been.calledWith('subscriptionId');

        setTimeout(function() {
          $state.go.should.have.been.calledWith('apps.billing.subscription', {
            subscriptionId: 'subscriptionId'
          });

          done();
        }, 10);
      });

      it('should not redirect on failure', function(done) {
        addPaymentSourceFactory.changePaymentSource.returns(Q.reject());

        $scope.addPaymentMethod('subscriptionId');

        addPaymentSourceFactory.changePaymentSource.should.have.been.called;

        setTimeout(function() {
          $state.go.should.not.have.been.called;

          done();
        }, 10);
      });

    });

  });

});
