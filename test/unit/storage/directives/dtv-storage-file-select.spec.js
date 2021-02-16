'use strict';
describe('directive: storage-file-select', function() {
  var $rootScope, element, uploader;

  beforeEach(module('risevision.storage.directives'));

  beforeEach(inject(function(_$compile_, _$rootScope_){    
    var $compile = _$compile_;
    $rootScope = _$rootScope_;

    uploader = {
      removeExif: function() {},
      addToQueue: function() {}
    }
    $rootScope.uploader = uploader

    element = $compile('<input storage-file-select uploader="uploader"></input>')($rootScope);
    $rootScope.$digest();
  }));

  it('should removeExif and addToQueue on "change" ', function() {
    sinon.stub(uploader, 'removeExif', function() {
      return Q.resolve();
    });

    sinon.stub(uploader, 'addToQueue', function() {
      return Q.resolve();
    });

    element.triggerHandler('change');

    setTimeout(function () {
      uploader.removeExif.should.have.been.called;
      uploader.addToQueue.should.have.been.called;
    }, 0);
  });
  
});
