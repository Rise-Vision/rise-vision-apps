'use strict';
describe('directive: playlist subscription status', function() {
  beforeEach(module('risevision.editor.directives'));
  var elm, $scope, $compile, item;

  beforeEach(module(function ($provide) {
    $provide.service('playlistItemFactory', function() {
      return {};
    });
  }));

  beforeEach(inject(function($rootScope, _$compile_, $templateCache) {
    item = {};

    $templateCache.put('partials/editor/playlist-subscription-status.html', '<p>Content</p>');
    $scope = $rootScope.$new();
    $scope.item = item;
    $compile = _$compile_;
  }));

  function compileDirective() {
    elm = $compile('<playlist-subscription-status item="item"></playlist-subscription-status>')($scope);
    $scope.$digest();
  }

  it('should compile html', function(done) {
    compileDirective();

    setTimeout(function() {
      $scope.$digest();
      expect(elm.html()).to.equal('Content');
      done()
    }, 10);

  });

  it('should populate scope', function(done) {
    compileDirective();

    setTimeout(function() {
      expect(elm.isolateScope().item).to.equal(item);
      expect(elm.isolateScope().showStatus).to.be.a('function');
      done()
    }, 10);

  });

  describe('showStatus:', function(){
    it('should hide status by default if gadget is missing',function(){
      expect(elm.isolateScope().showStatus()).to.not.be.ok;
    });

    it('should hide status if subscriptionStatus is not loaded',function(){
      item.gadget = {
        isSubscribed: false,
        isLicensed: false
      };

      compileDirective();

      expect(elm.isolateScope().showStatus()).to.not.be.ok;
    });


    it('should show status if gadget is not subscribed and not licensed',function(){
      item.gadget = {
        subscriptionStatus: 'status',
        isSubscribed: false,
        isLicensed: false
      };

      compileDirective();

      expect(elm.isolateScope().showStatus()).to.be.true;
    });

    it('should hide status if gadget subscribed and not licensed',function(){
      item.gadget = {
        subscriptionStatus: 'status',
        isSubscribed: true,
        isLicensed: false
      };

      compileDirective();

      expect(elm.isolateScope().showStatus()).to.be.false;
    });

    it('should hide status if gadget is not subscribed but licensed',function(){
      item.gadget = {
        subscriptionStatus: 'status',
        isSubscribed: false,
        isLicensed: true
      };

      compileDirective();

      expect(elm.isolateScope().showStatus()).to.be.false;
    });

    it('should hide status if gadget is subscribed and licensed',function(){
      item.gadget = {
        subscriptionStatus: 'status',
        isSubscribed: true,
        isLicensed: true
      };

      compileDirective();

      expect(elm.isolateScope().showStatus()).to.be.false;
    });

  });

});
