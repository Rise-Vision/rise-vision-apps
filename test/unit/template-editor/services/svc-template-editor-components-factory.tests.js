'use strict';

describe('service: templateEditorComponentsFactory:', function() {
  var sandbox = sinon.sandbox.create();
  var userState, componentsFactory, displayAddress;


  beforeEach(module('risevision.template-editor.services'));

  beforeEach(module(function ($provide) {
    $provide.service('userState', function() {
      return {
        getUsername: function() {
          return 'testusername';
        },
        _restoreState: function() {},
        getCopyOfSelectedCompany: sandbox.stub().returns(displayAddress)
      };
    });
  }));

  beforeEach(function() {
    inject(function($injector) {
      userState = $injector.get('userState');
      componentsFactory = $injector.get('templateEditorComponentsFactory');
      displayAddress = {
        city: 'city',
        province: 'province',
        country: 'country',
        postalCode: 'postalCode'
      };
    });
  });

  afterEach(function() {
    sandbox.restore();
  });

  it('should initialize', function() {
    expect(componentsFactory).to.be.truely;

    expect(componentsFactory.components).to.be.truely;    
  });

  describe('getSetupData:', function() {

    it('should return empty list if no components are registered', function() {
      expect(componentsFactory.getSetupData(null)).to.deep.equal([]);
      expect(componentsFactory.getSetupData([])).to.deep.equal([]);
      expect(componentsFactory.getSetupData([{id:'comp1', type:'comp'}])).to.deep.equal([]);
    });


    it('should return empty list if components don\'t require displayAddress', function() {
      componentsFactory.components['comp'] = {type:'comp'};
      expect(componentsFactory.getSetupData(null)).to.deep.equal([]);
      expect(componentsFactory.getSetupData([])).to.deep.equal([]);
      expect(componentsFactory.getSetupData([{id:'comp1', type:'comp'}])).to.deep.equal([]);
    });

    it('should return displayAddress for components that require it', function(){
      componentsFactory.components['comp'] = {type:'comp'};
      componentsFactory.components['comp-display'] = {type:'comp-display', initDisplayAddres:true};

      expect(componentsFactory.getSetupData(null)).to.deep.equal([]);
      expect(componentsFactory.getSetupData([])).to.deep.equal([]);
      expect(componentsFactory.getSetupData([{id:'comp1', type:'comp'}])).to.deep.equal([]);

      expect(componentsFactory.getSetupData([{id:'comp1', type:'comp'}])).to.deep.equal([]);

      expect(componentsFactory.getSetupData([{id:'comp2', type:'comp-display'}]))
        .to.deep.equal([{id:'comp2', displayAddress: displayAddress}]);

      expect(componentsFactory.getSetupData([
          {id:'comp1', type:'comp'},
          {id:'comp2', type:'comp-display'}]))
        .to.deep.equal([{id:'comp2', displayAddress: displayAddress}]);
    });

  });
});
