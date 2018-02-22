'use strict';
describe('controller: WidgetSettingsModalController', function() {
  beforeEach(module('risevision.widgets.controllers'));
  beforeEach(module(function ($provide) {
    $provide.service('$modalInstance',function(){
      return {
        close : sinon.stub(),
        dismiss : sinon.stub()
      }
    });
    $provide.service('settingsSaver',function(){
      return settingsSaver = {
        saveSettings : sinon.spy(function() {
          if (saveSettings) {
            return Q.resolve('updatedSettings');
          } else {
            return Q.reject({
              alerts: ['someError']
            });
          }
        })
      };
    });
    $provide.service('settingsGetter',function(){
      return settingsGetter = {
        setCurrentWidget: sinon.stub(),
        getAdditionalParams: function(additionalParams) {
          expect(additionalParams).to.equal('initialAdditionalParams');
          return {
            param1: 'paramValue'
          };
        },
        getParams: function(params) {
          expect(params).to.equal('initialParams');
          return 'params';
        },
      }
    });
    
  }));
  var $scope, $broadcastSpy, $modalInstance, settingsSaver, saveSettings, settingsGetter, widget;

  beforeEach(function(){
    saveSettings = true;
    widget = {
      type: 'widgetType',
      params: 'initialParams',
      additionalParams: 'initialAdditionalParams'
    };

    inject(function($injector,$rootScope, $controller){
      $scope = $rootScope.$new();
      $modalInstance = $injector.get('$modalInstance');
      
      $broadcastSpy = sinon.spy($scope, '$broadcast');

      $controller('WidgetSettingsModalController', {
        $scope: $scope,
        $modalInstance : $modalInstance,
        widget: widget,
      });
      $scope.$digest();
    });
  });
  
  it('should exist',function(){
    expect($scope).to.be.ok;
    expect($scope.settings).to.be.an('object');
    expect($scope.alerts).to.be.an('array');
    expect($scope.getAdditionalParam).to.be.a('function');
    expect($scope.setAdditionalParam).to.be.a('function');
    expect($scope.setAdditionalParams).to.be.a('function');
    expect($scope.saveSettings).to.be.a('function');
    expect($scope.closeSettings).to.be.a('function');
  });

  it('should initialize', function() {
    settingsGetter.setCurrentWidget.should.have.been.calledWith('widgetType');

    expect($scope.settings.params).to.equal('params');
    expect($scope.settings.additionalParams).to.deep.equal({
      param1: 'paramValue'
    });
    
    $broadcastSpy.should.have.been.calledWith('loadAdditionalParams', {
      param1: 'paramValue'
    });
  });

  it('getAdditionalParam: ', function() {
    expect($scope.setAdditionalParam).to.equal($scope.setAdditionalParams);
    
    $scope.setAdditionalParam('param1', 'paramValueUpdated');
    expect($scope.settings.additionalParams.param1).to.equal('paramValueUpdated');
    $scope.setAdditionalParam('param2', 'paramValue2');
    expect($scope.settings.additionalParams.param2).to.equal('paramValue2');
  });

  it('getAdditionalParam: ', function() {
    expect($scope.getAdditionalParam('param1')).to.equal('paramValue');
    expect($scope.getAdditionalParam('param2')).to.be.undefined;
    expect($scope.getAdditionalParam('param2', 'default')).to.equal('default');
  });

  describe('saveSettings', function() {
    it('should clear errors and broadcast event', function() {
      $scope.alerts.push('error1');

      $scope.saveSettings();
      
      expect($scope.alerts).to.deep.equal([]);
      $broadcastSpy.should.have.been.calledWith('collectAdditionalParams');
    });

    it('should save settings and close', function(done) {
      $scope.saveSettings();
      
      setTimeout(function() {
        $modalInstance.close.should.have.been.called;
        $modalInstance.close.should.have.been.calledWith('updatedSettings');

        done();
      }, 10);
    });

    it('should not save settings on error', function(done) {
      saveSettings = false;
      $scope.saveSettings();

      setTimeout(function() {
        $modalInstance.close.should.not.have.been.called;
        expect($scope.alerts).to.deep.equal(['someError']);

        done();
      });
    });
    
  });

  it('should close settings', function() {
    $scope.closeSettings();
    
    $modalInstance.dismiss.should.have.been.called;
  });
  
});
