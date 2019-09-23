/**
 * Created by rodrigopavezi on 10/20/14.
 */
"use strict";
describe("Module: risevision.common.app", function() {

    var COMPANY_ID = "818e8218-1337-4077-823b-476238992bf1";
    var APP_ID = "12345678910f-44dc-44ea-9f1e-83f6e86d8aa4";
    var USER_ID = "user@gmail.com";

    beforeEach(module("risevision.common.app"));

    beforeEach(module(function ($provide) {
        //stub services
        $provide.service("$q", function() {return Q;});

        $provide.value("riseAPILoader", function() {
            var deffered = Q.defer();
            var gapi = {
                app: {
                    list: function() {
                        return {
                            execute: function(callback) {
                                setTimeout(function() {
                                    callback(window.rvFixtures.apps);
                                }, 0);
                            }
                        };
                    },
                    get: function() {
                        return {
                            execute: function(callback) {
                                setTimeout(function() {
                                    callback(window.rvFixtures.app);
                                }, 0);
                            }
                        };
                    },
                    add: function() {
                        return {
                            execute: function(callback) {
                                setTimeout(function() {
                                    callback(window.rvFixtures.app);
                                }, 0);
                            }
                        };
                    },
                    update: function() {
                        return {
                            execute: function(callback) {
                                setTimeout(function() {
                                    callback(window.rvFixtures.app);
                                }, 0);
                            }
                        };
                    },
                    delete: function() {
                        return {
                            execute: function(callback) {
                                setTimeout(function() {
                                    callback(window.rvFixtures.app);
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

    it("listApps should exist", function(done) {
        inject(function (listApps) {
            expect(listApps).be.defined;
            done();
        });
    });

    it("Should list all apps registered to a company", function(done) {
        inject(function(listApps){
            listApps(COMPANY_ID).then(function(result){
                expect(result).to.deep.equal(rvFixtures.apps.items);
                done();
            }, function(error) {throw error;});
        });
    });

    it("getApp should exist", function(done) {
        inject(function (getApp) {
            expect(getApp).be.defined;
            done();
        });
    });

    it("Should retrieve a registered app by its id", function(done) {
        inject(function(getApp){
            getApp(APP_ID).then(function(result){
                expect(result).to.deep.equal(rvFixtures.app.item);
                done();
            }, function(error) {throw error;});
        });
    });

    it("createApp should exist", function(done) {
        inject(function (createApp) {
            expect(createApp).be.defined;
            done();
        });
    });

    it("Should retrieve the app that has just been registered", function(done) {
        inject(function(createApp){
            createApp(COMPANY_ID, USER_ID).then(function(result){
                expect(result).to.deep.equal(rvFixtures.app.item);
                done();
            }, function(error) {throw error;});
        });
    });

    it("updateApp should exist", function(done) {
        inject(function (updateApp) {
            expect(updateApp).be.defined;
            done();
        });
    });

    it("Should retrieve the app that has just been updated", function(done) {
        inject(function(updateApp){
            updateApp(APP_ID).then(function(result){
                expect(result).to.deep.equal(rvFixtures.app.item);
                done();
            }, function(error) {throw error;});
        });
    });

    it("deleteApp should exist", function(done) {
        inject(function (deleteApp) {
            expect(deleteApp).be.defined;
            done();
        });
    });

    it("Should delete a registered app by its id", function(done) {
        inject(function(deleteApp){
            deleteApp(APP_ID).then(function(result){
                expect(result).to.deep.equal(rvFixtures.app.item);
                done();
            }, function(error) {throw error;});
        });
    });

});
