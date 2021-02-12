/*jshint expr:true */
'use strict';

describe('Filters: ', function() {

  beforeEach(module('risevision.storage.filters'));

  describe('fileTypeFilter: ', function() {
    var fileTypeFilter;
    
    beforeEach(inject(function($filter) {
      fileTypeFilter = $filter('fileTypeFilter');
    }));

    it('should exist', function() {
      expect(fileTypeFilter).be.defined;
    });

    it('should extract file type', function () {
      expect(fileTypeFilter('hello.txt')).to.equal('TXT');
      expect(fileTypeFilter('4g43g43gj34iogj43iogj34ig4j3g4i3.jpeg')).to.equal('JPEG');
      expect(fileTypeFilter('dash-and.dot-in.file.name.xml')).to.equal('XML');
      expect(fileTypeFilter('no.extension')).to.equal('');
      expect(fileTypeFilter('noextension')).to.equal('');
    });
    
    it('should show folder label', function () {
      expect(fileTypeFilter('someFolder/')).to.equal('common.folder');
    });
  });
  
  describe('fileNameFilter: ', function() {
    var fileNameFilter;
    
    beforeEach(inject(function($filter) {
      fileNameFilter = $filter('fileNameFilter');
    }));

    it('should exist', function() {
      expect(fileNameFilter).be.defined;
    });

    it('should extract file name', function () {
      expect(fileNameFilter('hello.txt', '')).to.equal('hello.txt');
      expect(fileNameFilter('hello.txt', 'folder/')).to.equal('hello.txt');
      expect(fileNameFilter('folder/', 'folder/')).to.equal('/');
      expect(fileNameFilter('folder/hello.txt', 'folder/')).to.equal('hello.txt');
      expect(fileNameFilter('folder/hello.txt', '')).to.equal('folder/hello.txt');
      expect(fileNameFilter('', '')).to.equal('/');
    });
    
    it('should replace trash label', function () {
      expect(fileNameFilter('--TRASH--/', '')).to.equal('storage-client.trash/');
      expect(fileNameFilter('--TRASH--/hello.txt', '')).to.equal('storage-client.trash/hello.txt');
    });
  });

  describe('fileSizeFilter: ', function() {
    var fileSizeFilter;
    
    beforeEach(inject(function($filter) {
      fileSizeFilter = $filter('fileSizeFilter');
    }));

    it('should exist', function() {
      expect(fileSizeFilter).be.defined;
    });

    it('should format file size', inject(function ($filter) {
      expect(fileSizeFilter(0)).to.equal('0 bytes');
      expect(fileSizeFilter()).to.equal('');
      expect(fileSizeFilter(200)).to.equal('200 bytes');
      expect(fileSizeFilter(2 * 1024)).to.equal('2 KB');
      expect(fileSizeFilter(1023 * 1024)).to.equal('1023 KB');
      expect(fileSizeFilter(3 * 1024 * 1024)).to.equal('3 MB');
      expect(fileSizeFilter(5 * 1024 * 1024 + 600 * 1024)).to.equal('5.5 MB');
      expect(fileSizeFilter(17 * 1024 * 1024 * 1024)).to.equal('17 GB');
      expect(fileSizeFilter(23 * 1024 * 1024 * 1024 + 700 * 1024 * 1024)).to.equal('23.6 GB');
      expect(fileSizeFilter(2002 * 1024 * 1024 * 1024)).to.equal('2002 GB');
    }));
  });

  describe('bandwidthUseFilter: ', function() {
    var bandwidthUseFilter;
    
    beforeEach(inject(function($filter) {
      bandwidthUseFilter = $filter('bandwidthUseFilter');
    }));

    it('should exist', function() {
      expect(bandwidthUseFilter).be.defined;
    });
    
    it('should return invalid number', function () {
      expect(bandwidthUseFilter('nan')).to.equal('nan');
    });

    it('should show lessThan1MB', function () {
      // should be 'Less Than 1MB' but the translation is missing
      expect(bandwidthUseFilter(1023 * 1024)).to.equal('');
    });

    it('should show bandwidth use', function () {
      expect(bandwidthUseFilter(3 * 1024 * 1024)).to.equal('3 MB');
    });
  });

  describe('groupBy: ', function() {
    var groupBy;
    
    beforeEach(inject(function($filter) {
      groupBy = $filter('groupBy');
    }));

    it('should exist', function() {
      expect(groupBy).be.defined;
    });
    
    it('should group items', function() {
      var items = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      
      expect(groupBy()).to.be.undefined;
      expect(groupBy(items, 3)).to.deep.equal([ [ 0, 1, 2 ], [ 3, 4, 5 ], [ 6, 7, 8 ], [ 9, 10 ] ]);
    });
  });

  describe('trashItemFilter: ', function() {
    var trashItemFilter;
    
    beforeEach(inject(function($filter) {
      trashItemFilter = $filter('trashItemFilter');
    }));

    it('should exist', function() {
      expect(trashItemFilter).be.defined;
    });
    
    it('should extract trash label', function() {
      expect(trashItemFilter('file.txt')).to.equal('file.txt');
      expect(trashItemFilter('folder/file.txt')).to.equal('folder/file.txt');
      expect(trashItemFilter('--TRASH--/file.txt')).to.equal('file.txt');
      expect(trashItemFilter('--TRASH--/folder/file.txt')).to.equal('folder/file.txt');
    });
  });

});
