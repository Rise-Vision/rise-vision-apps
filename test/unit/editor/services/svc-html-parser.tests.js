'use strict';
describe('service: HtmlParser ', function() {
  beforeEach(module("risevision.editor.services"));
  var htmlParser;

  beforeEach(function(){
    inject(function($injector){
      htmlParser = $injector.get('htmlParser');
    });
  });

  it('should exist',function(){
    expect(htmlParser).to.be.truely;

    expect(String.prototype.startsWith).to.be.a('function');
    expect(String.prototype.endsWith).to.be.a('function');
    expect(String.prototype.equalsIgnoreCase).to.be.a('function');

    expect(htmlParser.getUnitString).to.be.a('function');
    expect(htmlParser.updateStyle).to.be.a('function');
    expect(htmlParser.removeStyle).to.be.a('function');
    expect(htmlParser.getNextQuote).to.be.a('function');
    expect(htmlParser.getPropertyValue).to.be.a('function');
    expect(htmlParser.stripGarbage).to.be.a('function');
    expect(htmlParser.getUnits).to.be.a('function');
    expect(htmlParser.getFloatValue).to.be.a('function');
    expect(htmlParser.getIntValue).to.be.a('function');
    expect(htmlParser.parseIntProperty).to.be.a('function');
    expect(htmlParser.getBooleanValue).to.be.a('function');
    expect(htmlParser.parseBooleanProperty).to.be.a('function');
    expect(htmlParser.stripOuterGarbage).to.be.a('function');
    expect(htmlParser.updateInnerString).to.be.a('function');
  });
  
  it('String.prototype.startsWith', function() {
    expect('asdf'.startsWith('a')).to.be.true;
    expect('asdf'.startsWith('b')).to.be.false;
    expect('asdf'.startsWith('as')).to.be.true;
    expect('asdf'.startsWith('ab')).to.be.false;
  });

  it('String.prototype.endsWith', function() {
    expect('asdf'.endsWith('f')).to.be.true;
    expect('asdf'.endsWith('d')).to.be.false;
    expect('asdf'.endsWith('df')).to.be.true;
    expect('asdf'.endsWith('fd')).to.be.false;
  });

  it('String.prototype.equalsIgnoreCase', function() {
    expect('asdf'.equalsIgnoreCase('asDf')).to.be.true;
    expect('asDf'.equalsIgnoreCase('d')).to.be.false;
    expect('asDf'.equalsIgnoreCase('Asdf')).to.be.true;
  });

  it('getUnitString', function() {
    expect(htmlParser.getUnitString(100, 'px')).to.equal('100px');
    expect(htmlParser.getUnitString(100, '%')).to.equal('100.00000%');
    expect(htmlParser.getUnitString(100.2344534, 'px')).to.equal('100px');
    expect(htmlParser.getUnitString(100.2344534, '%')).to.equal('100.23445%');
  });
  
  it('updateStyle', function() {
    expect(htmlParser.updateStyle('width', '100px', 'width:400px;height:200px;left:760px;top:440px;z-index:0;position:absolute;'))
      .to.equal('width:100px;height:200px;left:760px;top:440px;z-index:0;position:absolute;');
    expect(htmlParser.updateStyle('z-index', '4', 'width:400px;height:200px;left:760px;top:440px;z-index:0;position:absolute;'))
      .to.equal('width:400px;height:200px;left:760px;top:440px;z-index:4;position:absolute;');
    expect(htmlParser.updateStyle('width', '100px', 'height:200px;left:760px;top:440px;z-index:0;position:absolute;'))
      .to.equal('height:200px;left:760px;top:440px;z-index:0;position:absolute;width:100px;');

    expect(htmlParser.updateStyle('width', '100px', ''))
      .to.equal('width:100px;');
  });
  
  it('removeStyle', function() {
    expect(htmlParser.removeStyle('width', 'width:400px;height:200px;left:760px;top:440px;z-index:0;position:absolute;'))
      .to.equal('height:200px;left:760px;top:440px;z-index:0;position:absolute;');
    expect(htmlParser.removeStyle('z-index', 'width:400px;height:200px;left:760px;top:440px;z-index:0;position:absolute;'))
      .to.equal('width:400px;height:200px;left:760px;top:440px;position:absolute;');

    expect(htmlParser.removeStyle('z-index', ''))
      .to.equal('');
  });
  
  it('getNextQuote', function() {
    expect(htmlParser.getNextQuote('\'width:400px;height:200px;left:760px;top:440px;z-index:0;position:absolute;\''))
      .to.equal('\'');
    expect(htmlParser.getNextQuote('"width:400px;height:200px;left:760px;top:440px;z-index:0;position:absolute;"'))
      .to.equal('"');
    
    // find first quote
    expect(htmlParser.getNextQuote('\'width:400px;height:"200px";left:760px;top:440px;z-index:0;position:absolute;\''))
      .to.equal('\'');
    expect(htmlParser.getNextQuote('"width:400px;height:\'200px\';left:760px;top:440px;z-index:0;position:absolute;"'))
      .to.equal('"');

    // default to singlequote
    expect(htmlParser.getNextQuote('width:400px;height:200px;left:760px;top:440px;z-index:0;position:absolute;'))
      .to.equal('\'');
  });
  
  it('getPropertyValue', function() {
    expect(htmlParser.getPropertyValue('<div id="ph0" placeholder="true" style="width:400px;height:200px;left:760px;top:440px;z-index:0;position:absolute;">', 'style'))
      .to.equal('width:400px;height:200px;left:760px;top:440px;z-index:0;position:absolute;');
    expect(htmlParser.getPropertyValue('<div id="ph0" placeholder="true" style="width:400px;height:200px;left:760px;top:440px;z-index:0;position:absolute;">', 'id'))
      .to.equal('ph0');
      
    expect(htmlParser.getPropertyValue('<div id="ph0" style="width:400px;height:200px;left:760px;top:440px;z-index:0;position:absolute;>"', 'placeholder'))
      .to.equal('');
  });
  
  it('stripGarbage', function() {
    expect(htmlParser.stripGarbage(' "width:400px; height:200px; left:760px; top:440px; z-index:0; position:absolute; " '))
      .to.equal('width:400px;height:200px;left:760px;top:440px;z-index:0;position:absolute;');
    expect(htmlParser.stripGarbage(' \'width:400px; height:200px; left:760px; top:440px; z-index:0; position:absolute; \' '))
      .to.equal('width:400px;height:200px;left:760px;top:440px;z-index:0;position:absolute;');
  });
  
  it('getUnits', function() {
    expect(htmlParser.getUnits('400px')).to.equal('px');
    expect(htmlParser.getUnits('-400px')).to.equal('px');
    expect(htmlParser.getUnits('23.000%')).to.equal('%');
    expect(htmlParser.getUnits('" 23.000px"')).to.equal('px');
    expect(htmlParser.getUnits('" 23.000"')).to.equal('');
  });

  it('getFloatValue', function() {
    expect(htmlParser.getFloatValue(110)).to.equal(110);
    expect(htmlParser.getFloatValue('400px')).to.equal(400);
    expect(htmlParser.getFloatValue('-400px')).to.equal(-400);
    expect(htmlParser.getFloatValue('23.000%')).to.equal(23);
    expect(htmlParser.getFloatValue('-23.000%')).to.equal(-23);
    expect(htmlParser.getFloatValue('" 23.000px"')).to.equal(23);
    expect(htmlParser.getFloatValue('" 23.001"')).to.equal(23.001);
    expect(htmlParser.getFloatValue('"- 23.001"')).to.equal(-23.001);
    
    expect(htmlParser.getFloatValue('" absolute"')).to.equal(0);
    
    expect(htmlParser.getFloatValue('" 0"')).to.equal(0);
  });

  it('getIntValue', function() {
    expect(htmlParser.getIntValue(110)).to.equal(110);
    expect(htmlParser.getIntValue('400px')).to.equal(400);
    expect(htmlParser.getFloatValue('-400px')).to.equal(-400);
    expect(htmlParser.getIntValue('23.000%')).to.equal(23);
    expect(htmlParser.getFloatValue('-23.000%')).to.equal(-23);
    expect(htmlParser.getIntValue('" 23.000px"')).to.equal(23);
    expect(htmlParser.getIntValue('" 23.001"')).to.equal(23);
    expect(htmlParser.getIntValue('"- 23.001"')).to.equal(-23);
    
    expect(htmlParser.getIntValue('" absolute"')).to.equal(0);
    
    expect(htmlParser.getIntValue('" 0"')).to.equal(0);
  });
  
  describe('parseIntProperty: ', function() {
    it('should parse if defined', function() {
      var obj = {id:'ph1',duration:'10'};
      
      htmlParser.parseIntProperty(obj, 'duration');
      
      expect(obj).to.deep.equal({id:'ph1',duration:10});
    });

    it('should default to value if null', function() {
      var obj = {id:'ph1',duration:null};
      
      htmlParser.parseIntProperty(obj, 'duration', 10);
      
      expect(obj).to.deep.equal({id:'ph1',duration: 10});
    });
    
    it('should default to 0 if null', function() {
      var obj = {id:'ph1',duration:null};
      
      htmlParser.parseIntProperty(obj, 'duration');
      
      expect(obj).to.deep.equal({id:'ph1',duration: 0});
    });
    
    it('should not parse if un-defined', function() {
      var obj = {id:'ph1',duration:'10'};
      
      htmlParser.parseIntProperty(obj, 'someOtherProperty');
      
      expect(obj).to.deep.equal({id:'ph1',duration:'10'});
    });
    
  });
  
  it('getBooleanValue', function() {
    expect(htmlParser.getBooleanValue('true')).to.be.true;
    expect(htmlParser.getBooleanValue('false')).to.be.false;
    expect(htmlParser.getBooleanValue(true)).to.be.true;
    expect(htmlParser.getBooleanValue(false)).to.be.false;
    
    expect(htmlParser.getBooleanValue('absolute')).to.be.false;
    
  });
  
  describe('parseBooleanProperty: ', function() {
    it('should parse if defined', function() {
      var obj = {id:'ph1',timeDefined:'true'};
      
      htmlParser.parseBooleanProperty(obj, 'timeDefined');
      
      expect(obj).to.deep.equal({id:'ph1',timeDefined:true});
    });
    
    it('should not parse if un-defined', function() {
      var obj = {id:'ph1',timeDefined:'true'};
      
      htmlParser.parseBooleanProperty(obj, 'someOtherProperty');
      
      expect(obj).to.deep.equal({id:'ph1',timeDefined:'true'});
    });
    
  });

  it('stripOuterGarbage', function() {
    expect(htmlParser.stripOuterGarbage('"width:400px; height:200px; left:760px; top:440px; z-index:0; position:absolute; "'))
      .to.equal('width:400px; height:200px; left:760px; top:440px; z-index:0; position:absolute;');
    expect(htmlParser.stripOuterGarbage('\' width:400px;height:200px;left:760px;top:440px;z-index:0;position:absolute; \''))
      .to.equal('width:400px;height:200px;left:760px;top:440px;z-index:0;position:absolute;');
  });

  it('updateInnerString', function() {
    expect(htmlParser.updateInnerString('This is a test string', 5, 7, 'was'))
      .to.equal('This was a test string');  
  });

});
