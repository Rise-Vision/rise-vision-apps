'use strict';
describe('service: DisplayListOperations:', function() {
  beforeEach(module('risevision.displays.services'));
  beforeEach(module(function ($provide) {
    $provide.service('$q', function() {return Q;});

    $provide.service('displayFactory', function() {
      return {
        deleteDisplayByObject: 'deleteDisplayByObject'
      };
    });

  }));
  var displayListOperations, displayFactory;
  beforeEach(function(){
    inject(function($injector){
      var DisplayListOperations = $injector.get('DisplayListOperations');
      displayFactory = $injector.get('displayFactory');
      displayListOperations = new DisplayListOperations();
    });
  });
  
  it('should exist',function(){
    expect(displayListOperations).to.be.ok;
    expect(displayListOperations.name).to.equal('Display');
    expect(displayListOperations.operations).to.have.length(2);
    expect(displayListOperations.operations[0].name).to.equal('Delete');
    expect(displayListOperations.operations[0].actionCall).to.equal('deleteDisplayByObject');
    expect(displayListOperations.operations[0].requireRole).to.equal('da');
  });


});
