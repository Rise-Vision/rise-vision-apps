/*jshint expr:true */
"use strict";

describe("Services: company state", function() {

  beforeEach(module("risevision.common.components.userstate"));
  beforeEach(module(function ($provide) {
    //stub services
    $provide.service("$q", function() {return Q;});
    $provide.value("$location", {
      search: function () {
        if (subCompany) {
          return {"cid": "RV_subcompany_id"};
        }
        else {
          return {};
        }
      },
      path: function() {
        return "";
      },
      url: function() {},
      replace: sinon.spy(),
      hash: sinon.spy(),
      port: sinon.spy(),
      protocol: sinon.spy(),
      host: sinon.spy()
    });
    $provide.factory("$state", function() {
      return {
        current: {
          
        }
      };
    });
    $provide.factory("getCompany", [function () {
      return function(companyId) {
        var deferred = Q.defer();
        
        apiCount++;
        if (companyId) {
          expect(companyId).to.equal("RV_subcompany_id");

          if (!subCompanyFailure) {
            deferred.resolve({
              "id": "RV_subcompany_id",
              "parentId": "RV_parent_id",
              "name": "Sub Company"
            });            
          } else {
            deferred.reject();
          }
        }
        else {
          deferred.resolve({
            "id": "RV_parent_id",
            "parentId": "fb788f1f",
            "name": "Parent Company",
            "country": "CA"
          });
        }
        return deferred.promise;
      };
    }]);

    $provide.factory("broadcaster", function() {
      return {
        emit: sinon.stub(),
        emitWithParams: sinon.stub()
      };
    });
    
    companyWithNewSettings = {
      "id": "RV_parent_id",
      "parentId": "fb788f1f",
      "name": "Parent Company new name",
      "country": "US"
    };
    
    subCompanyWithNewSettings = {
      "id": "RV_subcompany_id",
      "parentId": "fb788f1f",
      "name": "Sub Company new name",
      "country": "US"
    };
  }));
  
  var companyState, $state, subCompany, apiCount, subCompanyFailure, broadcaster;
  var companyWithNewSettings, subCompanyWithNewSettings;
  
  beforeEach(function() {
    apiCount = 0;
    subCompanyFailure = false;
  });
  
  describe("no selected company: ",function(){
    beforeEach(function(done){
      subCompany = false;
      
      inject(function($injector){
        companyState = $injector.get("companyState");
        broadcaster = $injector.get("broadcaster");
      });
      
      companyState.init();

      setTimeout(function() {
        broadcaster.emit.should.have.been.calledWithExactly("risevision.company.selectedCompanyChanged");
        broadcaster.emit.should.have.been.calledOnce;
        done();
      }, 10);
    });
    
    it("should exist, also methods", function() {
      expect(companyState.init).to.be.ok;
      expect(companyState.switchCompany).to.be.ok;
      expect(companyState.updateCompanySettings).to.be.ok;
      ["init", "switchCompany", "updateCompanySettings", "resetCompany",
      "resetCompanyState", "getUserCompanyId", "getSelectedCompanyId", 
      "getSelectedCompanyName", "getSelectedCompanyCountry",
      "getCopyOfUserCompany", "getCopyOfSelectedCompany",
      "isSubcompanySelected", "isTestCompanySelected", "isSeller",
      "isEducationCustomer", "isDiscountCustomer", "isK12Customer"].forEach(
      function (method) {
        expect(companyState).to.have.property(method);
        expect(companyState[method]).to.be.a("function");
      });
    });

    it("should initialize without selected company", function(done) {
      expect(apiCount).to.equal(1);
      expect(companyState.getUserCompanyId()).to.equal("RV_parent_id");
      expect(companyState.getSelectedCompanyId()).to.equal("RV_parent_id");
      expect(companyState.getSelectedCompanyName()).to.equal("Parent Company");
      expect(companyState.getSelectedCompanyCountry()).to.equal("CA");
      expect(companyState.isSubcompanySelected()).to.be.false;

      done();
    });
    
    it("should switch company", function(done) {
      companyState.switchCompany("RV_subcompany_id");
      setTimeout(function() {
        broadcaster.emit.should.have.been.calledWithExactly("risevision.company.selectedCompanyChanged");
        broadcaster.emit.should.have.been.calledTwice;
        expect(apiCount).to.equal(2);

        expect(companyState.getUserCompanyId()).to.equal("RV_parent_id");
        expect(companyState.getSelectedCompanyId()).to.equal("RV_subcompany_id");
        expect(companyState.getSelectedCompanyName()).to.equal("Sub Company");
        expect(companyState.isSubcompanySelected()).to.be.true;
        
        done();
      },10);
    });
    
    it("should reset company", function(done) {
      companyState.switchCompany("RV_subcompany_id");
      setTimeout(function() {
        expect(companyState.getSelectedCompanyId()).to.equal("RV_subcompany_id");
        expect(companyState.isSubcompanySelected()).to.be.true;
        
        broadcaster.emit.should.have.been.calledWithExactly("risevision.company.selectedCompanyChanged");
        broadcaster.emit.should.have.been.calledTwice;
        
        companyState.resetCompany();

        broadcaster.emit.should.have.been.calledWithExactly("risevision.company.selectedCompanyChanged");
        broadcaster.emit.should.have.been.calledThrice;
        expect(apiCount).to.equal(2);
        
        expect(companyState.getSelectedCompanyId()).to.equal("RV_parent_id");
        expect(companyState.isSubcompanySelected()).to.be.false;
        
        done();
      },10);
    });
    
    it("should not make an extra api call if parent is used", function() {
      companyState.switchCompany("RV_parent_id");
      broadcaster.emit.should.have.been.calledWithExactly("risevision.company.selectedCompanyChanged");
      broadcaster.emit.should.have.been.calledTwice;
      expect(apiCount).to.equal(1);
      expect(companyState.getSelectedCompanyId()).to.equal("RV_parent_id");
      expect(companyState.isSubcompanySelected()).to.be.false;
    });

    describe("updateCompanySettings: ", function(){

      it("should update company settings", function(done) {
        broadcaster.emitWithParams.reset();
        companyState.updateCompanySettings(companyWithNewSettings);
        setTimeout(function() {
          broadcaster.emitWithParams.should.have.been.calledWith("risevision.company.updated");
          expect(broadcaster.emitWithParams.args[0][1].companyId).to.equal("RV_parent_id");
          broadcaster.emitWithParams.should.have.been.calledOnce;
          expect(companyState.getUserCompanyId()).to.equal("RV_parent_id");
          expect(companyState.getSelectedCompanyId()).to.equal("RV_parent_id");
          expect(companyState.getSelectedCompanyName()).to.equal("Parent Company new name");
          expect(companyState.getSelectedCompanyCountry()).to.equal("US");
          expect(companyState.isSubcompanySelected()).to.be.false;
          done();
        },10);
      });

      it("should update company settings without losing fields", function(done) {
        companyState.updateCompanySettings(companyWithNewSettings);
        var copyOfCompany = companyState.getCopyOfSelectedCompany(true);
        copyOfCompany.country = "CA";
        companyState.updateCompanySettings(copyOfCompany);
        setTimeout(function() {
          expect(companyState.getSelectedCompanyId()).to.equal("RV_parent_id");
          expect(companyState.getSelectedCompanyName()).to.equal("Parent Company new name");
          expect(companyState.getSelectedCompanyCountry()).to.equal("CA");
          done();
        },10);
      });
    });

  });
  
  describe("selected company: ", function() {
    beforeEach(function(){
      subCompany = true;
      
      inject(function($injector){
        companyState = $injector.get("companyState");
        broadcaster = $injector.get("broadcaster");
        $state = $injector.get("$state");
      });
    });
    
    it("should initialize with selected company", function(done) {
      companyState.init();
      
      setTimeout(function() {
        broadcaster.emit.should.have.been.calledWithExactly("risevision.company.selectedCompanyChanged");
        broadcaster.emit.should.have.been.calledOnce;

        expect(apiCount).to.equal(2);
        expect(companyState.getUserCompanyId()).to.equal("RV_parent_id");
        expect(companyState.getSelectedCompanyId()).to.equal("RV_subcompany_id");
        expect(companyState.getSelectedCompanyName()).to.equal("Sub Company");
        expect(companyState.isSubcompanySelected()).to.be.true;
        
        done();
      },10);
    });

    it("should handle failure to find selected company", function(done) {
      subCompanyFailure = true;

      companyState.init();
      
      setTimeout(function() {
        broadcaster.emit.should.have.been.calledWithExactly("risevision.company.selectedCompanyChanged");
        broadcaster.emit.should.have.been.calledOnce;

        expect(apiCount).to.equal(2);
        expect(companyState.getUserCompanyId()).to.equal("RV_parent_id");
        expect(companyState.getSelectedCompanyId()).to.equal("RV_parent_id");
        expect(companyState.getSelectedCompanyName()).to.equal("Parent Company");
        expect(companyState.isSubcompanySelected()).to.be.false;
        
        done();
      },10);
    });

    it("should not reset sub-company if route does not forceAuth", function(done) {
      subCompanyFailure = true;
      $state.current.forceAuth = false;

      companyState.init();
      
      setTimeout(function() {
        broadcaster.emit.should.not.have.been.called;

        expect(apiCount).to.equal(2);
        expect(companyState.getUserCompanyId()).to.equal("RV_parent_id");
        expect(companyState.getSelectedCompanyId()).to.not.be.ok;
        expect(companyState.isSubcompanySelected()).to.be.true;
        
        done();
      },10);
    });

    it("should not reset sub-company if init is called twice", function(done) {
      companyState.init();
      
      setTimeout(function() {
        companyState.init();
        
        setTimeout(function() {
          broadcaster.emit.should.have.been.calledWithExactly("risevision.company.selectedCompanyChanged");
          broadcaster.emit.should.have.been.calledTwice;

          expect(apiCount).to.equal(4);
          expect(companyState.getUserCompanyId()).to.equal("RV_parent_id");
          expect(companyState.getSelectedCompanyId()).to.equal("RV_subcompany_id");
          expect(companyState.getSelectedCompanyName()).to.equal("Sub Company");
          expect(companyState.isSubcompanySelected()).to.be.true;
          
          done();
        },10);
      },10);
    });
    
    describe("updateCompanySettings: ", function() {
      beforeEach(function(done){
        companyState.init();
        
        setTimeout(function() {
          broadcaster.emitWithParams.reset();
          
          done();
        },10);
      });

      it("should only update user company settings", function(done) {
        companyState.updateCompanySettings(companyWithNewSettings);

        expect(companyState.getUserCompanyId()).to.equal("RV_parent_id");
        expect(companyState.getUserCompanyName()).to.equal("Parent Company new name");
        expect(companyState.getSelectedCompanyId()).to.equal("RV_subcompany_id");
        expect(companyState.getSelectedCompanyName()).to.equal("Sub Company");
        
        setTimeout(function() {
          broadcaster.emitWithParams.should.have.been.calledWith("risevision.company.updated");
          expect(broadcaster.emitWithParams.args[0][1].companyId).to.equal("RV_parent_id");
          broadcaster.emitWithParams.should.have.been.once;

          done();
        },10);
      });
      
      it("should only update selected company settings", function(done) {
        companyState.updateCompanySettings(subCompanyWithNewSettings);

        expect(companyState.getUserCompanyId()).to.equal("RV_parent_id");
        expect(companyState.getUserCompanyName()).to.equal("Parent Company");
        expect(companyState.getSelectedCompanyId()).to.equal("RV_subcompany_id");
        expect(companyState.getSelectedCompanyName()).to.equal("Sub Company new name");

        setTimeout(function() {
          broadcaster.emitWithParams.should.have.been.calledWith("risevision.company.updated");
          expect(broadcaster.emitWithParams.args[0][1].companyId).to.equal("RV_subcompany_id");
          broadcaster.emitWithParams.should.have.been.once;
          
          done();
        },10);
      });
    });

    describe("isEducationCustomer:", function(){
      beforeEach(function(done){
        companyState.init();       

        setTimeout(done, 10);
      });

      it("should flag k-12 education customers", function(){
        subCompanyWithNewSettings.companyIndustry = "PRIMARY_SECONDARY_EDUCATION";
        companyState.updateCompanySettings(subCompanyWithNewSettings);

        expect(companyState.isEducationCustomer()).to.be.true;
      });

      it("should flag higher education customers", function(){
        subCompanyWithNewSettings.companyIndustry = "HIGHER_EDUCATION";
        companyState.updateCompanySettings(subCompanyWithNewSettings);

        expect(companyState.isEducationCustomer()).to.be.true;
      });

      it("should not flag other industries", function(){
        subCompanyWithNewSettings.companyIndustry = "MARKETING";
        companyState.updateCompanySettings(subCompanyWithNewSettings);

        expect(companyState.isEducationCustomer()).to.be.false;
      });

      it("should not flag undefined industry", function(){
        subCompanyWithNewSettings.companyIndustry = undefined;
        companyState.updateCompanySettings(subCompanyWithNewSettings);

        expect(companyState.isEducationCustomer()).to.be.false;
      });    

      it("should use own company if parameter is true", function() {
        companyWithNewSettings.companyIndustry = "HIGHER_EDUCATION";
        subCompanyWithNewSettings.companyIndustry = "MARKETING";
        
        companyState.updateCompanySettings(companyWithNewSettings);
        companyState.updateCompanySettings(subCompanyWithNewSettings);

        expect(companyState.isEducationCustomer(true)).to.be.true;
      });
    });
    
    describe("isDiscountCustomer:", function(){
      beforeEach(function(done){
        companyState.init();       

        setTimeout(done, 10);
      });

      it("should flag k-12 education customers", function(){
        subCompanyWithNewSettings.companyIndustry = "PRIMARY_SECONDARY_EDUCATION";
        companyState.updateCompanySettings(subCompanyWithNewSettings);

        expect(companyState.isDiscountCustomer()).to.be.true;
      });

      it("should flag higher education customers", function(){
        subCompanyWithNewSettings.companyIndustry = "HIGHER_EDUCATION";
        companyState.updateCompanySettings(subCompanyWithNewSettings);

        expect(companyState.isDiscountCustomer()).to.be.true;
      });

      it("should not flag other industries", function(){
        subCompanyWithNewSettings.companyIndustry = "MARKETING";
        companyState.updateCompanySettings(subCompanyWithNewSettings);

        expect(companyState.isDiscountCustomer()).to.be.false;
      });

      it("should not flag undefined industry", function(){
        subCompanyWithNewSettings.companyIndustry = undefined;
        companyState.updateCompanySettings(subCompanyWithNewSettings);

        expect(companyState.isDiscountCustomer()).to.be.false;
      });    

      it("should use own company if parameter is true", function() {
        companyWithNewSettings.companyIndustry = "HIGHER_EDUCATION";
        subCompanyWithNewSettings.companyIndustry = "MARKETING";
        
        companyState.updateCompanySettings(companyWithNewSettings);
        companyState.updateCompanySettings(subCompanyWithNewSettings);

        expect(companyState.isDiscountCustomer(true)).to.be.true;
      });
    });

    describe("isK12Customer:", function(){
      beforeEach(function(done){
        companyState.init();

        setTimeout(done, 10);
      });

      it("should flag k-12 education customers", function(){
        subCompanyWithNewSettings.companyIndustry = "PRIMARY_SECONDARY_EDUCATION";
        companyState.updateCompanySettings(subCompanyWithNewSettings);

        expect(companyState.isK12Customer()).to.be.true;
      });

      it("should not flag other industries", function(){
        subCompanyWithNewSettings.companyIndustry = "HIGHER_EDUCATION";
        companyState.updateCompanySettings(subCompanyWithNewSettings);

        expect(companyState.isK12Customer()).to.be.false;
      });

      it("should not flag undefined industry", function(){
        subCompanyWithNewSettings.companyIndustry = undefined;
        companyState.updateCompanySettings(subCompanyWithNewSettings);

        expect(companyState.isK12Customer()).to.be.false;
      });    

      it("should use own company if parameter is true", function() {
        companyWithNewSettings.companyIndustry = "PRIMARY_SECONDARY_EDUCATION";
        subCompanyWithNewSettings.companyIndustry = "MARKETING";
        
        companyState.updateCompanySettings(companyWithNewSettings);
        companyState.updateCompanySettings(subCompanyWithNewSettings);

        expect(companyState.isK12Customer(true)).to.be.true;
      });
    });
  });
});
