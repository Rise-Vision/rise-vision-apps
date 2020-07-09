'use strict';
describe('service: tourFactory:', function() {
  beforeEach(module('risevision.apps.services'));
  var tourFactory, localStorageService;
  beforeEach(function(){
    module(function ($provide) {
      $provide.service('localStorageService', function() {
        return {
          get: sinon.stub(),
          set: sinon.stub()
        };
      });
    })

    inject(function($injector) {
      tourFactory = $injector.get('tourFactory');
      localStorageService = $injector.get('localStorageService');
    });
  });

  it('should exist',function(){
    expect(tourFactory).to.be.ok;
    expect(tourFactory.isShowing).to.be.ok;
    expect(tourFactory.dismissed).to.be.a('function');
  });

  describe('isShowing:', function() {
    it("should check local storage",function(){
      localStorageService.get.returns('anything');

      expect(tourFactory.isShowing('tooltipKey')).to.be.true;

      localStorageService.get.should.have.been.calledWith('tooltipKey.dismissed');
    });

    it("should not show if already dismissed",function(){
      localStorageService.get.returns(true);

      expect(tourFactory.isShowing('tooltipKey')).to.be.false;
    });
  });

  describe('dismissed:', function() {
    it('should update local storage', function() {     
      tourFactory.dismissed('tooltipKey');

      localStorageService.set.should.have.been.calledWith('tooltipKey.dismissed', true);
    });
  });

});
