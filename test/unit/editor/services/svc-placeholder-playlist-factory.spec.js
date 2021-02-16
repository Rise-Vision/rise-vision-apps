'use strict';

describe('service: placeholderPlaylistFactory:', function() {
  beforeEach(module('risevision.editor.services'));
  beforeEach(module(function ($provide) {
    item = {
      'name': 'item1',
      'duration': '10',
      'type': 'widget',
      'objectReference': null,
      'objectData' : '123'
    };
    item0 = {
      name: 'item0'
    };
    item2 = {
      name: 'item2'
    };

    items = [item0, item, item2];

    placeholderFactory = {
      placeholder: {
        items: items
      }
    };

    $provide.service('placeholderFactory',function () {
      return placeholderFactory;
    });

  }));
  var items, item, item0, item2, placeholderPlaylistFactory, trackerCalled, placeholderFactory;

  beforeEach(function(){
    trackerCalled = undefined;

    inject(function($injector){
      placeholderPlaylistFactory = $injector.get('placeholderPlaylistFactory');
      placeholderPlaylistFactory.item = item;
    });
  });

  it('should exist',function(){
    expect(placeholderPlaylistFactory).to.be.truely;

    expect(placeholderPlaylistFactory.getItems).to.be.a('function');
    expect(placeholderPlaylistFactory.updateItem).to.be.a('function');
    expect(placeholderPlaylistFactory.removeItem).to.be.a('function');
    expect(placeholderPlaylistFactory.duplicateItem).to.be.a('function');
    expect(placeholderPlaylistFactory.moveItem).to.be.a('function');
  });

  describe('getItems: ', function() {
    it('should get the items', function() {
      expect(placeholderPlaylistFactory.getItems()).to.equal(items);
    });

    it('should initialize items if undefined', function() {
      placeholderFactory.placeholder.items = undefined;

      var _items = placeholderPlaylistFactory.getItems();

      expect(_items).to.be.a('array');
      expect(_items.length).to.equal(0);
    });

    it('should return undefined if placeholder is undefined', function() {
      placeholderFactory.placeholder = undefined;

      var _items = placeholderPlaylistFactory.getItems();

      expect(_items).to.equal(undefined);
    });
  });

  describe('removeItem: ',function(){
    it('should remove the item',function(){
      placeholderPlaylistFactory.removeItem(item);

      expect(items.length).to.equal(2);
    });

    it('should not remove missing item',function(){
      placeholderPlaylistFactory.removeItem({});

      expect(items.length).to.equal(3);
      expect(items[1]).to.equal(item);
    });
  });

  describe('moveItem: ', function() {
    it('movePlaylistItemUp/Down: ', function() {
      placeholderPlaylistFactory.moveItem(0, 1);

      expect(items.indexOf(item0)).to.equal(1);

      placeholderPlaylistFactory.moveItem(2, 1);

      expect(items.indexOf(item2)).to.equal(1);
      expect(items.indexOf(item0)).to.equal(2);

      placeholderPlaylistFactory.moveItem(2, 0);
      expect(items.indexOf(item0)).to.equal(0);
    });
  });

  describe('updateItem: ',function(){
    var newItem = {
      name: 'Item 2'
    };

    it('should add the item',function(){
      placeholderPlaylistFactory.updateItem(newItem);

      expect(items.length).to.equal(4);
      expect(items[3]).to.equal(newItem);
    });

    it('should not add duplicate item',function(){
      placeholderPlaylistFactory.updateItem(item);

      expect(items.length).to.equal(3);
      expect(items[1]).to.equal(item);
    });
  });

  describe('duplicateItem: ', function() {
    it('should duplicate the item', function() {
      placeholderPlaylistFactory.duplicateItem(item);

      expect(items.length).to.equal(4);
      expect(items[2].name).to.equal('item1 (1)')
    });

    it('should not have duplicate names', function() {
      placeholderPlaylistFactory.duplicateItem(item);
      placeholderPlaylistFactory.duplicateItem(item);

      expect(items.length).to.equal(5);
      expect(items[2].name).to.equal('item1 (2)')
    });
  });

});
