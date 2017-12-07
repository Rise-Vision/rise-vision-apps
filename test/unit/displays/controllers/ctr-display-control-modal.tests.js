'use strict';
describe('controller: display control modal', function() {
  var sandbox;

  beforeEach(module('risevision.displays.controllers'));
  beforeEach(module('risevision.displays.services'));
  beforeEach(module(mockTranlate()));
  beforeEach(module(function ($provide) {
    $provide.service('displayControlFactory',function() {
      return {
        getConfiguration: function() {
          return Q.resolve('contents');
        },
        updateConfiguration: function() {
          return Q.resolve();
        },
        getDefaultConfiguration: function() {
          return 'default contents';
        }
      };
    });    
    $provide.service('$modalInstance',function() {
      return {
        dismiss: function(action) {
          return;
        },
        close: function(action) {
          return;
        }
      }
    });
    $provide.service('$loading', function() {
      return {
        start: sandbox.stub(),
        stop: sandbox.stub()
      };
    });
  }));
  var $scope, displayControlFactory, $modalInstanceDismissSpy, $modalInstanceCloseSpy, $loading;
  beforeEach(function() {   
    sandbox = sinon.sandbox.create();

    inject(function($injector,$rootScope, $controller) {
      $scope = $rootScope.$new();
      displayControlFactory = $injector.get('displayControlFactory');
      var $modalInstance = $injector.get('$modalInstance');
      $modalInstanceDismissSpy = sinon.spy($modalInstance, 'dismiss');
      $modalInstanceCloseSpy = sinon.spy($modalInstance, 'close');
      $loading = $injector.get('$loading');

      sandbox.spy(displayControlFactory, 'getConfiguration');
      sandbox.spy(displayControlFactory, 'getDefaultConfiguration');

      $controller('DisplayControlModalCtrl', {
        $scope : $scope,
        displayControlFactory: displayControlFactory,
        $modalInstance: $modalInstance,
        $loading: $loading
      });
      $scope.$digest();
    });
  });

  afterEach(function() {
    sandbox.restore();
  });

  it('should exist', function() {
    expect($scope).to.be.truely;
    expect($scope.saveConfiguration).to.be.a('function');
    expect($scope.resetForm).to.be.a('function');
    expect($scope.dismiss).to.be.a('function');
    expect($scope.formData).to.be.ok;
  });
  
  it('should initialize', function() {
    expect(displayControlFactory.getConfiguration).to.have.been.called;
    expect(displayControlFactory.getDefaultConfiguration).to.not.have.been.called;
  });

  it('should dismiss modal when clicked on close with no action', function() {
    $scope.dismiss();

    $modalInstanceDismissSpy.should.have.been.called;
  });

  describe('saveConfiguration:', function() {
    it('should save the configuration', function(done) {
      sandbox.spy(displayControlFactory, 'updateConfiguration');
      $scope.formData.displayControlContents = 'contents';
      $scope.saveConfiguration();

      setTimeout(function() {
        displayControlFactory.updateConfiguration.should.have.been.calledWith('contents');
        $loading.start.should.have.been.called;
        $loading.stop.should.have.been.called;
        $modalInstanceCloseSpy.should.have.been.called;
        done();
      }, 10);
    });

    it('should fail to save the configuration', function(done) {
      sandbox.stub(displayControlFactory, 'updateConfiguration').returns(Q.reject('error'));
      $scope.formData.displayControlContents = 'contents';
      $scope.saveConfiguration();

      setTimeout(function() {
        displayControlFactory.updateConfiguration.should.have.been.calledWith('contents');
        $loading.start.should.have.been.called;
        $loading.stop.should.have.been.called;
        $modalInstanceCloseSpy.should.not.have.been.called;
        done();
      }, 10);
    });
  });

  describe('resetForm:', function() {
    it('should reset form', function() {
      $scope.formData.displayControlContents = '';
      $scope.resetForm();

      displayControlFactory.getConfiguration.should.have.been.called;
      expect($scope.formData.displayControlContents).to.be.equal('default contents');
    });
  });

});
