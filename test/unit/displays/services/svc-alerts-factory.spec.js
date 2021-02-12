'use strict';
describe('service: alertsFactory:', function() {
  beforeEach(module('risevision.displays.services'));

  beforeEach(module(function ($provide) {
    $provide.service('$q', function() {return Q;});

    $provide.service('$modal',function(){
      return {
        open: function(item) {
          expect(item).to.be.ok;
          return {
            result:{
              then:function(func){
                  expect(func).to.be.a('function');
                  func(['newPresentationId','newPresentationName']);
              }
            }
          }
        }
      };
    });
    $provide.factory('userState',function(){
      return {
        _restoreState: function() {},
        updateCompanySettings: function(){},
        getCopyOfSelectedCompany: function() {
          return selectedCompany;
        }
      };
    });
    $provide.factory('regenerateCompanyField',function(){
      return function(companyId,fieldName){
        spyCompanyId = companyId;
        spyFieldName = fieldName;
        var def = Q.defer();
        if(forceError) {
          def.reject();
        } else {
          def.resolve({ item: "newAlertKey" });  
        }
        return def.promise;
      };
    });    
    $provide.factory('company',function(){
      return {
        updateAlerts: function() {
          var def = Q.defer();
          if(forceError) {
            def.reject();
          } else {
            def.resolve({ result: { item: resultCompany } });  
          }
          return def.promise;
        }
      };
    }); 
  }));
  
  var alertsFactory, alertSettings, company, updateAlertsSpy, selectedCompany, forceError;
  var spyCompanyId, spyFieldName, spyUpdateCompanySettings, userState;
  var resultCompany = {
      id: 'id1',
      alertSettings: alertSettings,
      alertKey: "alertKey2",
      changeDate: "2/2/2",
      changedBy: "user2"
    };
  beforeEach(function(){
    forceError = false;
    alertSettings = {enabled: true};
    selectedCompany = {
      id: 'id1',
      alertSettings: alertSettings,
      alertKey: "alertKey",
      changeDate: "1/1/1",
      changedBy: "user"
    };
    inject(function($injector){
      alertsFactory = $injector.get('alertsFactory');      
      company = $injector.get('company');
      userState = $injector.get('userState');
      updateAlertsSpy = sinon.spy(company, 'updateAlerts');
      spyUpdateCompanySettings = sinon.spy(userState, 'updateCompanySettings');
    });
  });

  it('should exist',function(){
    expect(alertsFactory).to.be.truely;
    expect(alertsFactory.textFieldsValues).to.be.truely;
    expect(alertsFactory.allowedStatusesValues).to.be.truely;
    expect(alertsFactory.allowedCategoriesValues).to.be.truely;
    expect(alertsFactory.allowedUrgenciesValues).to.be.truely;
    expect(alertsFactory.allowedSeveritiesValues).to.be.truely;
    expect(alertsFactory.allowedCertaintiesValues).to.be.truely;
    expect(alertsFactory.changePresentation).to.be.a('function');
    expect(alertsFactory.loadSettings).to.be.a('function');
  });

  it('should load settings',function(){
    alertsFactory.loadSettings();
    expect(alertsFactory.alertSettings).to.deep.equal(alertSettings);
    expect(alertsFactory.alertKey).to.equal("alertKey");
    expect(alertsFactory.changeDate).to.equal("1/1/1");
    expect(alertsFactory.changedBy).to.equal("user");
  });

  it('should change presentation',function(){
    alertsFactory.loadSettings();
    alertsFactory.changePresentation();
    expect(alertsFactory.alertSettings.presentationId).to.equal('newPresentationId');
    expect(alertsFactory.alertSettings.presentationName).to.equal('newPresentationName');
  });

  describe('save:',function(){
    it('should save alerts',function(done){
      alertsFactory.loadSettings();
      alertsFactory.save();
      expect(alertsFactory.savingAlerts).to.be.true;
      updateAlertsSpy.should.have.been.calledWith('id1',selectedCompany);
      setTimeout(function() {
        expect(alertsFactory.savingAlerts).to.be.false;
        spyUpdateCompanySettings.should.have.been.called;
        done();
      }, 10);  
    });

    it('should handle errors',function(done){
      forceError = true;
      alertsFactory.loadSettings();
      alertsFactory.save();
      expect(alertsFactory.errorSaving).to.be.false;
      updateAlertsSpy.should.have.been.calledWith('id1',selectedCompany);
      setTimeout(function() {
        expect(alertsFactory.errorSaving).to.be.true;
        done();
      }, 10);      
    });
  });

  describe('regenerateAlertKey',function(){
    it('should regenerate alertKey',function(done){
      alertsFactory.loadSettings();
      alertsFactory.regenerateAlertKey();
      expect(spyCompanyId).to.equal(selectedCompany.id);
      expect(spyFieldName).to.equal('alertKey');
      setTimeout(function() {
        expect(alertsFactory.alertKey).to.equal('newAlertKey');
        done();
      }, 10);
    });

    it('should regenerate alertKey',function(done){
      forceError = true;
      alertsFactory.loadSettings();
      alertsFactory.regenerateAlertKey();
      expect(spyCompanyId).to.equal(selectedCompany.id);
      expect(spyFieldName).to.equal('alertKey');
      setTimeout(function() {
        expect(alertsFactory.alertKey).to.equal('alertKey');
        done();
      }, 10);
    });
  })

});
