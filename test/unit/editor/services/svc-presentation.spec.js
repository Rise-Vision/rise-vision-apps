'use strict';
describe('service: presentation:', function() {
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
        isRiseAdmin: function() {
          return isRiseAdmin;
        },
        _restoreState:function(){}
      }
    });

    $provide.service('coreAPILoader',function () {
      return sinon.stub().returns(Q.resolve(coreApi));
    });

  }));
  var presentation, coreApi, returnList, searchString, sortString, isRiseAdmin;
  beforeEach(function(){
    returnList = true;
    searchString = '';
    sortString='';
    isRiseAdmin = false;

    coreApi = {
      presentation: {
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
                  "id": "presentation1",
                  "companyId": "TEST_COMP_ID",
                  "name": "Test Presentation",
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
            
            obj.data.id = "presentation1"
            
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
          expect(obj.id).to.equal('presentation1');
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
        delete: sinon.stub().returns(Q.resolve({
          item: {}
        })),
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
                  name: "Test Presentation",
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
    };

    inject(function($injector){
      presentation = $injector.get('presentation');
    });
  });

  it('should exist',function(){
    expect(presentation).to.be.ok;
    expect(presentation.list).to.be.a('function');
    expect(presentation.get).to.be.a('function');
  });
  
  describe('list:',function(){
    it('should return a list of presentations',function(done){
      presentation.list({})
      .then(function(result){
        expect(result).to.be.ok;
        expect(result.items).to.be.an.array;
        expect(result.items).to.have.length.above(0);
        done();
      })
      .then(null,done);
    });
    
    it('should create an empty searchString if query is empty',function(done){
      presentation.list({})
      .then(function(result){
        expect(searchString).to.equal('');

        done();
      })
      .then(null,done);
    });

    it('should set sort to be desc if reverse option is passed',function(done){
      presentation.list({sortBy: 'anyThing', reverse: true})
        .then(function(result){
          expect(sortString).to.equal('anyThing desc');

          done();
        })
        .then(null,done);
    });

    it('should set sort to be asc if reverse option is not passed',function(done){
      presentation.list({sortBy: 'anyThing'})
        .then(function(result){
          expect(sortString).to.equal('anyThing asc');

          done();
        })
        .then(null,done);
    });

    it('should output a proper search string',function(done){
      presentation.list({query: 'str'})
        .then(function(result){
          expect(searchString).to.equal('name:~\"str\" OR id:~\"str\" OR revisionStatusName:~\"str\"');

          done();
        })
        .then(null,done);
    });

    it('should apply the search filter to the search string',function(done){
      presentation.list({query: 'str', filter: ' NOT presentationType:\"HTML Template\"'})
        .then(function(result){
          expect(searchString).to.equal('name:~\"str\" OR id:~\"str\" OR revisionStatusName:~\"str\" NOT presentationType:\"HTML Template\"');

          done();
        })
        .then(null,done);
    });
    
    it("should handle failure to get list correctly",function(done){
      returnList = false;

      presentation.list({})
      .then(function(presentations) {
        done(presentations);
      })
      .then(null, function(error) {
        expect(error).to.deep.equal('API Failed');
        done();
      })
      .then(null,done);
    });
  });
  
  describe('get:',function(){
    it('should return a presentation',function(done){
      presentation.get('presentation1')
      .then(function(result){
        expect(result).to.be.ok;
        expect(result.item).to.be.ok;
        expect(result.item).to.have.property("name");
        
        done();
      })
      .then(null,done);
    });
    
    it("should handle failure to get presentation correctly",function(done){
      presentation.get()
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
    var presentationObject = {
      "name": "Test Presentation",
    };
    
    it('should add a presentation',function(done){
      presentation.add(presentationObject)
      .then(function(result){
        expect(result).to.be.ok;
        expect(result.item).to.be.ok;
        expect(result.item).to.have.property("name");
        expect(result.item).to.have.property("id");
        expect(result.item.id).to.equal("presentation1");
        
        done();
      })
      .then(null,done);
    });

    it('should send isStoreProduct if user is Rise Admin',function(done){
      presentationObject.isTemplate = true;      
      presentationObject.isStoreProduct = true;      
      isRiseAdmin = true;

      presentation.add(presentationObject)
      .then(function(result){
        expect(result).to.be.ok;
        expect(result.item).to.be.ok;
        expect(result.item).to.have.property("isStoreProduct");
        expect(result.item.isStoreProduct).to.be.true;
        
        done();
      })
      .then(null,done);
    });

    it('should set isStoreProduct to false if presentation is not a template',function(done){
      presentationObject.isTemplate = false;      
      presentationObject.isStoreProduct = true;      
      isRiseAdmin = true;

      presentation.add(presentationObject)
      .then(function(result){
        expect(result).to.be.ok;
        expect(result.item).to.be.ok;
        expect(result.item).to.have.property("isStoreProduct");
        expect(result.item.isStoreProduct).to.be.false;
        
        done();
      })
      .then(null,done);
    });

    it('should not send isStoreProduct if user is not Rise Admin',function(done){
      presentationObject.isTemplate = true;
      presentationObject.isStoreProduct = true;      
      isRiseAdmin = false;
      
      presentation.add(presentationObject)
      .then(function(result){
        expect(result).to.be.ok;
        expect(result.item).to.be.ok;
        expect(result.item).to.not.have.property("isStoreProduct");
        
        done();
      })
      .then(null,done);
    });
    
    it("should handle failure to add presentation",function(done){
      presentation.add({})
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
    var presentationObject = {
      "name": "Test Presentation",
      "id": "presentation1",
      "companyId": "TEST_COMP_ID",
    };
    
    it('should update a presentation',function(done){
      presentation.update(presentationObject.id, presentationObject)
      .then(function(result){
        expect(result).to.be.ok;
        expect(result.item).to.be.ok;
        
        done();
      })
      .then(null,done);
    });

    it('should send isStoreProduct if user is Rise Admin',function(done){
      presentationObject.isTemplate = true;
      presentationObject.isStoreProduct = true;      
      isRiseAdmin = true;

      presentation.update(presentationObject.id, presentationObject)
      .then(function(result){
        expect(result).to.be.ok;
        expect(result.item).to.be.ok;
        expect(result.item).to.have.property("isStoreProduct");
        expect(result.item.isStoreProduct).to.be.true;
        
        done();
      })
      .then(null,done);
    });

    it('should set isStoreProduct to false if presentation is not a template',function(done){
      presentationObject.isTemplate = false;      
      presentationObject.isStoreProduct = true;      
      isRiseAdmin = true;

      presentation.update(presentationObject.id, presentationObject)
      .then(function(result){
        expect(result).to.be.ok;
        expect(result.item).to.be.ok;
        expect(result.item).to.have.property("isStoreProduct");
        expect(result.item.isStoreProduct).to.be.false;
        
        done();
      })
      .then(null,done);
    });

    it('should not send isStoreProduct if user is not Rise Admin',function(done){
      presentationObject.isStoreProduct = true;      
      isRiseAdmin = false;
      
      presentation.update(presentationObject.id, presentationObject)
      .then(function(result){
        expect(result).to.be.ok;
        expect(result.item).to.be.ok;
        expect(result.item).to.not.have.property("isStoreProduct");
        
        done();
      })
      .then(null,done);
    });

    
    it('should remove extra properties',function(done){
      presentation.update(presentationObject.id, presentationObject)
      .then(function(result){
        expect(result).to.be.ok;
        expect(result.item).to.be.ok;
        expect(result.item).to.not.have.property("connected");
        
        done();
      })
      .then(null,done);
    });
    
    it("should handle failure to update presentation",function(done){
      presentation.update(presentationObject.id, {})
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
    it('should call the delete API and delete the presentation',function(done){
      presentation.delete('presentation1')
        .then(function(result){
          expect(result).to.be.ok;
          expect(result.item).to.be.ok;

          coreApi.presentation.delete.should.have.been.calledWith({
            id: 'presentation1',
            force: undefined
          });

          done();
        })
        .then(null,done);
    });

    it('should attach force delete parameter',function(done){
      presentation.delete('presentation1', true)
        .then(function(result){
          expect(result).to.be.ok;
          expect(result.item).to.be.ok;

          coreApi.presentation.delete.should.have.been.calledWith({
            id: 'presentation1',
            force: true
          });

          done();
        })
        .then(null,done);
    });

    it("should handle failure to delete presentation",function(done){
      coreApi.presentation.delete.returns(Q.reject('API Failed'));

      presentation.delete()
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

  describe('publish:',function(){
    it('should publish a presentation',function(done){
      presentation.publish('presentation1')
        .then(function(result){
          expect(result).to.be.ok;
          expect(result.item).to.be.ok;
          expect(result.item).to.equal("Published.");
          done();
        })
        .then(null,done);
    });

    it("should handle failure to publish presentation",function(done){
      presentation.publish()
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

  describe('restore:',function(){
    it('should restore a presentation',function(done){
      presentation.restore('presentation1')
        .then(function(result){
          expect(result).to.be.ok;
          expect(result.item).to.be.ok;
          expect(result.item).to.have.property("name");
          expect(result.item).to.have.property("publish");
          expect(result.item).to.have.property("id");
          expect(result.item.id).to.equal("presentation1");
          expect(result.item.name).to.equal("Test Presentation");
          expect(result.item.publish).to.equal(0);
          done();
        })
        .then(null,done);
    });

    it("should handle failure to restore presentation",function(done){
      presentation.restore()
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

  describe('buildFilterString:',function(){
    it('should combine query and filter',function(){
      var res = presentation.buildFilterString('query', 'filter');
      expect(res).to.equal('(name:~"query" OR id:~"query" OR revisionStatusName:~"query") AND (filter)');
    });

    it('should not add "AND" to when no query',function(){
      var res = presentation.buildFilterString('query', 'filter');
      expect(res).to.equal('(name:~"query" OR id:~"query" OR revisionStatusName:~"query") AND (filter)');
    });

    it('should not add "AND" to when no filter',function(){
      var res = presentation.buildFilterString('', 'filter');
      expect(res).to.equal('(filter)');
    });

  });
});
