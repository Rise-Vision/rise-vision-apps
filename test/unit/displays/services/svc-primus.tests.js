'use strict';

describe('service: primus:', function() {
  beforeEach(module('risevision.displays.services'));
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

    $provide.service('$window', function() {
      var Primus = function() {
        var dataCb, openCb;

        return {
          on: function(eName, cb) {
            if(eName=== 'data') {
              dataCb = cb;
            } else if (eName === 'open') {
              openCb = cb;
            }
          },
          open: function() {
            setTimeout(function() {
              openCb();
            });
          },
          write: function(d) {
            setTimeout(function() {
              dataCb({
                msg: 'presence-result',
                result: [{'a': true}, {'b': false}, {'c': true},]
              })
            });
          }
        }
      };
      return { Primus: Primus };
    });

  }));

  var getDisplayStatus;
  describe('primus', function() {
    beforeEach(function(){
      inject(function($injector){
        getDisplayStatus = $injector.get('getDisplayStatus');
      });
    });

    it('should call primus and load status', function(done) {
      getDisplayStatus(['a', 'b', 'c']).then(function(msg) {
        expect(msg).to.deep.equal( [{'a': true}, {'b': false}, {'c': true},]);
        done();
      })
    });
  });
});
