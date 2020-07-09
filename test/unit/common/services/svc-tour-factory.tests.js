'use strict';
describe('service: tourFactory:', function() {
  beforeEach(module('risevision.apps.services'));
  var tourFactory, localStorageService, $sessionStorage;
  beforeEach(function(){
    module(function ($provide) {
      $provide.service('localStorageService', function() {
        return {
          get: sinon.stub(),
          set: sinon.stub()
        };
      });
      $provide.value('$sessionStorage', {});
    })

    inject(function($injector) {
      tourFactory = $injector.get('tourFactory');
      localStorageService = $injector.get('localStorageService');
      $sessionStorage = $injector.get('$sessionStorage');
    });
  });

  it('should exist',function(){
    expect(tourFactory).to.be.ok;
    expect(tourFactory.isShowing).to.be.ok;
    expect(tourFactory.dismissed).to.be.a('function');
  });

  describe('isShowing:', function() {
    beforeEach(function() {
      localStorageService.get.reset();
      localStorageService.set.reset();
    });

    it("should check session storage if the tour was seen",function(){
      $sessionStorage.tooltipKeySeen = true;

      expect(tourFactory.isShowing('tooltipKey')).to.be.false;

      localStorageService.get.should.not.have.been.called;
      localStorageService.set.should.not.have.been.called;
    });

    it("should check how many times the tour was seen",function(){
      $sessionStorage.tooltipKeySeen = false;
      localStorageService.get.returns(6);

      expect(tourFactory.isShowing('tooltipKey')).to.be.false;

      localStorageService.get.should.have.been.calledWith('tooltipKeySeen');
      localStorageService.set.should.not.have.been.called;
    });

    it("should show and initialize the number of times the tour was seen",function(){
      $sessionStorage.tooltipKeySeen = false;
      localStorageService.get.returns(null);

      expect(tourFactory.isShowing('tooltipKey')).to.be.true;

      localStorageService.get.should.have.been.calledWith('tooltipKeySeen');
      localStorageService.set.should.have.been.calledWith('tooltipKeySeen', 1);
    });

    it("should show and increment the number of times the tour was seen",function(){
      $sessionStorage.tooltipKeySeen = false;
      localStorageService.get.returns(2);

      expect(tourFactory.isShowing('tooltipKey')).to.be.true;

      localStorageService.get.should.have.been.calledWith('tooltipKeySeen');
      localStorageService.set.should.have.been.calledWith('tooltipKeySeen', 3);
    });
  });

  describe('dismissed:', function() {
    it('should update session storage', function() {     
      tourFactory.dismissed('tooltipKey');

      expect($sessionStorage.tooltipKeySeen).to.be.true;
    });
  });

});
