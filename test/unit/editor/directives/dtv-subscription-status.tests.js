'use strict';
describe('directive: subscription status', function() {
  beforeEach(module('risevision.editor.services'));
  beforeEach(module('risevision.editor.directives'));
  var elm, $scope, $compile, item, gadget;

  beforeEach(module(function ($provide) {
    $provide.service('$q', function() {return Q;});
    $provide.service('gadgetFactory', function() {
      return {
        updateItemsStatus: function(items){
          var deferred = Q.defer();
          items[0].gadget = gadget;
          deferred.resolve();
          return deferred.promise;
        }
      };
    });
  }));

  beforeEach(inject(function($rootScope, _$compile_, $templateCache) {
    item = { objectReference: 'gadgetId' };
    gadget = {
      id: 'gadgetId',
      subscriptionStatus: 'Subscribed'
    }
    $templateCache.put('partials/editor/subscription-status.html', '<p>{{item.gadget.subscriptionStatus}}</p>');
    $scope = $rootScope.$new();
    $scope.item = item;
    $compile = _$compile_;
  }));

  function compileDirective() {
    elm = $compile('<gadget-subscription-status item="item"></gadget-subscription-status>')($scope);
    $scope.$digest();
  }

  function compilePlansDirective() {
    elm = $compile('<gadget-subscription-status item="item" use-custom-on-click="true" custom-on-click="showPlansModal()"></gadget-subscription-status>')($scope);
    $scope.$digest();
  }

  it('should compile html', function(done) {
    compileDirective();

    setTimeout(function() {
      $scope.$digest();
      expect(elm.html()).to.equal('<p class="ng-binding">Subscribed</p>');
      done()
    }, 10);

  });

  it('should populate scope', function(done) {
    compileDirective();

    setTimeout(function() {
      expect(elm.isolateScope().item.gadget).to.equal(gadget);
      expect(elm.isolateScope().showSubscribe).to.be.false;
      expect(elm.isolateScope().showAccountButton).to.be.false;
      expect(elm.isolateScope().className).to.equal('trial');
      done()
    }, 10);

  });

  describe('Not Subscribed:', function(){
    it('should show subscribe button and trial period',function(done){
      gadget.subscriptionStatus = 'Not Subscribed';
      compileDirective();

      setTimeout(function() {
        expect(elm.isolateScope().item.gadget).to.equal(gadget);
        expect(elm.isolateScope().showSubscribe).to.be.true;
        expect(elm.isolateScope().useCustomOnClick).to.be.falsey;
        expect(elm.isolateScope().showAccountButton).to.be.false;
        expect(elm.isolateScope().className).to.equal('trial');
        done()
      }, 10);
    });

    it('should show subscribe button with Plans modal',function(done){
      gadget.subscriptionStatus = 'Not Subscribed';
      compilePlansDirective();

      setTimeout(function() {
        expect(elm.isolateScope().item.gadget).to.equal(gadget);
        expect(elm.isolateScope().showSubscribe).to.be.true;
        expect(elm.isolateScope().useCustomOnClick).to.be.truely;
        expect(elm.isolateScope().showAccountButton).to.be.false;
        expect(elm.isolateScope().className).to.equal('trial');
        done()
      }, 10);
    });
  });

  describe('On Trial:', function(){
    it('should show subscribe button and days remaining',function(done){
      gadget.subscriptionStatus = 'On Trial';
      compileDirective();

      setTimeout(function() {
        expect(elm.isolateScope().item.gadget).to.equal(gadget);
        expect(elm.isolateScope().showSubscribe).to.be.true;
        expect(elm.isolateScope().showAccountButton).to.be.false;
        expect(elm.isolateScope().className).to.equal('trial');
        done()
      }, 10);
    })
  });

  describe('Trial Expired:', function(){
    it('should show subscribe button and expired',function(done){
      gadget.subscriptionStatus = 'Trial Expired';
      compileDirective();

      setTimeout(function() {
        expect(elm.isolateScope().item.gadget).to.equal(gadget);
        expect(elm.isolateScope().showSubscribe).to.be.true;
        expect(elm.isolateScope().showAccountButton).to.be.false;
        expect(elm.isolateScope().className).to.equal('expired');
        done()
      }, 10);
    })
  });

  describe('Cancelled:', function(){
    it('should show subscribe button and days remaining',function(done){
      gadget.subscriptionStatus = 'Cancelled';
      compileDirective();

      setTimeout(function() {
        expect(elm.isolateScope().item.gadget).to.equal(gadget);
        expect(elm.isolateScope().showSubscribe).to.be.true;
        expect(elm.isolateScope().showAccountButton).to.be.false;
        expect(elm.isolateScope().className).to.equal('cancelled');
        done()
      }, 10);
    })
  });

  describe('Suspended:', function(){
    it('should show asccount button',function(done){
      gadget.subscriptionStatus = 'Suspended';
      compileDirective();

      setTimeout(function() {
        expect(elm.isolateScope().item.gadget).to.equal(gadget);
        expect(elm.isolateScope().showSubscribe).to.be.false;
        expect(elm.isolateScope().showAccountButton).to.be.true;
        expect(elm.isolateScope().className).to.equal('suspended');
        done()
      }, 10);
    })
  });

});
