'use strict';
describe('service: display:', function() {
  var CONNECTION_TIME_STRING = "2012-04-02T14:19:36.000Z";
  var CONNECTION_TIME = new Date(CONNECTION_TIME_STRING);
  var CONNECTION_TIME_MILLIS = CONNECTION_TIME.getTime();
  var screenshotRequesterMock;

  beforeEach(module('risevision.displays.services'));
  beforeEach(module(function ($provide) {
    $provide.service('$q', function() {return Q;});
    $provide.factory('screenshotRequester', function($q) {
      return function(ids) {
        return screenshotRequesterMock($q);
      };
    });
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

    $provide.service('displayActivationTracker', function() {
      return sinon.stub();
    });
    $provide.service('coreAPILoader',function () {
      return function(){
        var deferred = Q.defer();

        deferred.resolve({
          display: {
            list: function(obj){
              expect(obj).to.be.ok;

              searchString = obj.search;
              sortString = obj.sort;

              var def = Q.defer();
              if (returnResult) {
                def.resolve({
                  result : {
                    nextPageToken : 1,
                    items : [
                      {id: 'abc', companyId: 'comp1', onlineStatus: 'online', lastActivityDate: CONNECTION_TIME_STRING },
                      {id: 'def', companyId: 'comp2', onlineStatus: 'offline', lastActivityDate: CONNECTION_TIME_STRING }
                    ]
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
                      "id": "display1",
                      "companyId": "TEST_COMP_ID",
                      "name": "Test Display",
                      "creationDate": "2012-04-02T14:19:36.000Z",
                      "status": 1,
                      "width": 1124,
                      "height": 768,
                      "restartEnabled": true,
                      "restartTime": "02:45",
                      "connected": false,
                      "onlineStatus": obj.id === 'display1' ? "online" : "offline",
                      "lastActivityDate": CONNECTION_TIME_STRING
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

                obj.data.id = "display1"

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
              expect(obj.id).to.equal('display1');
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
            restart: function(obj) {
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
            reboot: function(obj) {
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
            uploadControlFile: function(obj) {
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
            sendSetupEmail: function(obj) {
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
            hasFreeDisplays: function(obj) {
              expect(obj).to.be.ok;

              var def = Q.defer();
              if (obj.companyId) {
                def.resolve({
                  result: {
                    items: ['freeDisplay']
                  }
                });
              } else {
                def.reject("API Failed");
              }
              return def.promise;
            },
            summary: function(obj) {
              expect(obj).to.be.ok;

              var def = Q.defer();
              if (returnResult) {
                def.resolve({
                  result: {
                    companyId: obj.companyId,
                    online: 1
                  }
                });
              } else {
                def.reject("API Failed");
              }
              return def.promise;
            },
            export: function(obj) {
              expect(obj).to.be.ok;

              var def = Q.defer();
              if (returnResult) {
                def.resolve({
                  result: {
                    companyId: obj.companyId,
                    export: true
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
  var display, returnResult, searchString, sortString, $rootScope, displayActivationTracker;
  beforeEach(function(){
    returnResult = true;
    searchString = '';
    sortString='';

    inject(function($injector){
      display = $injector.get('display');
      displayActivationTracker = $injector.get('displayActivationTracker');
      $rootScope = $injector.get('$rootScope');
    });
  });

  it('should exist',function(){
    expect(display).to.be.ok;
    expect(display.list).to.be.a('function');
    expect(display.get).to.be.a('function');
    expect(display.add).to.be.a('function');
    expect(display.update).to.be.a('function');
    expect(display.delete).to.be.a('function');
    expect(display.restart).to.be.a('function');
    expect(display.reboot).to.be.a('function');
  });

  describe('list:',function(){
    it('should return a list of displays',function(done){
      var items;
      var broadcastSpy = sinon.spy($rootScope,'$broadcast');

      display.list({})
      .then(function(result){
        expect(result).to.be.ok;
        items = result.items;
        expect(items).to.be.an.array;
        expect(items.length).to.equal(2);
        expect(items[0].onlineStatus).to.equal('online');
        expect(items[0].lastActivityDate.getTime()).to.not.equal(CONNECTION_TIME_MILLIS);
        expect(items[1].onlineStatus).to.equal('offline');
        expect(items[1].lastActivityDate.getTime()).to.equal(CONNECTION_TIME_MILLIS);

        setTimeout(function() {
          broadcastSpy.should.have.been.calledWith('displaysLoaded', items);

          displayActivationTracker.should.have.been.calledWith(items);

          done();
        });
      });
    });

    it('should create an empty searchString if query is empty',function(done){
      display.list({})
      .then(function(result){
        expect(searchString).to.equal('');

        done();
      })
      .then(null,done);
    });

    it('should set sort to be desc if reverse option is passed',function(done){
      display.list({sortBy: 'anyThing', reverse: true})
        .then(function(result){
          expect(sortString).to.equal('anyThing desc');

          done();
        })
        .then(null,done);
    });

    it('should set sort to be asc if reverse option is not passed',function(done){
      display.list({sortBy: 'anyThing'})
        .then(function(result){
          expect(sortString).to.equal('anyThing asc');

          done();
        })
        .then(null,done);
    });

    it('should output a proper search string',function(done){
      display.list({query: 'str'})
        .then(function(result){
          expect(searchString).to.equal('name:~\"str\" OR id:~\"str\" OR street:~\"str\" OR unit:~\"str\" OR city:~\"str\" OR province:~\"str\" OR country:~\"str\" OR postalCode:~\"str\"');

          done();
        })
        .then(null,done);
    });

    it("should handle failure to get list correctly",function(done){
      returnResult = false;

      display.list({})
      .then(function(displays) {
        done(displays);
      })
      .then(null, function(error) {
        expect(error).to.deep.equal('API Failed');
        done();
      })
      .then(null,done);
    });
  });

  describe('get:',function(){
    var item;
    it('should return an online display',function(done){
      var broadcastSpy = sinon.spy($rootScope,'$broadcast');

      display.get('display1')
      .then(function(result){
        expect(result).to.be.ok;
        item = result.item;
        expect(item).to.be.ok;
        expect(item).to.have.property("name");

        expect(item.onlineStatus).to.equal('online');
        expect(item.lastActivityDate.getTime()).to.not.equal(CONNECTION_TIME_MILLIS);

        broadcastSpy.should.have.been.calledWith('displaysLoaded', [item]);

        displayActivationTracker.should.have.been.calledWith([item]);

        done();
      })
      .then(null,done);
    });

    it('should return an offline display',function(done){
      var broadcastSpy = sinon.spy($rootScope,'$broadcast');

      display.get('display2')
      .then(function(result){
        expect(result).to.be.ok;
        item = result.item;
        expect(item).to.be.ok;
        expect(item).to.have.property("name");

        expect(item.onlineStatus).to.equal('offline');
        expect(item.lastActivityDate.getTime()).to.equal(CONNECTION_TIME_MILLIS);

        broadcastSpy.should.have.been.calledWith('displaysLoaded', [item]);

        displayActivationTracker.should.have.been.calledWith([item]);

        done();
      })
      .then(null,done);
    });

    it("should handle failure to get display correctly",function(done){
      display.get()
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
    var displayObject = {
      "name": "Test Display",
      "status": 1,
      "width": 1124,
      "height": 768,
      "restartEnabled": true,
      "restartTime": "02:45",
      'playerProAuthorized': 'authorized'
    };

    it('should add a display',function(done){
      display.add(displayObject)
      .then(function(result){
        expect(result).to.be.ok;
        expect(result.item).to.be.ok;
        expect(result.item).to.have.property("name");
        expect(result.item).to.have.property("id");
        expect(result.item.id).to.equal("display1");
        expect(result.item.assignLicense).to.equal('authorized');

        done();
      })
      .then(null,done);
    });

    it("should handle failure to add display",function(done){
      display.add({})
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
    var displayObject = {
      "name": "Test Display",
      "id": "display1",
      "companyId": "TEST_COMP_ID",
      "status": 1,
      "width": 1124,
      "height": 768,
      "restartEnabled": true,
      "restartTime": "02:45",
    };

    it('should update a display',function(done){
      display.update(displayObject.id, displayObject)
      .then(function(result){
        expect(result).to.be.ok;
        expect(result.item).to.be.ok;

        done();
      })
      .then(null,done);
    });

    it('should remove extra properties',function(done){
      display.update(displayObject.id, displayObject)
      .then(function(result){
        expect(result).to.be.ok;
        expect(result.item).to.be.ok;
        expect(result.item).to.not.have.property("connected");

        done();
      })
      .then(null,done);
    });

    it("should handle failure to update display",function(done){
      display.update(displayObject.id, {})
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
    it('should delete a display',function(done){
      display.delete('display1')
        .then(function(result){
          expect(result).to.be.ok;
          expect(result.item).to.be.ok;

          done();
        })
        .then(null,done);
    });

    it("should handle failure to delete display",function(done){
      display.delete()
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

  describe('restart:',function(){
    it('should restart a display',function(done){
      display.restart('display1')
        .then(function(result){
          expect(result).to.be.ok;
          expect(result.item).to.be.ok;

          done();
        })
        .then(null,done);
    });

    it("should handle failure to restart display",function(done){
      display.restart()
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

  describe('reboot', function(){
    it('should reboot a display',function(done){
      display.reboot('display1')
        .then(function(result){
          expect(result).to.be.ok;
          expect(result.item).to.be.ok;

          done();
        })
        .then(null,done);
    });

    it("should handle failure to reboot display",function(done){
      display.reboot()
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

  describe('requestScreenshot', function() {
    it('should successfully request a screenshot', function() {
      screenshotRequesterMock = function($q) {
        return $q.resolve({ msg: 'screenshot-saved' });
      };

      display.requestScreenshot()
        .then(function(resp) {
          expect(resp.msg).to.equal('screenshot-saved');
        });
    });

    it('should handled failed screenshot requests', function() {
      screenshotRequesterMock = function($q) {
        return $q.reject('screenshot-failed');
      };

      display.requestScreenshot()
        .catch(function(resp) {
          expect(resp).to.equal('screenshot-failed');
        });
    });
  });

  describe('uploadControlFile', function() {
    it('should upload the control file', function(done) {
      display.uploadControlFile('display1', 'contents')
        .then(function(result) {
          expect(result).to.be.ok;
          expect(result.item).to.be.ok;

          done();
        })
        .then(null,done);
    });

    it('should handle failure to upload the control file', function(done) {
      display.reboot()
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

  describe('sendSetupEmail', function() {
	it('should send setup email', function(done) {
	  display.sendSetupEmail('display1', 'email@company.com')
	    .then(function(result) {
	      expect(result).to.be.ok;
	      expect(result.item).to.be.ok;

	      done();
	    })
	    .then(null,done);
	});

	it('should handle failure to send setup email', function(done) {
	  display.sendSetupEmail()
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

  describe('hasFreeDisplays', function() {

    it('should check if has free displays', function(done) {
      display.hasFreeDisplays('companyId', ['displayId']).then(function(result) {
        expect(result).to.deep.equal(['freeDisplay']);
        done();
      });
    });

    it('should handle has free displays failures', function(done) {
      display.hasFreeDisplays().then(function() {
        done('it should have failed');
      },function(){
        done();
      });
    });
  });

  describe('summary:', function() {

    it('should retrieve summary for provided company', function(done) {
      display.summary('companyId').then(function(result) {
        expect(result).to.deep.equal({online: 1, companyId: 'companyId'});
        done();
      });
    });

    it('should retrieve summary with selected company if none is provided', function(done) {
      display.summary().then(function(result) {
        expect(result).to.deep.equal({online: 1, companyId: 'TEST_COMP_ID'});
        done();
      });
    });

    it('should handle request failures', function(done) {
      returnResult = false;
      display.summary().then(function() {
        done('it should have failed');
      },function(){
        done();
      });
    });
  });

  describe('export:', function() {
    it('should request displays export for selected company', function(done) {
      display.export().then(function(result) {
        expect(result).to.deep.equal({export: true, companyId: 'TEST_COMP_ID'});
        done();
      });
    });

    it('should handle request failures', function(done) {
      returnResult = false;
      display.export().then(function() {
        done('it should have failed');
      },function(){
        done();
      });
    });
  });

});
