'use strict';

describe('service: canvaTypePicker', function() {

  var canvaTypePicker, $modal;

  beforeEach(module('risevision.common.components.canva-type-picker.services'));

  beforeEach(module(function ($provide) {
    $provide.service("$modal",function(){
      return {
        open: sinon.stub().returns({result: Q.resolve()})
      };
    });  
  }));

  beforeEach(function() {
    inject(function($injector) {
      canvaTypePicker = $injector.get('canvaTypePicker');     
      $modal = $injector.get('$modal');
    });
  });

  it('should initialize', function () {
    expect(canvaTypePicker).to.be.ok;
    expect(canvaTypePicker).to.be.a('function');
  });

  it('should return a promise', function() {
    expect(canvaTypePicker().then).to.be.ok;
    expect(canvaTypePicker().then).to.be.a('function');
  });

  it('should open canva type picker', function() {
    canvaTypePicker();

    $modal.open.should.have.been.calledWithMatch({
      templateUrl: 'partials/components/canva-type-picker/canva-type-picker.html',
      controller: 'canvaTypePickerController',
      windowClass: 'madero-style centered-modal',
      size: 'sm'          
    });
  });

  it('should resolve if modal resolves', function(done) {
    canvaTypePicker().then(function() {
      $modal.open.should.have.been.called;
      done();
    });
  });

  it('should reject if modal rejects', function(done) {
    $modal.open.returns({result: Q.reject()});

    canvaTypePicker().catch(function() {
      $modal.open.should.have.been.called;
      done();
    });
  });
});
