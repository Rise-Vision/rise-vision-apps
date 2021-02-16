'use strict';
describe('service: gadget:', function() {
  beforeEach(module('risevision.editor.services'));
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
          gadget: {
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
                      "id": "gadget1",
                      "companyId": "TEST_COMP_ID",
                      "name": "Test Gadget",
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
                
                obj.data.id = "gadget1"
                
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
              expect(obj.id).to.equal('gadget1');
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
            },
            publish: function(obj) {
              expect(obj).to.be.ok;

              var def = Q.defer();
              if (obj.id) {
                def.resolve({
                  item: "Published."
                });
              } else {
                def.reject("API Failed");
              }
              return def.promise;
            },
            restore: function(obj) {
              expect(obj).to.be.ok;

              var def = Q.defer();
              if (obj.id) {
                def.resolve({
                  result: {
                    item: {
                      id: obj.id,
                      companyId: "TEST_COMP_ID",
                      name: "Test Gadget",
                      publish: 0 
                    }  
                  }                  
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
  var gadget, returnList, searchString, sortString;
  beforeEach(function(){
    returnList = true;
    searchString = '';
    sortString='';
    
    inject(function($injector){
      gadget = $injector.get('gadget');
    });
  });

  it('should exist',function(){
    expect(gadget).to.be.truely;
    expect(gadget.list).to.be.a('function');
    expect(gadget.get).to.be.a('function');
  });
  
  describe('list:',function(){
    it('should return a list of gadgets',function(done){
      gadget.list({})
      .then(function(result){
        expect(result).to.be.truely;
        expect(result.items).to.be.an.array;
        expect(result.items).to.have.length.above(0);
        done();
      })
      .then(null,done);
    });
    
    it('should create an empty searchString if query is empty',function(done){
      gadget.list({})
      .then(function(result){
        expect(searchString).to.equal('');

        done();
      })
      .then(null,done);
    });

    it('should set sort to be desc if reverse option is passed',function(done){
      gadget.list({sortBy: 'anyThing', reverse: true})
        .then(function(result){
          expect(sortString).to.equal('anyThing desc');

          done();
        })
        .then(null,done);
    });

    it('should set sort to be asc if reverse option is not passed',function(done){
      gadget.list({sortBy: 'anyThing'})
        .then(function(result){
          expect(sortString).to.equal('anyThing asc');

          done();
        })
        .then(null,done);
    });

    it('should output a proper search string',function(done){
      gadget.list({query: 'str'})
        .then(function(result){
          expect(searchString).to.equal('name:~\"str\" OR id:~\"str\"');

          done();
        })
        .then(null,done);
    });
    
    it('should output a ids search string',function(done){
      gadget.list({ids: ['id1', 'id2']})
        .then(function(result){
          expect(searchString).to.equal('id:\'id1\' OR id:\'id2\'');

          done();
        })
        .then(null,done);
    });
    
    it('should output a productCodes search string',function(done){
      gadget.list({productCodes: ['product1']})
        .then(function(result){
          expect(searchString).to.equal('productCode:\'product1\'');

          done();
        })
        .then(null,done);
    });
    
    it("should handle failure to get list correctly",function(done){
      returnList = false;

      gadget.list({})
      .then(function(gadgets) {
        done(gadgets);
      })
      .then(null, function(error) {
        expect(error).to.deep.equal('API Failed');
        done();
      })
      .then(null,done);
    });
  });
  
  describe('get:',function(){
    it('should return a gadget',function(done){
      gadget.get('gadget1')
      .then(function(result){
        expect(result).to.be.truely;
        expect(result.item).to.be.truely;
        expect(result.item).to.have.property("name");
        
        done();
      })
      .then(null,done);
    });
    
    it("should handle failure to get gadget correctly",function(done){
      gadget.get()
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
