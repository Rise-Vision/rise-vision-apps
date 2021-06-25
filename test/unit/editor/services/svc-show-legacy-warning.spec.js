'use strict';

describe('service: showLegacyWarning:', function() {
  beforeEach(module('risevision.editor.services'));

  beforeEach(module(function ($provide) {
    $provide.service('$q', function() {return Q;});

    $provide.value('$window', {
      location: {}
    });

    $provide.factory('$modal', function() {
      var modalInstance = { result: Q.resolve(), dismiss: sinon.stub() };
      return {
        modalInstance: modalInstance,
        open: sinon.stub().returns(modalInstance)
      };
    });

    $provide.value('environment', {
      'RVA_URL': 'http://rva-test.appspot.com'
    });

  }));
  
  var showLegacyWarning, $modal, $window;

  beforeEach(function(){
    inject(function($injector){
      showLegacyWarning = $injector.get('showLegacyWarning');
      $modal = $injector.get('$modal');
      $window = $injector.get('$window');
    });
  });

  it('should exist',function(){
    expect(showLegacyWarning).to.be.a('function');
  });

  it('should show legacy content modal', function(done) {
    showLegacyWarning({})
    .then(function() {
      $modal.open.should.have.been.calledWithMatch({
        templateUrl: 'partials/components/confirm-modal/confirm-modal.html',
        controller: 'confirmModalController',
        windowClass: 'modal-custom'
      });

      done();
    });
  });

  it('should dismiss and open old editor on page confirm', function(done){
    showLegacyWarning({
      id: 'id',
      companyId: 'companyId'
    })
    .then(function() {
      expect($window.location.href).to.equal('http://rva-test.appspot.com/#/PRESENTATION_MANAGE/id=id?cid=companyId');

      done();
    });
  });

});
