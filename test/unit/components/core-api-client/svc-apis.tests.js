/**
 * Created by rodrigopavezi on 10/20/14.
 */
"use strict";
describe("Module: risevision.common.apis", function() {


    beforeEach(module("risevision.common.apis"));

    beforeEach(module(function ($provide) {
        //stub services
        $provide.service("$q", function() {return Q;});

        $provide.value("discoveryAPILoader", function() {
            var deffered = Q.defer();
            var gapi = {
                apis: {
                    list: function() {
                        return {
                            execute: function(callback) {
                                setTimeout(function() {
                                    callback(window.rvFixtures.apis);
                                }, 0);
                            }
                        };
                    },
                    getRest: function() {
                        return {
                            execute: function(callback) {
                                setTimeout(function() {
                                    callback(window.rvFixtures.api);
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

    var listApis;
    beforeEach(function(){
        inject(function($injector){
            listApis = $injector.get("listApis");
        });
    });

    it("should exist",function(){
        expect(listApis).to.be.ok;
    });

    it("Should list all risevision apis", function(done) {
        var name = "";
        var preferred = "";
        listApis(name, preferred).then(function (result) {
            expect(result).to.deep.equal(rvFixtures.apis.items);
            done();
        }).then(null,done);
    });

    var getRest;
    beforeEach(function(){
        inject(function($injector){
            getRest = $injector.get("getRest");
        });
    });

    it("should exist",function(){
        expect(getRest).to.be.ok;
    });

    it("Should retrieve the description of a particular version of an api.", function(done) {
        var api = "core";
        var version = "v0";
        getRest(api,version).then(function(result){
            expect(result).to.deep.equal(rvFixtures.api);
            done();
        }).then(null,done);

    });

});
