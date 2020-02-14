/*jshint expr:true */

describe("Services: Zendesk", function() {
  beforeEach(module("risevision.common.support"));

  var sandbox, windowObj, zeSpy, widgetShown;

  sandbox = sinon.sandbox.create();

  beforeEach(function() {
    this.clock = sandbox.useFakeTimers();
  });

  afterEach(function() {
    this.clock.restore();
    sandbox.restore();
  });

  beforeEach(function() {
    widgetShown = false;
  });

  beforeEach(module(function($provide) {
    $provide.service("$q", function() {return Q;});
    $provide.value("userState", {
      isRiseVisionUser: function () {return true; },
      _restoreState: function () {},
      getUsername: function() { return "hello"; },
      getUserFullName: function() { return "user name"; },
      getUserEmail: function() { return "someone@hello.com"; },
      getUserCompanyId: function() { return "abcdefg"; },
      getUserCompanyName: function() { return "Rich Inc."; },
      getSelectedCompanyId: function() { return "abcdefg"; },
    });
    $provide.service("segmentAnalytics", function() {
      return {
        identify: function() {},
      };
    });
    $provide.service("userAuthFactory", function() {
      return {
        authenticate: function() {
          return Q.resolve();
        },
      };
    });

    var fakeBorderContainer = {
      css: function() {
      }
    };

    windowObj = {
      document: {
        body: { appendChild: function () {
          zeSpy = sandbox.spy(function(cb) {
            cb();
          });
          zeSpy.hide = function() {};
          zeSpy.show = function() {};
          windowObj.zE = zeSpy;
          windowObj.zE.identify = function() {};
        } },
        createElement: function() {
          return {
          };
        },
      },
      $: function() {
        return {
          contents: function() {
            return {
              find: function (query) {
                if(query === ".Container") {
                  return fakeBorderContainer;
                } else {
                  return null;
                }
              }
            };
          }
        };
      }
    };

    $provide.service("$window", function() {
      return windowObj;
    });
  }));

  it("should exists", function() {
    inject(function(zendesk) {
      expect(zendesk).to.be.ok;
    });
  });

  it("initializeWidget", function(done) {
    inject(function(zendesk) {
      zendesk.initializeWidget().then(function(){
        expect(zeSpy).to.have.been.called;
        done();
      }, done);
    });
  });
});
