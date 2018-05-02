'use strict';
  
describe('service: distributionParser:', function() {
  beforeEach(module('risevision.editor.services'));
  beforeEach(module(function ($provide) {
    placeholder = {
      id: 'ph1'
    };
    placeholder0 = {
      id: 'ph0'
    };
    placeholder2 = {
      id: 'ph2',
      items: [
        {
          name: 'item1'
        }
      ]
    };
    
    placeholders = [placeholder0, placeholder, placeholder2];
  }));
  var presentation, placeholders, placeholder, placeholder0, placeholder2, distributionParser;
  beforeEach(function(){
    inject(function($injector){  
      distributionParser = $injector.get('distributionParser');
    });
  });

  it('should exist',function(){
    expect(distributionParser).to.be.truely;
    
    expect(distributionParser.parseDistribution).to.be.a('function');
    expect(distributionParser.updateDistribution).to.be.a('function');    
  });

  describe('parseDistribution: ', function() {
    beforeEach(function() {
      presentation = {
        placeholders: angular.copy(placeholders)
      };
    });
    
    it('should parse undefined distribution', function() {
      distributionParser.parseDistribution(presentation);
      
      expect(presentation.placeholders).to.deep.equal(placeholders);
    });
    
    it('should parse empty distribution', function() {
      presentation.distribution = [];
      distributionParser.parseDistribution(presentation);
      
      expect(presentation.placeholders).to.deep.equal(placeholders);
    });
    
    it('should parse distribute to all false', function() {
      presentation.distribution = [{itemId:'ph1'}];
      distributionParser.parseDistribution(presentation);
      
      expect(presentation.placeholders[1]).to.deep.equal({id:'ph1',distribution:undefined,distributeToAll:false});
    });

    it('should parse distribution', function() {
      presentation.distribution = [{itemId:'ph1',displayIds:['display1', 'display2']}];
      distributionParser.parseDistribution(presentation);
      
      expect(presentation.placeholders[1]).to.deep.equal({id:'ph1',distribution:['display1','display2'],distributeToAll:false});
    });
    
    it('should parse playlist item distribution', function() {
      presentation.distribution = [{itemId:'ph2#0',displayIds:['display1', 'display2']}];
      distributionParser.parseDistribution(presentation);
      
      expect(presentation.placeholders[2]).to.deep.equal({id:'ph2',items:[{name:'item1',distribution:['display1','display2'],distributeToAll:false}]});
    });

  });
  
  describe('updateDistribution: ', function() {
    beforeEach(function() {
      presentation = {
        placeholders: placeholders
      };
    });
    
    it('should update empty distribution', function() {
      distributionParser.updateDistribution(presentation);
      
      expect(presentation.distribution).to.deep.equal([]);
    });
    
    it('should update all displays distribution', function() {
      placeholder.distributeToAll = true;
      distributionParser.updateDistribution(presentation);
      
      expect(presentation.distribution).to.deep.equal([]);
    });
    
    it('should update distribute to all false', function() {
      placeholder.distributeToAll = false;
      distributionParser.updateDistribution(presentation);
      
      expect(presentation.distribution).to.deep.equal([{itemId:'ph1',displayIds: []}]);
    });

    it('should update distribution', function() {
      placeholder.distributeToAll = false;
      placeholder.distribution = ['display1', 'display2'];
      distributionParser.updateDistribution(presentation);
      
      expect(presentation.distribution).to.deep.equal([{itemId:'ph1',displayIds:['display1', 'display2']}]);
    });

    it('should update playlist item distribution to all false', function() {
      placeholder2.items[0].distributeToAll = false;
      distributionParser.updateDistribution(presentation);
      
      expect(presentation.distribution).to.deep.equal([{itemId:'ph2#0',displayIds:[]}]);
    });
    
    it('should update playlist item distribution', function() {
      placeholder2.items[0].distributeToAll = false;
      placeholder2.items[0].distribution = ['display1', 'display2'];
      distributionParser.updateDistribution(presentation);
      
      expect(presentation.distribution).to.deep.equal([{itemId:'ph2#0',displayIds:['display1', 'display2']}]);
    });

  });
  
});
