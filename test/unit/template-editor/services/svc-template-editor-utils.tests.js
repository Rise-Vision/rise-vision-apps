'use strict';

describe('service: templateEditorUtils:', function() {
  var sandbox = sinon.sandbox.create();

  beforeEach(module('risevision.template-editor.services'));

  beforeEach(module(function ($provide) {
    $provide.service('$q', function() { return Q; });
  }));

  var templateEditorUtils, $modal, $window;

  beforeEach(function() {
    inject(function($injector) {
      templateEditorUtils = $injector.get('templateEditorUtils');
      $modal = $injector.get('$modal');
      $window = $injector.get('$window');
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

  describe('needsFinancialDataLicense', function() {
    it('should return true if a rise-data-financial component is present',function() {
      var blueprint = {components: [{type: 'rise-data-financial'}]};
      expect(templateEditorUtils.needsFinancialDataLicense(blueprint)).to.be.true;

      blueprint.components = [{type: 'rise-data-financial'},{type: 'rise-data-financial'}];
      expect(templateEditorUtils.needsFinancialDataLicense(blueprint)).to.be.true;

      blueprint.components = [{type: 'rise-image'},{type: 'rise-data-financial'}];
      expect(templateEditorUtils.needsFinancialDataLicense(blueprint)).to.be.true;
    });

    it('should return false if there are no rise-data-financial components',function() {
      var blueprint = {components: [{type: 'rise-image'}]};
      expect(templateEditorUtils.needsFinancialDataLicense(blueprint)).to.be.false;

      blueprint.components = [];
      expect(templateEditorUtils.needsFinancialDataLicense(blueprint)).to.be.false;
    });

    it('should return false on empty blueprint data',function() {
      expect(templateEditorUtils.needsFinancialDataLicense(null)).to.be.false;
    });
  });

  describe('showFinancialDataLicenseRequiredMessage',function() {
    it('should open modal',function(){
      sandbox.stub($modal,'open').returns({ result: { then: sandbox.stub() } });

      templateEditorUtils.showFinancialDataLicenseRequiredMessage();
      
      $modal.open.should.have.been.calledWithMatch({
        controller: "confirmInstance",
        windowClass: 'madero-style centered-modal financial-data-license-message'
      });
    });

    it('should dismiss and open Contact Us on page confirm', function(done){
      var modalInstance = { result: Q.resolve(), dismiss: sinon.stub() };           
      sandbox.stub($modal,'open').returns(modalInstance);
      sandbox.stub($window,'open');

      templateEditorUtils.showFinancialDataLicenseRequiredMessage();

      setTimeout(function(){
        modalInstance.dismiss.should.have.been.called;
        $window.open.should.have.been.calledWith('https://www.risevision.com/contact-us', "_blank"); 
        done() 
      },10);
    });
  });
  
});
