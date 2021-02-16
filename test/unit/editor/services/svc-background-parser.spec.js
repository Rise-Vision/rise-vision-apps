'use strict';
  
describe('service: backgroundParser:', function() {
  beforeEach(module('risevision.editor.services'));
  var backgroundParser;

  beforeEach(function(){
    inject(function($injector){
      backgroundParser = $injector.get('backgroundParser');
    });
  });

  it('should exist',function(){
    expect(backgroundParser).to.be.truely;
    
    expect(backgroundParser.parseBackground).to.be.a('function');

    expect(backgroundParser.getStyle).to.be.a('function');
    expect(backgroundParser.getScaleToFit).to.be.a('function');
  });
  
  describe('parseBackground: ', function() {
    it('should return undefined for empty background properties', function() {
      expect(backgroundParser.parseBackground()).to.deep.equal(undefined);
    });

    it('should parse color background', function() {
      expect(backgroundParser.parseBackground('rgba(255,255,255,0)')).to.deep.equal({'color':'rgba(255,255,255,0)'});
    });

    it('should parse hex color background', function() {
      expect(backgroundParser.parseBackground('#FAB')).to.deep.equal({'color':'#FAB'});
      expect(backgroundParser.parseBackground('#fab')).to.deep.equal({'color':'#fab'});
      expect(backgroundParser.parseBackground('#FFAABB')).to.deep.equal({'color':'#FFAABB'});
      expect(backgroundParser.parseBackground('#ffaabb')).to.deep.equal({'color':'#ffaabb'});
      expect(backgroundParser.parseBackground('#FFAABBFF')).to.deep.equal({'color':'#FFAABBFF'});
      expect(backgroundParser.parseBackground('#ffaabbff')).to.deep.equal({'color':'#ffaabbff'});
    });

    it('should parse background with image background and scale to fit true', function() {
      var background = {'useImage':true,'image':{'url':'/images/bg.jpg', repeat: 'no-repeat','position':'top-left','scale':true}};

      expect(backgroundParser.parseBackground('url(\'/images/bg.jpg\') no-repeat left top', true)).to.deep.equal(background);
    });

    it('should parse background with image background and scale to fit true without repeat', function() {
      var background = {'useImage':true,'image':{'url':'/images/bg.jpg', repeat: 'no-repeat', 'position':'top-left','scale':true}};

      expect(backgroundParser.parseBackground('url(\'/images/bg.jpg\') no-repeat left top', true)).to.deep.equal(background);
    });
    
    it('should parse background with image and color', function() {
      var backgroundString = 'rgb(170, 170, 170) url(\'https://storage.googleapis.com/risemedialibrary-b428b4e8-c8b9-41d5-8a10-b4193c789443/image-1.png\') no-repeat center center';
      var background = {"color":"rgb(170, 170, 170)","useImage":true,"image":{"url":"https://storage.googleapis.com/risemedialibrary-b428b4e8-c8b9-41d5-8a10-b4193c789443/image-1.png","position":"middle-center","scale":true,repeat: 'no-repeat'}};
      
      expect(backgroundParser.parseBackground(backgroundString, true)).to.deep.equal(background);
    });

    it('should parse background with image and hex color', function() {
      var backgroundString = '#FFAABB url(\'https://storage.googleapis.com/risemedialibrary-b428b4e8-c8b9-41d5-8a10-b4193c789443/image-1.png\') no-repeat center center';
      var background = {"color":"#FFAABB","useImage":true,"image":{"url":"https://storage.googleapis.com/risemedialibrary-b428b4e8-c8b9-41d5-8a10-b4193c789443/image-1.png","position":"middle-center","scale":true,repeat: 'no-repeat'}};
      
      expect(backgroundParser.parseBackground(backgroundString, true)).to.deep.equal(background);
    });

    it('should parse image background and without position', function() {
      var background = {'useImage':true,'image':{'url':'/images/bg.jpg','scale':true, repeat: 'no-repeat'}};

      expect(backgroundParser.parseBackground('url(\'/images/bg.jpg\') no-repeat', true)).to.deep.equal(background);
    });

    it('should parse image background repeat vertical', function() {
      var background = {'useImage':true,'image':{'url':'/images/bg.jpg','scale':true, repeat: 'repeat-y'}};

      expect(backgroundParser.parseBackground('url(\'/images/bg.jpg\') repeat-y', true)).to.deep.equal(background);
    });
  });

  describe('getStyle & getScaleToFit: ', function() {
    it('should get color background', function() {
      expect(backgroundParser.getStyle({'color':'rgba(255,255,255,1)'})).to.deep.equal('rgba(255,255,255,1)');
    });

    it('should get image background and scale to fit true', function() {
      var background = {'useImage':true,'image':{'url':'/images/bg.jpg','position':'top-left', repeat: 'no-repeat','scale':true}};

      expect(backgroundParser.getStyle(background)).to.equal('url(\'/images/bg.jpg\') no-repeat left top');
      expect(backgroundParser.getScaleToFit(background)).to.be.true;

    });

    it('should escape apostrophe in image filename', function() {
      var background = {'useImage':true,'image':{'url':'/images/b\'g\'.jpg','position':'top-left', repeat: 'no-repeat','scale':true}};

      expect(backgroundParser.getStyle(background)).to.equal('url(\'/images/b\\\'g\\\'.jpg\') no-repeat left top');
    });

    it('should unescape apostrophe in filename', function() {
      var background = {'useImage':true,'image':{'url':'/images/b\'g\'.jpg', repeat: 'no-repeat','position':'top-left','scale':true}};

      expect(backgroundParser.parseBackground('url(\'/images/b\\\'g\\\'.jpg\') no-repeat left top', true)).to.deep.equal(background);
    });
    
    it('should get image & clor background', function() {
      var backgroundString = 'rgb(170, 170, 170) url(\'https://storage.googleapis.com/risemedialibrary-b428b4e8-c8b9-41d5-8a10-b4193c789443/image-1.png\') no-repeat center center';
      var background = {"color":"rgb(170, 170, 170)","useImage":true,"image":{"url":"https://storage.googleapis.com/risemedialibrary-b428b4e8-c8b9-41d5-8a10-b4193c789443/image-1.png","position":"middle-center", repeat: 'no-repeat',"scale":true}};
      
      expect(backgroundParser.getStyle(background)).to.equal(backgroundString);
      
    });

    it('should not repeat when scaling', function() {
      var backgroundString = 'rgb(170, 170, 170) url(\'https://storage.googleapis.com/risemedialibrary-b428b4e8-c8b9-41d5-8a10-b4193c789443/image-1.png\') no-repeat center center';
      var background = {"color":"rgb(170, 170, 170)","useImage":true,"image":{"url":"https://storage.googleapis.com/risemedialibrary-b428b4e8-c8b9-41d5-8a10-b4193c789443/image-1.png","position":"middle-center", repeat: 'repeat',"scale":true}};
      
      expect(backgroundParser.getStyle(background)).to.equal(backgroundString);
      
    });
    
    
  });

});
