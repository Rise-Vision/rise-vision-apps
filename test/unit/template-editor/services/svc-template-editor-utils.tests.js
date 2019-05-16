'use strict';

describe('service: templateEditorUtils:', function() {
  var sandbox = sinon.sandbox.create();

  beforeEach(module('risevision.template-editor.services'));

  beforeEach(module(function ($provide) {
    $provide.service('$q', function() { return Q; });
  }));

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

    expect(templateEditorUtils.fileNameOf).to.be.a.function;
    expect(templateEditorUtils.addOrRemove).to.be.a.function;
    expect(templateEditorUtils.addOrReplace).to.be.a.function;
  });

  describe('fileNameOf', function () {
    it('should return only the name of the file given a full path', function () {
      expect(templateEditorUtils.fileNameOf('')).to.equal('');
      expect(templateEditorUtils.fileNameOf('test.jpg')).to.equal('test.jpg');
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

  describe('addOrReplace', function () {
    it('should add an item to an empty list', function () {
      var items = [];
      var item = { name: 'test1.jpg' };

      templateEditorUtils.addOrReplace(items, item, item);

      expect(items).to.have.lengthOf(1);
    });

    it('should add an item to a list with one element', function () {
      var items = [{ name: 'test1.jpg' }];
      var item = { name: 'test2.jpg' };

      templateEditorUtils.addOrReplace(items, item, item);

      expect(items).to.have.lengthOf(2);
    });

    it('should replace an item from the list if it already exists', function () {
      var items = [{ name: 'test1.jpg' }, { name: 'test2.jpg' }];
      var item = { name: 'test1.jpg' };

      templateEditorUtils.addOrReplace(items, item, item);

      expect(items).to.have.lengthOf(2);
    });
  });
});
