'use strict';
describe('service: schedule:', function() {
  beforeEach(module('risevision.schedules.services'));
  beforeEach(module(function ($provide) {
    $provide.service('$q', function() {return Q;});
    $provide.service('userState',function(){
      return {
        getAccessToken : function(){
          return{access_token: 'TEST_TOKEN'};
        },
        getSelectedCompanyId : function(){
          return 'TEST_COMP_ID';
        },
        getCopyOfSelectedCompany : function(){
          return {
            name : 'TEST_COMP',
            id : 'TEST_COMP_ID'
          }
        },
        getCopyOfProfile : function(){
          return {
            firstName : 'first',
            lastName : 'lastName',
            telephone : '123',
            email : 'foo@bar'
          };
        },
        _restoreState:function(){}
      }
    });

    $provide.service('coreAPILoader',function () {
      return function(){
        var deferred = Q.defer();
                
        deferred.resolve({
          schedule: {
            list: function(obj){
              expect(obj).to.be.ok;
              
              searchString = obj.search;
              sortString = obj.sort;

              var def = Q.defer();
              if (returnList) {
                def.resolve({
                  result : {
                    nextPageToken : 1,
                    items : [{}]
                  }
                });
              } else {
                def.reject("API Failed");
              }
              return def.promise;
            },
            get: function(obj){
              expect(obj).to.be.ok;
              
              var def = Q.defer();
              if (obj.id) {
                def.resolve({
                  result: {
                    item: {
                      "id": "schedule1",
                      "companyId": "TEST_COMP_ID",
                      "name": "Test Schedule",
                      "creationDate": "2012-04-02T14:19:36.000Z"
                    }
                  }
                });
              } else {
                def.reject("API Failed");
              }
              return def.promise;
            },
            add: function(obj) {
              expect(obj).to.be.ok;
              expect(obj.companyId).to.equal('TEST_COMP_ID');
              expect(obj).to.have.property("data");
              
              var def = Q.defer();
              if (obj.data.name) {
                expect(obj.data).to.have.property("name");
                expect(obj.data).to.not.have.property("id");
                
                obj.data.id = "schedule1"
                
                def.resolve({
                  result: {
                    item: obj.data
                  }
                });
              } else {
                def.reject("API Failed");
              }
              return def.promise;
            },
            patch: function(obj) {
              expect(obj).to.be.ok;
              expect(obj.id).to.equal('schedule1');
              expect(obj.data).to.be.ok;
              
              var def = Q.defer();
              if (obj.data.name) {
                expect(obj.data).to.have.property("name");
                
                def.resolve({
                  result: {
                    item: obj.data
                  }
                });
              } else {
                def.reject("API Failed");
              }
              return def.promise;
            },
            delete: function(obj) {
              expect(obj).to.be.ok;

              var def = Q.defer();
              if (obj.id) {
                def.resolve({
                  item: {}
                });
              } else {
                def.reject("API Failed");
              }
              return def.promise;
            }
          }
        });
        return deferred.promise;
      };
    });

  }));
  var schedule, returnList, searchString, sortString;
  beforeEach(function(){
    returnList = true;
    searchString = '';
    sortString='';
    
    inject(function($injector){  
      schedule = $injector.get('schedule');
    });
  });

  it('should exist',function(){
    expect(schedule).to.be.truely;
    expect(schedule.list).to.be.a('function');
    expect(schedule.get).to.be.a('function');
    expect(schedule.add).to.be.a('function');
    expect(schedule.update).to.be.a('function');
    expect(schedule.delete).to.be.a('function');
  });
  
  describe('list:',function(){
    it('should return a list of schedules',function(done){
      schedule.list({})
      .then(function(result){
        expect(result).to.be.truely;
        expect(result.items).to.be.an.array;
        expect(result.items).to.have.length.above(0);
        done();
      })
      .then(null,done);
    });
    
    it('should create an empty searchString if query is empty',function(done){
      schedule.list({})
      .then(function(result){
        expect(searchString).to.equal('');

        done();
      })
      .then(null,done);
    });

    it('should set sort to be desc if reverse option is passed',function(done){
      schedule.list({sortBy: 'anyThing', reverse: true})
        .then(function(result){
          expect(sortString).to.equal('anyThing desc');

          done();
        })
        .then(null,done);
    });

    it('should set sort to be asc if reverse option is not passed',function(done){
      schedule.list({sortBy: 'anyThing'})
        .then(function(result){
          expect(sortString).to.equal('anyThing asc');

          done();
        })
        .then(null,done);
    });

    it('should output a proper search string',function(done){
      schedule.list({query: 'str'})
        .then(function(result){
          expect(searchString).to.equal('name:~\'str\' OR id:~\'str\'');

          done();
        })
        .then(null,done);
    });
    
    it("should handle failure to get list correctly",function(done){
      returnList = false;
      
      schedule.list({})
      .then(function(schedules) {
        done(schedules);
      })
      .then(null, function(error) {
        expect(error).to.deep.equal('API Failed');
        done();
      })
      .then(null,done);
    });
  });
  
  describe('get:',function(){
    it('should return a schedule',function(done){
      schedule.get('schedule1')
      .then(function(result){
        expect(result).to.be.truely;
        expect(result.item).to.be.truely;
        expect(result.item).to.have.property("name");
        
        done();
      })
      .then(null,done);
    });
    
    it("should handle failure to get schedule correctly",function(done){
      schedule.get()
      .then(function(result) {
        done(result);
      })
      .then(null, function(error) {
        expect(error).to.deep.equal('API Failed');
        done();
      })
      .then(null,done);
    });
  });
  
  describe('add:',function(){
    var scheduleObject = {
      "name": "Test Schedule",
    };
    
    it('should add a schedule',function(done){
      schedule.add(scheduleObject)
      .then(function(result){
        expect(result).to.be.truely;
        expect(result.item).to.be.truely;
        expect(result.item).to.have.property("name");
        expect(result.item).to.have.property("id");
        expect(result.item.id).to.equal("schedule1");
        
        done();
      })
      .then(null,done);
    });
    
    it("should handle failure to add schedule",function(done){
      schedule.add({})
      .then(function(result) {
        done(result);
      })
      .then(null, function(error) {
        expect(error).to.deep.equal('API Failed');
        done();
      })
      .then(null,done);
    });
  });
  
  describe('update:',function(){
    var scheduleObject = {
      "name": "Test Schedule",
      "id": "schedule1",
      "companyId": "TEST_COMP_ID",
    };
    
    it('should update a schedule',function(done){
      schedule.update(scheduleObject.id, scheduleObject)
      .then(function(result){
        expect(result).to.be.truely;
        expect(result.item).to.be.truely;
        
        done();
      })
      .then(null,done);
    });
    
    it('should remove extra properties',function(done){
      schedule.update(scheduleObject.id, scheduleObject)
      .then(function(result){
        expect(result).to.be.truely;
        expect(result.item).to.be.truely;
        expect(result.item).to.not.have.property("connected");
        
        done();
      })
      .then(null,done);
    });
    
    it("should handle failure to update schedule",function(done){
      schedule.update(scheduleObject.id, {})
      .then(function(result) {
        done(result);
      })
      .then(null, function(error) {
        expect(error).to.deep.equal('API Failed');
        done();
      })
      .then(null,done);
    });
  });

  describe('delete:',function(){
    it('should delete a schedule',function(done){
      schedule.delete('schedule1')
        .then(function(result){
          expect(result).to.be.truely;
          expect(result.item).to.be.truely;

          done();
        })
        .then(null,done);
    });

    it("should handle failure to delete schedule",function(done){
      schedule.delete()
        .then(function(result) {
          done(result);
        })
        .then(null, function(error) {
          expect(error).to.deep.equal('API Failed');
          done();
        })
        .then(null,done);
    });
  });

});
