'use strict';
describe('service: PresentationParser ', function() {
  beforeEach(module("risevision.editor.services"));
  var presentationParser;
  var presentationHtml = '\
  <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"> \
  <html> \
    <head> \
      <meta http-equiv="content-type" content="text/html; charset=UTF-8"> \
    </head> \
    \
    <body style="width:1920px;height:1080px; margin: 0; overflow: hidden;" > \
    <div  id="image_Logo" placeholder="true" style="width:842px;height:134px;left:34px;top:60px;z-index:0;position:absolute;"></div> \
    </body> \
    \
  <!-- Warning - Editing the Presentation Data Object incorrectly may result in the Presentation not functioning correctly --> \
    <script language="javascript"> \
    <!-- \
    var presentationData = {\
          "presentationData": {\
            "id": "c66fc03d-5047-4c74-9c51-0d135353957f",\
            "hidePointer": "true",\
            "donePlaceholder": "image_Logo",\
            "embeddedIds": ["123"],\
            "placeholders": [\
              {\
                "id": "image_Logo",\
                "type": "playlist",\
                "timeDefined": "false",\
                "visibility": "true", \
                "transition": "none", \
                "items": [ \
                  { \
                    "name": "Image Widget", \
                    "duration": "10", \
                    "type": "widget", \
                    "objectReference": "5233a598-35ce-41a4-805c-fd2147f144a3", \
                    "index": "0", \
                    "playUntilDone": "false", \
                    "objectData": "http://s3.amazonaws.com/widget-image/0.1.1/dist/widget.html" \
                  } \
                ] \
              } \
            ] \
          } \
        }; \
    //--> \
    </script> \
  <!-- No scripts after this point --> \
  </html>';
  
  var presentationHtmlPresentationItem = '\
  <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"> \
  <html> \
    <head> \
      <meta http-equiv="content-type" content="text/html; charset=UTF-8"> \
    </head> \
    \
    <body style="width:1920px;height:1080px; margin: 0; overflow: hidden;" > \
    <div  id="image_Logo" placeholder="true" style="width:842px;height:134px;left:34px;top:60px;z-index:0;position:absolute;"></div> \
    </body> \
    \
  <!-- Warning - Editing the Presentation Data Object incorrectly may result in the Presentation not functioning correctly --> \
    <script language="javascript"> \
    <!-- \
    var presentationData = {\
          "presentationData": {\
            "id": "c66fc03d-5047-4c74-9c51-0d135353957f",\
            "hidePointer": "true",\
            "donePlaceholder": "image_Logo",\
            "embeddedIds": ["123"],\
            "placeholders": [\
              {\
                "id": "image_Logo",\
                "type": "playlist",\
                "timeDefined": "false",\
                "visibility": "true", \
                "transition": "none", \
                "items": [ \
                  { \
                    "name": "Presentation Item", \
                    "duration": 10, \
                    "type": "presentation", \
                    "objectReference": null, \
                    "index": 0, \
                    "playUntilDone": false, \
                    "objectData": "d111298f-05d1-4cf5-a80b-ed087cf7fd78", \
                  } \
                ] \
              } \
            ] \
          } \
        }; \
    //--> \
    </script> \
  <!-- No scripts after this point --> \
  </html>';

  var presentationHtmlLegacyItems = '\
  <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"> \
  <html> \
    <head> \
      <meta http-equiv="content-type" content="text/html; charset=UTF-8"> \
    </head> \
    \
    <body style="width:1920px;height:1080px; margin: 0; overflow: hidden;" > \
    <div  id="image_Logo" placeholder="true" style="width:842px;height:134px;left:34px;top:60px;z-index:0;position:absolute;"></div> \
    </body> \
    \
  <!-- Warning - Editing the Presentation Data Object incorrectly may result in the Presentation not functioning correctly --> \
    <script language="javascript"> \
    <!-- \
    var presentationData = {\
          "presentationData": {\
            "id": "c66fc03d-5047-4c74-9c51-0d135353957f",\
            "hidePointer": "true",\
            "donePlaceholder": "image_Logo",\
            "embeddedIds": ["123"],\
            "placeholders": [\
              {\
                "id": "image_Logo",\
                "type": "playlist",\
                "timeDefined": "false",\
                "visibility": "true", \
                "transition": "none", \
                "items": [ \
                  { \
                    "name": "Image Widget", \
                    "duration": "10", \
                    "type": "gadget", \
                    "objectReference": "5233a598-35ce-41a4-805c-fd2147f144a3", \
                    "index": "0", \
                    "playUntilDone": "false", \
                    "objectData": "http://s3.amazonaws.com/widget-image/0.1.1/dist/widget.html" \
                  } \
                ] \
              } \
            ] \
          } \
        }; \
    //--> \
    </script> \
  <!-- No scripts after this point --> \
  </html>';
  
  var placeholdersString = '\
  <body style="width:1920px;height:1080px; margin: 0; overflow: hidden;" >\
  <div  id="LocalTime" placeholder="true" style="width:1920px;height:1080px;left:0px;top:0px;z-index:0;position:absolute;background:url(\'image.png\') no-repeat left top;"></div>\
  <div  id="content_Welcome_Text" placeholder="true" style="width:1464px;height:260px;left:477px;top:410px;z-index:1;position:absolute;"></div>\
  <div  id="LAAnalog" placeholder="true" style="width:300px;height:245px;left:90px;top:0px;z-index:2;position:absolute;background:;background-size:contain;"></div>\
  <div  id="LADigital" placeholder="true" style="width:300px;height:36px;left:90px;top:257px;z-index:3;position:absolute;"></div>\
  </body>';
  

  beforeEach(function(){
    inject(function($injector){
      presentationParser = $injector.get('presentationParser');
    });
  });

  it('should exist',function(){
    expect(presentationParser).to.be.truely;

    expect(String.prototype.startsWith).to.be.a('function');
    expect(String.prototype.endsWith).to.be.a('function');
    expect(String.prototype.equalsIgnoreCase).to.be.a('function');

    expect(presentationParser.parseHelpLink).to.be.a('function');
    expect(presentationParser.parseBodyStyle).to.be.a('function');
    expect(presentationParser.parsePresentationData).to.be.a('function');
    expect(presentationParser.parseStyle).to.be.a('function');
    expect(presentationParser.parseDiv).to.be.a('function');
    expect(presentationParser.parsePlaceholders).to.be.a('function');
    expect(presentationParser.parsePresentation).to.be.a('function');
    
    expect(presentationParser.setPlaceholderId).to.be.a('function');
    expect(presentationParser.findPlaceholder).to.be.a('function');
    expect(presentationParser.updateDiv).to.be.a('function');
    expect(presentationParser.updatePlaceholders).to.be.a('function');
    expect(presentationParser.updatePresentationObject).to.be.a('function');
    expect(presentationParser.updatePresentationData).to.be.a('function');
    expect(presentationParser.updatePresentation).to.be.a('function');
    
    expect(presentationParser.updateBodyTag).to.be.a('function');
    expect(presentationParser.updatePresentationHeader).to.be.a('function');
  });

  it('parseHelpLink', function() {
    var helpLinkHtml = '\
      <link rel="help" href="http://www.risevision.com/help/presentations/about-us-presentation/"> \
      <link href="style.css" rel="stylesheet" type="text/css"> \
      <meta http-equiv="content-type" content="text/html; charset=UTF-8"> \
      <title></title> \
      <style> \
        .title \
        { \
          font-size:24px; \
          line-height:33px; \
          font-family:Lucida Grande; \
        } \
      </style>';
      
    var styleLinkHtml = '\
      <link href="style.css" rel="stylesheet" type="text/css"> \
      <meta http-equiv="content-type" content="text/html; charset=UTF-8"> \
      <title></title> \
      <style> \
        .title \
        { \
          font-size:24px; \
          line-height:33px; \
          font-family:Lucida Grande; \
        } \
      </style>';
      
    expect(presentationParser.parseHelpLink(helpLinkHtml))
      .to.equal('http://www.risevision.com/help/presentations/about-us-presentation/');

    expect(presentationParser.parseHelpLink(styleLinkHtml))
      .to.equal('');
    
  });
  
  describe('parseBodyStyle: ', function() {
    it('should parse correctly', function() {
       var styleToken = 'width:1920px;height:1080px; margin: 0; overflow: hidden;background:url(\'http://host.com/images/bg.jpg\') no-repeat left top;background-size:contain;';
       
       var presentationObj = {};
       presentationParser.parseBodyStyle(presentationObj, styleToken);
       expect(presentationObj).to.be.ok;
       expect(presentationObj).to.deep.equal({width:1920,height:1080,widthUnits:'px',heightUnits:'px',backgroundStyle:'url(\'http://host.com/images/bg.jpg\') no-repeat left top',backgroundScaleToFit:true});
    });
    
    it('should skip parameter if missing', function() {
       var styleToken = 'width:1920px; margin: 0; overflow: hidden;background:url(\'http://host.com/images/bg.jpg\') no-repeat left top;background-size:contain;';
       
       var presentationObj = {};
       presentationParser.parseBodyStyle(presentationObj, styleToken);
       expect(presentationObj).to.be.ok;
       expect(presentationObj).to.deep.equal({width:1920,widthUnits:'px',backgroundStyle:'url(\'http://host.com/images/bg.jpg\') no-repeat left top',backgroundScaleToFit:true});
    });
    
    it('should interpret background-size correctly', function() {
       var styleToken = 'width:1920px; margin: 0; overflow: hidden;background:url(\'http://host.com/images/bg.jpg\') no-repeat left top;background-size:initial;';
       
       var presentationObj = {};
       presentationParser.parseBodyStyle(presentationObj, styleToken);
       expect(presentationObj).to.be.ok;
       expect(presentationObj).to.deep.equal({width:1920,widthUnits:'px',backgroundStyle:'url(\'http://host.com/images/bg.jpg\') no-repeat left top',backgroundScaleToFit:false});
    });
  });

  it('parsePresentationData & cleanPlaceholderData', function() {
    var presentationObj = {
      layout: presentationHtml
    };

    presentationParser.parsePresentationData(presentationObj);
    
    expect(presentationObj).to.be.ok;
    expect(presentationObj.donePlaceholder).to.equal('image_Logo');
    expect(presentationObj.hidePointer).to.be.true;
    expect(presentationObj.placeholders).to.be.a('array');
    expect(presentationObj.placeholders[0].id).to.equal('image_Logo');
    expect(presentationObj.placeholders[0].visibility).to.be.true;
  });

  it('fails to parse invalid JSON parsePresentationData', function() {
    var presentationObj = {
      layout: presentationHtml.replace('"presentationData": {', '"presentationData": {\'')
    };

    var result = presentationParser.parsePresentationData(presentationObj);

    expect(result).to.be.false;
  });

  describe('Flag legacy items', function() {
    it('should not flag widgets as legacy items', function() {
      var presentationObj = {
        layout: presentationHtml
      };

      presentationParser.parsePresentationData(presentationObj);
      
      expect(presentationParser.hasLegacyItems).to.not.be.true;
      expect(presentationObj).to.be.ok;
    });
    
    it('should not flag presentations as legacy items', function() {
      var presentationObj = {
        layout: presentationHtmlPresentationItem
      };

      presentationParser.parsePresentationData(presentationObj);
      
      expect(presentationParser.hasLegacyItems).to.not.be.true;
      expect(presentationObj).to.be.ok;
    });

    it('should flag legacy items', function() {
      var presentationObj = {
        layout: presentationHtmlLegacyItems
      };

      presentationParser.parsePresentationData(presentationObj);
      
      expect(presentationParser.hasLegacyItems).to.be.true;
      expect(presentationObj).to.be.ok;
    });    
  });
  
  describe('parseStyle: ', function() {
    it('should parse correctly', function() {
       var styleToken = 'width:842px;height:134px;left:34px;top:60px;z-index:0;position:absolute;background:url(\'http://host.com/images/bg.jpg\') no-repeat left top;background-size:contain;';
       
       var placeholder = {};
       presentationParser.parseStyle(placeholder, styleToken);
       expect(placeholder).to.be.ok;
       expect(placeholder).to.deep.equal({width:842,height:134,widthUnits:'px',heightUnits:'px',left:34,top:60,leftUnits:'px',topUnits:'px',zIndex:0,backgroundStyle:'url(\'http://host.com/images/bg.jpg\') no-repeat left top',backgroundScaleToFit:true});
    });
    
    it('should skip parameter if missing', function() {
       var styleToken = 'width:1920px; margin: 0; overflow: hidden;background:url(\'http://host.com/images/bg.jpg\') no-repeat left top;background-size:contain;';
       
       var placeholder = {};
       presentationParser.parseStyle(placeholder, styleToken);
       expect(placeholder).to.be.ok;
       expect(placeholder).to.deep.equal({width:1920,widthUnits:'px',backgroundStyle:'url(\'http://host.com/images/bg.jpg\') no-repeat left top',backgroundScaleToFit:true});
    });
    
    it('should interpret background-size correctly', function() {
       var styleToken = 'width:1920px; margin: 0; overflow: hidden;background:url(\'http://host.com/images/bg.jpg\') no-repeat left top;background-size:initial;';
       
       var placeholder = {};
       presentationParser.parseStyle(placeholder, styleToken);
       expect(placeholder).to.be.ok;
       expect(placeholder).to.deep.equal({width:1920,widthUnits:'px',backgroundStyle:'url(\'http://host.com/images/bg.jpg\') no-repeat left top',backgroundScaleToFit:false});
    });

    it('should handle whitespaces',function(){
      var styleToken = 'width: 842px;    height: 134px ;left:34px ;top:60px ;z-index:0;position:absolute;background:url(\'http://host.com/images/bg.jpg\') no-repeat left top;background-size:contain;';
       
       var placeholder = {};
       presentationParser.parseStyle(placeholder, styleToken);
       expect(placeholder).to.be.ok;
       expect(placeholder.width).to.equal(842);
       expect(placeholder.height).to.equal(134);
       expect(placeholder).to.deep.equal({width:842,height:134,widthUnits:'px',heightUnits:'px',left:34,top:60,leftUnits:'px',topUnits:'px',zIndex:0,backgroundStyle:'url(\'http://host.com/images/bg.jpg\') no-repeat left top',backgroundScaleToFit:true});
    });
  });
  
  describe('parseDiv: ', function() {
    it('should parse placeholder div correctly', function() {
      var placeholderDiv = '<div  id="image_Logo" placeholder="true" style="width:842px;height:134px;left:34px;top:60px;z-index:0;position:absolute;">';
      
      var placeholder = presentationParser.parseDiv(placeholderDiv);
      expect(placeholder).to.be.ok;
      expect(placeholder).to.deep.equal({id:'image_Logo',width:842,height:134,widthUnits:'px',heightUnits:'px',left:34,top:60,leftUnits:'px',topUnits:'px',zIndex:0});

    });

    it('should not parse other divs', function() {
      var plainDiv = '<div  id="image_Logo" style="width:842px;height:134px;left:34px;top:60px;z-index:0;position:absolute;"></div>';
      
      var placeholder = presentationParser.parseDiv(plainDiv);
      expect(placeholder).to.not.be.ok;
    });
  });
  
  describe('parsePlaceholders: ', function() {
    it('should parse placeholders correctly', function() {
      var presentation = {};
      
      presentationParser.parsePlaceholders(presentation, placeholdersString);
      expect(presentation).to.be.ok;
      expect(presentation.placeholders).to.be.a('array');
      expect(presentation.placeholders).to.have.length(4);
      expect(presentation.placeholders[1]).to.deep.equal({id:'content_Welcome_Text',width:1464,height:260,widthUnits:'px',heightUnits:'px',left:477,top:410,leftUnits:'px',topUnits:'px',zIndex:1});
    });
    
    it('should remove deleted placeholders', function() {
      var presentation = {
        placeholders: [
          {
            id: 'not_here'
          }
        ]
      };
      
      presentationParser.parsePlaceholders(presentation, placeholdersString);
      expect(presentation).to.be.ok;
      expect(presentation.placeholders).to.be.a('array');
      expect(presentation.placeholders).to.have.length(4);
    });
    
    it('should update existing placeholder', function() {
      var presentation = {
        placeholders: [
          {
            id: 'content_Welcome_Text',
            width: 150,
            height: 200,
            widthUnits: 'em',
            heightUnits: 'em'
          }
        ]
      };
      
      presentationParser.parsePlaceholders(presentation, placeholdersString);
      expect(presentation).to.be.ok;
      expect(presentation.placeholders).to.be.a('array');
      expect(presentation.placeholders).to.have.length(4);
      expect(presentation.placeholders[0]).to.deep.equal({id:'content_Welcome_Text',width:1464,height:260,widthUnits:'px',heightUnits:'px',left:477,top:410,leftUnits:'px',topUnits:'px',zIndex:1,backgroundStyle:undefined,backgroundScaleToFit:undefined});
    });
  });
  
  it('parsePresentation', function() {
    var presentation = {
      layout: presentationHtml
    };
    
    presentationParser.parsePresentation(presentation);
    
    expect(presentation).to.be.ok;
    delete presentation.layout;
    expect(presentation).to.deep.equal({"helpURL":"","width":1920,"widthUnits":"px","height":1080,"heightUnits":"px","hidePointer":true,"donePlaceholder":"image_Logo",
      "placeholders":[
        {"id":"image_Logo","type":"playlist","timeDefined":false,"visibility":true,"transition":"none","width":842,"widthUnits":"px","height":134,"heightUnits":"px","left":34,"leftUnits":"px","top":60,"topUnits":"px","zIndex":0,backgroundStyle:undefined,backgroundScaleToFit:undefined,
          "items":[{"name":"Image Widget","duration":10,"type":"widget","objectReference":"5233a598-35ce-41a4-805c-fd2147f144a3","index":0,"playUntilDone":false,"objectData":"http://s3.amazonaws.com/widget-image/0.1.1/dist/widget.html"}]
        }
      ]
    });
  });
  
  it('setPlaceholderId', function() {
    var placeholder = {};
    var placeholders = [
      {
        id: 'ph0'
      },
      {
        id: 'new_ph'
      },
      {
        id: 'ph1'
      },
      {
        id: 'ph3'
      }
    ];
    
    presentationParser.setPlaceholderId(placeholder, placeholders);
    
    expect(placeholder.id).to.equal('ph2');
  });
  
  it('findPlaceholder', function() {
    expect(presentationParser.findPlaceholder(placeholdersString, 'content_Welcome_Text')).to.not.equal(-1);
    
    expect(presentationParser.findPlaceholder(placeholdersString, 'ph0')).to.equal(-1);
  });
  
  describe('updateDiv: ', function() {
    it('should keep properties', function() {
      var placeholderDiv = ' id="image_Logo" placeholder="true" style="width:842px;height:134px;left:34px;top:60px;z-index:0;position:absolute;"';
      var placeholder = {
        id: 'image_Logo',
        width: 842,
        height: 134,
        widthUnits: 'px',
        heightUnits: 'px',
        left: 34,
        top: 60,
        leftUnits: 'px',
        topUnits: 'px',
        zIndex: 0
      };

      var newPlaceholderDiv = presentationParser.updateDiv(placeholder, placeholderDiv);
      
      expect(newPlaceholderDiv).to.equal(placeholderDiv);
    });
    
    it('should update properties', function() {
      var placeholderDiv = ' id="image_Logo" placeholder="true" style="width:842px;height:134px;left:34px;top:60px;z-index:0;position:absolute;"';
      var placeholder = {
        id: 'image_Logo',
        width: 600,
        height: 400,
        widthUnits: 'px',
        heightUnits: 'px',
        left: 50,
        top: 50,
        leftUnits: 'px',
        topUnits: 'px',
        zIndex: 2
      };

      var newPlaceholderDiv = presentationParser.updateDiv(placeholder, placeholderDiv);
      
      expect(newPlaceholderDiv).to.equal(' id="image_Logo" placeholder="true" style="width:600px;height:400px;left:50px;top:50px;z-index:2;position:absolute;"');
    });
    
    it('should create new div', function() {
      var placeholderDiv = '';
      var placeholder = {
        id: 'image_Logo',
        width: 600,
        height: 400,
        widthUnits: 'px',
        heightUnits: 'px',
        left: 50,
        top: 50,
        leftUnits: 'px',
        topUnits: 'px',
        zIndex: 2
      };

      var newPlaceholderDiv = presentationParser.updateDiv(placeholder, placeholderDiv);
      
      expect(newPlaceholderDiv).to.equal(' id="image_Logo" placeholder="true" style="width:600px;height:400px;left:50px;top:50px;z-index:2;position:absolute;"');
    });
    
    it('should remove background properties', function() {
      var placeholderDiv = ' id="image_Logo" placeholder="true" style="width:842px;height:134px;left:34px;top:60px;z-index:0;position:absolute;background:url(\'/images/bg.jpg\') no-repeat left top;background-size:contain;"';
      var placeholder = {
        id: 'image_Logo',
        width: 600,
        height: 400,
        widthUnits: 'px',
        heightUnits: 'px',
        left: 50,
        top: 50,
        leftUnits: 'px',
        topUnits: 'px',
        zIndex: 2
      };

      var newPlaceholderDiv = presentationParser.updateDiv(placeholder, placeholderDiv);
      
      expect(newPlaceholderDiv).to.equal(' id="image_Logo" placeholder="true" style="width:600px;height:400px;left:50px;top:50px;z-index:2;position:absolute;"');
    });

    it('should handle missing properties',function(){
      var placeholderDiv = ' id="image_Logo" placeholder="true" style="position:absolute;"';
      var placeholder = {
        id: 'image_Logo',
      };

      var newPlaceholderDiv = presentationParser.updateDiv(placeholder, placeholderDiv);
      
      expect(newPlaceholderDiv).to.equal(' id="image_Logo" placeholder="true" style="position:absolute;width:0px;height:0px;left:0px;top:0px;z-index:0;"');
    });
  });
  
  it('updatePlaceholders', function() {
    var presentation = {};
    var updatedPresentation = {};
    var updatedPlaceholdersString = '\
    <body style="width:1920px;height:1080px; margin: 0; overflow: hidden;" >\
    <div  id="LocalTime" placeholder="true" style="width:1920px;height:1080px;left:0px;top:0px;z-index:0;position:absolute;background:url(\'image.png\') no-repeat left top;"></div>\
    <div  id="content_Welcome_Text" placeholder="true" style="width:1464px;height:260px;left:477px;top:410px;z-index:1;position:absolute;"></div>\
    <div  id="LAAnalog" placeholder="true" style="width:400px;height:400px;left:100px;top:10px;z-index:2;position:absolute;background:;background-size:contain;"></div>\
    <div  id="LADigital" placeholder="true" style="width:300px;height:36px;left:90px;top:257px;z-index:3;position:absolute;"></div>\
    </body>';
    
    var updatedPlaceholdersString2 = '\
<body style="width:1920px;height:1080px; margin: 0; overflow: hidden;" >\
  <div  id="LocalTime" placeholder="true" style="width:1920px;height:1080px;left:0px;top:0px;z-index:0;position:absolute;background:url(\'image.png\') no-repeat left top;"></div>\
  <div  id="content_Welcome_Text" placeholder="true" style="width:1464px;height:260px;left:477px;top:410px;z-index:1;position:absolute;"></div>\
  <div  id="LAAnalog" placeholder="true" style="width:400px;height:400px;left:100px;top:10px;z-index:2;position:absolute;"></div>\
</body>';
    
    presentationParser.parsePlaceholders(presentation, placeholdersString);
    presentationParser.parsePlaceholders(updatedPresentation, updatedPlaceholdersString);

    var updatedPlaceholders = updatedPresentation.placeholders;
    updatedPlaceholders[3].deleted = true;
    
    expect(presentationParser.updatePlaceholders(updatedPlaceholders, placeholdersString))
      .to.equal(updatedPlaceholdersString2);
    
  });

  it('should not add extra space after div on updatePlaceholders', function() {
    var placeholdersString = '\
<body>\
</body>';
    var updatedPlaceholdersString = '\
<body>\
<div id="testId" placeholder="true" style="width:0px;height:0px;left:0px;top:0px;z-index:0;position:absolute;"></div>\n\t\
</body>';
    var placeholders = [{
      id: 'testId'
    }];

    expect(presentationParser.updatePlaceholders(placeholders, placeholdersString)).to.equal(updatedPlaceholdersString);
  });
  
  it('updatePresentationObject', function() {
    var updatedHtml = '\
  <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"> \
  <html> \
    <head> \
      <meta http-equiv="content-type" content="text/html; charset=UTF-8"> \
    </head> \
    \
    <body style="width:1920px;height:1080px; margin: 0; overflow: hidden;" > \
    <div  id="image_Logo" placeholder="true" style="width:842px;height:134px;left:34px;top:60px;z-index:0;position:absolute;"></div> \
    </body> \
    \
  <!-- Warning - Editing the Presentation Data Object incorrectly may result in the Presentation not functioning correctly --> \
    <script language="javascript">\n\t<!--\n\tvar presentationData = {\n\t"someData": "data"\n};\n\t//-->\n\t</script> \
  <!-- No scripts after this point --> \
  </html>';
    
    var dataString = '<script language="javascript">\n\t<!--\n\tvar presentationData = {\n\t"someData": "data"\n};\n\t//-->\n\t</script>';
    var updatedLayout = presentationParser.updatePresentationObject(presentationHtml, dataString);
    
    expect(updatedLayout).to.equal(updatedHtml);
    
  });
  
  describe('updatePresentationData: ', function() {
    // fake object update
    beforeEach(function() {
      presentationParser.updatePresentationObject = function(html, dataString) {
        return dataString;
      };
    });
    
    it('should remove layout & stringify object', function() {
      var presentation = {
        layout: presentationHtml
      };
      presentationParser.parsePresentation(presentation);
      
      // random properties should be removed from placeholders and
      // placeholder items
      presentation.placeholders[0].randomProperty = "test";
      presentation.placeholders[0].items[0].randomProperty = "test";
      
      expect(presentationParser.updatePresentationData(presentation, presentation.layout))
        .to.equal('<script language="javascript">\n\t<!--\n\tvar presentationData = {\n\t"presentationData": {\n\t\t"hidePointer": true,\n\t\t"donePlaceholder": "image_Logo",\n\t\t"placeholders": [\n\t\t\t{\n\t\t\t\t"id": "image_Logo",\n\t\t\t\t"type": "playlist",\n\t\t\t\t"timeDefined": false,\n\t\t\t\t"visibility": true,\n\t\t\t\t"transition": "none",\n\t\t\t\t"items": [\n\t\t\t\t\t{\n\t\t\t\t\t\t"name": "Image Widget",\n\t\t\t\t\t\t"duration": 10,\n\t\t\t\t\t\t"type": "widget",\n\t\t\t\t\t\t"objectReference": "5233a598-35ce-41a4-805c-fd2147f144a3",\n\t\t\t\t\t\t"index": 0,\n\t\t\t\t\t\t"playUntilDone": false,\n\t\t\t\t\t\t"objectData": "http://s3.amazonaws.com/widget-image/0.1.1/dist/widget.html"\n\t\t\t\t\t}\n\t\t\t\t]\n\t\t\t}\n\t\t]\n\t}\n};\n\t//-->\n\t</script>');
    });  

    it('should stringify object and handle days of the week', function() {
      var presentation = {
        layout: presentationHtml
      };
      presentationParser.parsePresentation(presentation);
      
      presentation.placeholders[0].recurrenceDaysOfWeek = ['Wed', 'Fri'];
      
      expect(presentationParser.updatePresentationData(presentation, presentation.layout))
        .to.equal('<script language="javascript">\n\t<!--\n\tvar presentationData = {\n\t"presentationData": {\n\t\t"hidePointer": true,\n\t\t"donePlaceholder": "image_Logo",\n\t\t"placeholders": [\n\t\t\t{\n\t\t\t\t"id": "image_Logo",\n\t\t\t\t"type": "playlist",\n\t\t\t\t"timeDefined": false,\n\t\t\t\t"recurrenceDaysOfWeek": [\n\t\t\t\t\t"Wed",\n\t\t\t\t\t"Fri"\n\t\t\t\t],\n\t\t\t\t"visibility": true,\n\t\t\t\t"transition": "none",\n\t\t\t\t"items": [\n\t\t\t\t\t{\n\t\t\t\t\t\t"name": "Image Widget",\n\t\t\t\t\t\t"duration": 10,\n\t\t\t\t\t\t"type": "widget",\n\t\t\t\t\t\t"objectReference": "5233a598-35ce-41a4-805c-fd2147f144a3",\n\t\t\t\t\t\t"index": 0,\n\t\t\t\t\t\t"playUntilDone": false,\n\t\t\t\t\t\t"objectData": "http://s3.amazonaws.com/widget-image/0.1.1/dist/widget.html"\n\t\t\t\t\t}\n\t\t\t\t]\n\t\t\t}\n\t\t]\n\t}\n};\n\t//-->\n\t</script>');
    });

    it('should replace &quot; from presentationData', function() {
      var presentation = {
        layout: presentationHtml
      };
      presentationParser.parsePresentation(presentation);
      
      presentation.placeholders[0].items[0].additionalParams = "&quot;a&quot;";
      
      expect(presentationParser.updatePresentationData(presentation, presentation.layout))
        .to.equal('<script language="javascript">\n\t<!--\n\tvar presentationData = {\n\t"presentationData": {\n\t\t"hidePointer": true,\n\t\t"donePlaceholder": "image_Logo",\n\t\t"placeholders": [\n\t\t\t{\n\t\t\t\t"id": "image_Logo",\n\t\t\t\t"type": "playlist",\n\t\t\t\t"timeDefined": false,\n\t\t\t\t"visibility": true,\n\t\t\t\t"transition": "none",\n\t\t\t\t"items": [\n\t\t\t\t\t{\n\t\t\t\t\t\t"name": "Image Widget",\n\t\t\t\t\t\t"duration": 10,\n\t\t\t\t\t\t"type": "widget",\n\t\t\t\t\t\t"objectReference": "5233a598-35ce-41a4-805c-fd2147f144a3",\n\t\t\t\t\t\t"index": 0,\n\t\t\t\t\t\t"playUntilDone": false,\n\t\t\t\t\t\t"objectData": "http://s3.amazonaws.com/widget-image/0.1.1/dist/widget.html",\n\t\t\t\t\t\t"additionalParams": "\\\\\\"a\\\\\\""\n\t\t\t\t\t}\n\t\t\t\t]\n\t\t\t}\n\t\t]\n\t}\n};\n\t//-->\n\t</script>');
    });  
  });
  
  xdescribe('updatePresentation: ', function() {
    // TODO: Fix removal of extra variables form Presentation JSON object.
  });
  
  describe('updateBodyTag: ', function() {
    it('should update body style', function() {
      var presentation = {
        width:1920,
        height:1080,
        widthUnits:'px',
        heightUnits:'px',
        backgroundStyle:'url(\'/images/bg.jpg\') no-repeat left top',
        backgroundScaleToFit:true
      };
      
      expect(presentationParser.updateBodyTag(presentation, ''))
        .to.equal(' style="width:1920px;height:1080px;background:url(\'/images/bg.jpg\') no-repeat left top;background-size:contain;"');
        
      expect(presentationParser.updateBodyTag(presentation, ' style="width:900px;height:60px; margin: 0; overflow: hidden;"'))
        .to.equal(' style="width:1920px;height:1080px; margin: 0; overflow: hidden;background:url(\'/images/bg.jpg\') no-repeat left top;background-size:contain;"');
    });
    
    it('should remove background style', function() {
      var presentation = {
        width:1920,
        height:1080,
        widthUnits:'px',
        heightUnits:'px',
        backgroundScaleToFit:true
      };
      
      expect(presentationParser.updateBodyTag(presentation, ''))
        .to.equal(' style="width:1920px;height:1080px;"');
        
      expect(presentationParser.updateBodyTag(presentation, ' style="width:1920px;height:1080px; margin: 0; overflow: hidden;background:url(\'/images/bg.jpg\') no-repeat left top;background-size:contain;"'))
        .to.equal(' style="width:1920px;height:1080px; margin: 0; overflow: hidden;"');
      
    })
  });
  
  it('updatePresentationHeader', function() {
    var presentation = {
      layout: presentationHtml,
      width:1920,
      height:1080,
      widthUnits:'px',
      heightUnits:'px',
      backgroundStyle:'url(\'/images/bg.jpg\') no-repeat left top',
      backgroundScaleToFit:true
    };
    
    presentationParser.updatePresentationHeader(presentation);
    
    expect(presentation.layout.indexOf('style="width:1920px;height:1080px; margin: 0; overflow: hidden;background:url(\'/images/bg.jpg\') no-repeat left top;background-size:contain;"'))
      .to.not.equal(-1);
  });
  
});
