'use strict';

angular.module('risevision.editor.services')
  .factory('placeholderPlaylistFactory', ['placeholderFactory',
    function (placeholderFactory) {
      var factory = {};

      factory.getItems = function () {
        if (!placeholderFactory.placeholder) {
          return undefined;
        }
        return placeholderFactory.placeholder.items ?
          placeholderFactory.placeholder.items :
          placeholderFactory.placeholder.items = [];
      };

      var _getItemIndex = function (item) {
        return factory.getItems() ?
          factory.getItems().indexOf(item) : -1;
      };

      factory.updateItem = function (item) {
        if (_getItemIndex(item) === -1) {
          factory.getItems().push(item);
        }
      };

      factory.removeItem = function (item) {
        var index = _getItemIndex(item);
        if (index !== -1) {
          factory.getItems().splice(index, 1);
        }
      };

      var _setItemCopyName = function (item, index) {
        var items = factory.getItems();
        index = index || 1;
        var itemName = item.name + ' (' + index + ')';

        for (var i = 0; i < items.length; i++) {
          if (items[i].name === itemName) {
            // Same name exists
            return _setItemCopyName(item, ++index);
          }
        }

        item.name = itemName;

        return;
      };

      factory.duplicateItem = function (item) {
        var index = _getItemIndex(item);
        if (index !== -1) {
          var newItem = angular.copy(item);

          _setItemCopyName(newItem);

          factory.getItems().splice(index + 1, 0, newItem);
        }
      };

      var moveItem = function (currIndex, newIndex) {
        var items = factory.getItems();

        items.splice(newIndex, 0, items.splice(currIndex, 1)[0]);
      };

      factory.moveItem = moveItem;


      return factory;
    }
  ]);
