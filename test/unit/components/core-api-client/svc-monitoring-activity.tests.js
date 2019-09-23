/**
 * Created by rodrigopavezi on 10/20/14.
 */
"use strict";
describe("Module: risevision.common.monitoring.activity", function() {


    beforeEach(module("risevision.common.monitoring.activity"));

    beforeEach(module(function ($provide) {
        //stub services
        $provide.service("$q", function() {return Q;});

        $provide.value("monitoringAPILoader", function() {
            var deffered = Q.defer();
            var gapi = {
                activity: {
                    get: function() {
                        return {
                            execute: function(callback) {
                                setTimeout(function() {
                                    callback(window.rvFixtures.activity);
                                }, 0);
                            }
                        };
                    }
                }
            };
            deffered.resolve(gapi);
            return deffered.promise;
        });
    }));

    var getActivity;
    beforeEach(function(){
        inject(function($injector){
            getActivity = $injector.get("getActivity");
        });
    });

    it("should exist",function(){
        expect(getActivity).to.be.ok;
    });

    it("Should retrieve the activity of a particular app.", function(done) {
        var clientId = "xxxxxxx";
        var api = "CoreAPIv0";
        getActivity(clientId,api).then(function(result){
            expect(result).to.deep.equal(rvFixtures.activity.result);
            done();
        }).then(null,done);

    });

});
