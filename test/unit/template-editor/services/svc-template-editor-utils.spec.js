'use strict';

describe('service: templateEditorUtils:', function() {
  var sandbox = sinon.sandbox.create();

  beforeEach(module('risevision.template-editor.services'));

  var templateEditorUtils;

  beforeEach(function() {
    inject(function($injector) {
      templateEditorUtils = $injector.get('templateEditorUtils');
    });
  });

  afterEach(function() {
    sandbox.restore();
  });

  it('should initialize', function() {
    expect(templateEditorUtils).to.be.truely;

    expect(templateEditorUtils.intValueFor).to.be.a.function;
    expect(templateEditorUtils.fileNameOf).to.be.a.function;
    expect(templateEditorUtils.addOrRemove).to.be.a.function;
    expect(templateEditorUtils.addOrReplace).to.be.a.function;
  });

  describe('intValueFor',function() {

    it('should get the int value of a string',function(){
      var value = templateEditorUtils.intValueFor('100');

      expect(value).to.equal(100);
    });

    it('should return 0',function(){
      var value = templateEditorUtils.intValueFor('0', 10);

      expect(value).to.equal(0);
    });

    it('should return the default value if the input is not a valid number',function(){
      var value = templateEditorUtils.intValueFor('INVALID', 89);

      expect(value).to.equal(89);
    });

    it('should return the default value if the input is undefined',function(){
      var value = templateEditorUtils.intValueFor(undefined, 8);

      expect(value).to.equal(8);
    });

  });

  describe('fileNameOf', function () {
    it('should return only the name of the file given a full path', function () {
      expect(templateEditorUtils.fileNameOf('')).to.equal('');
      expect(templateEditorUtils.fileNameOf('test.jpg')).to.equal('test.jpg');
      expect(templateEditorUtils.fileNameOf('folder/')).to.equal('folder');
      expect(templateEditorUtils.fileNameOf('folder/test.jpg')).to.equal('test.jpg');
      expect(templateEditorUtils.fileNameOf('folder/subfolder/test.jpg')).to.equal('test.jpg');
    });
  });

  describe('addOrRemove', function () {
    it('should add an item to an empty list', function () {
      var items = [];
      var item = { name: 'test1.jpg' };

      templateEditorUtils.addOrRemove(items, item, item);

      expect(items).to.have.lengthOf(1);
    });

    it('should add an item to a list with one element', function () {
      var items = [{ name: 'test1.jpg' }];
      var item = { name: 'test2.jpg' };

      templateEditorUtils.addOrRemove(items, item, item);

      expect(items).to.have.lengthOf(2);
    });

    it('should remove an item from the list if it already exists', function () {
      var items = [{ name: 'test1.jpg' }, { name: 'test2.jpg' }];
      var item = { name: 'test1.jpg' };

      templateEditorUtils.addOrRemove(items, item, item);

      expect(items).to.have.lengthOf(1);
    });
  });

  describe('addOrReplaceAll', function () {
    it('should add an item to an empty list', function () {
      var items = [];
      var item = { name: 'test1.jpg' };

      templateEditorUtils.addOrReplaceAll(items, item, item);

      expect(items).to.have.lengthOf(1);
    });

    it('should add an item to a list with one element', function () {
      var items = [{ name: 'test1.jpg' }];
      var item = { name: 'test2.jpg' };

      templateEditorUtils.addOrReplaceAll(items, item, item);

      expect(items).to.have.lengthOf(2);
    });

    it('should replace an item from the list if it already exists', function () {
      var items = [{ name: 'test1.jpg' }, { name: 'test2.jpg' }];
      var item = { name: 'test1.jpg' };

      templateEditorUtils.addOrReplaceAll(items, item, item);

      expect(items).to.have.lengthOf(2);
    });
  });

  describe('fileHasValidExtension', function () {
    var extensions = ['.jpg', '.png', '.svg'];

    it('should return true if an empty list of extensions was provided', function () {
      expect(templateEditorUtils.fileHasValidExtension('folder/test.mpg')).to.be.true;
      expect(templateEditorUtils.fileHasValidExtension('folder/test.mpg', [])).to.be.true;
    });

    it('should return true for files with valid extensions', function () {
      expect(templateEditorUtils.fileHasValidExtension('test.jpg', extensions)).to.be.true;
      expect(templateEditorUtils.fileHasValidExtension('folder/test.svg', extensions)).to.be.true;
      expect(templateEditorUtils.fileHasValidExtension('folder/TEST.SVG', extensions)).to.be.true;
    });

    it('should return false for files with not valid extensions', function () {
      expect(templateEditorUtils.fileHasValidExtension('', extensions)).to.be.false;
      expect(templateEditorUtils.fileHasValidExtension('folder/', extensions)).to.be.false;
      expect(templateEditorUtils.fileHasValidExtension('folder/test.mpg', extensions)).to.be.false;
    });
  });

  describe('isFolder', function () {
    it('should return true for paths belonging to folders', function () {
      expect(templateEditorUtils.isFolder('folder/')).to.be.true;
      expect(templateEditorUtils.isFolder('folder/subfolder/')).to.be.true;
    });

    it('should return false for paths belonging to files', function () {
      expect(templateEditorUtils.isFolder('')).to.be.false;
      expect(templateEditorUtils.isFolder('file.txt')).to.be.false;
      expect(templateEditorUtils.isFolder('folder/file.txt')).to.be.false;
    });
  });

  describe('fileNameOf', function () {
    it('should return the name of the last valid element in the provided path', function () {
      expect(templateEditorUtils.fileNameOf('file1.jpg')).to.equal('file1.jpg');
      expect(templateEditorUtils.fileNameOf('folder/')).to.equal('folder');
      expect(templateEditorUtils.fileNameOf('folder/file1.jpg')).to.equal('file1.jpg');
      expect(templateEditorUtils.fileNameOf('folder/subfolder/')).to.equal('subfolder');
    });
  });

  describe('hasRegularFileItems', function () {
    it('should return true for lists with regular file items', function () {
      var items = [
        { name: 'file.png' },
        { name: 'folder/' }
      ]
      var hasFiles = templateEditorUtils.hasRegularFileItems(items);

      expect(hasFiles).to.be.true;
    });

    it('should return false for lists with no regular file items', function () {
      var items = [
        { name: 'not-a-file/' },
        { name: 'folder/' }
      ]
      var hasFiles = templateEditorUtils.hasRegularFileItems(items);

      expect(hasFiles).to.be.false;
    });

    it('should return false for empty lists', function () {
      var hasFiles = templateEditorUtils.hasRegularFileItems([]);

      expect(hasFiles).to.be.false;
    });
  });

  describe('findElement:', function() {
    it('should look for child elements if parent is available', function() {
      var parent = {
        find: sandbox.stub().returns('found')
      };

      expect(templateEditorUtils.findElement('.selector', parent)).to.equal('found');

      parent.find.should.have.been.calledWith('.selector');
    });

    it('should search element', function() {
      sandbox.spy(document, 'querySelector');

      templateEditorUtils.findElement('.selector');

      document.querySelector.should.have.been.calledWith('.selector');
    });
    
  });

  describe('showInvalidExtensionsMessage', function () {
    it('should call the correct functions', function () {
      sandbox.stub(templateEditorUtils, 'showMessageWindow');
      sandbox.stub(templateEditorUtils, 'getValidExtensionsMessage');

      templateEditorUtils.showInvalidExtensionsMessage([]);

      expect(templateEditorUtils.showMessageWindow).to.have.been.called;
      expect(templateEditorUtils.getValidExtensionsMessage).to.have.been.called;
    });
  });

  describe('getValidExtensionsMessage', function () {
    it('should return the correct message for the given set of extensions', function () {
      expect(templateEditorUtils.getValidExtensionsMessage(['.gif'])).to.equal('Rise Vision supports .GIF.');
      expect(templateEditorUtils.getValidExtensionsMessage(['.gif', '.jpg'])).to.equal('Rise Vision supports .GIF and .JPG.');
      expect(templateEditorUtils.getValidExtensionsMessage(['.gif', '.jpg', '.png'])).to.equal('Rise Vision supports .GIF, .JPG and .PNG.');
    });
  });

  describe('repeat', function () {
    it('should repeat the element as many times as requested', function () {
      expect(templateEditorUtils.repeat(1, 0)).to.deep.equal([]);
      expect(templateEditorUtils.repeat(1, 1)).to.deep.equal([1]);
      expect(templateEditorUtils.repeat(1, 2)).to.deep.equal([1,1]);
    });
  });

  describe('padNumber', function () {
    it('should pad the provided numbers with as many leading zeros as neded', function () {
      expect(templateEditorUtils.padNumber(1, 0)).to.equal('1');
      expect(templateEditorUtils.padNumber(1, 1)).to.equal('1');
      expect(templateEditorUtils.padNumber(1, 2)).to.equal('01');
      expect(templateEditorUtils.padNumber(1, 3)).to.equal('001');
    });
  });

  describe('formatISODate', function () {
    it('should return the date in YYYY-MM-dd format', function () {
      expect(templateEditorUtils.formatISODate('')).to.equal(null);
      expect(templateEditorUtils.formatISODate('aaa')).to.equal(null);
      expect(templateEditorUtils.formatISODate('October 25, 2019')).to.equal('2019-10-25');
      expect(templateEditorUtils.formatISODate('2019-10-25')).to.equal('2019-10-25');
    });
  });

  describe('absoluteTimeToMeridian', function () {
    it('should convert from "HH:mm" to "hh:mm aa", returning null for invalid inputs', function () {
      expect(templateEditorUtils.absoluteTimeToMeridian('133:334')).to.equal(null);
      expect(templateEditorUtils.absoluteTimeToMeridian('44:64')).to.equal(null);
      expect(templateEditorUtils.absoluteTimeToMeridian('1:4')).to.equal('01:04 AM');
      expect(templateEditorUtils.absoluteTimeToMeridian('1:34')).to.equal('01:34 AM');
      expect(templateEditorUtils.absoluteTimeToMeridian('15:22')).to.equal('03:22 PM');
      expect(templateEditorUtils.absoluteTimeToMeridian('00:22')).to.equal('12:22 AM');
      expect(templateEditorUtils.absoluteTimeToMeridian('12:22')).to.equal('12:22 PM');
    });
  });

  describe('meridianTimeToAbsolute', function () {
    it('should convert from "hh:mm aa" to "HH:mm", returning null for invalid inputs', function () {
      expect(templateEditorUtils.meridianTimeToAbsolute('133:334 AM')).to.equal(null);
      expect(templateEditorUtils.meridianTimeToAbsolute('44:64 AM')).to.equal(null);
      expect(templateEditorUtils.meridianTimeToAbsolute('12:30 CM')).to.equal(null);
      expect(templateEditorUtils.meridianTimeToAbsolute('12:30')).to.equal(null);
      expect(templateEditorUtils.meridianTimeToAbsolute('1:4 AM')).to.equal('01:04');
      expect(templateEditorUtils.meridianTimeToAbsolute('1:34 AM')).to.equal('01:34');
      expect(templateEditorUtils.meridianTimeToAbsolute('03:22 PM')).to.equal('15:22');
      expect(templateEditorUtils.meridianTimeToAbsolute('12:22 AM')).to.equal('00:22');
      expect(templateEditorUtils.meridianTimeToAbsolute('12:22 PM')).to.equal('12:22');
    });
  });
});
