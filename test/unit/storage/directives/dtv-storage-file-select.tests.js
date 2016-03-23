'use strict';
describe('directive: storage-file-select', function() {
  var $rootScope, element, uploader;
  var testitem = {name: 'image.jpg'};

  beforeEach(module('risevision.storage.directives'));

  beforeEach(inject(function(_$compile_, _$rootScope_){    
    var $compile = _$compile_;
    $rootScope = _$rootScope_;

    uploader = {
      addToQueue: function() {
        return { then:function(){} }
      }
    }
    $rootScope.uploader = uploader

    element = $compile('<input storage-file-select uploader="uploader"></input>')($rootScope);
    $rootScope.$digest();
  }));

  it('should addToQueue on "change" ', function() {
    var addToQueueSpy = sinon.spy(uploader,'addToQueue');    
    element.triggerHandler('change');
    addToQueueSpy.should.have.been.called;
  });  
  
});
