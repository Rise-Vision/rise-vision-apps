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

          placeholderFactory.updateSubscriptionStatus();
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

      factory.canPlaylistItemMoveDown = function (item) {
        var index = _getItemIndex(item);

        return index > -1 && index < factory.getItems().length - 1;
      };

      factory.canPlaylistItemMoveUp = function (item) {
        return _getItemIndex(item) > 0;
      };

      var moveItem = function (item, newIndex) {
        var index = _getItemIndex(item);
        var items = factory.getItems();

        items.splice(newIndex, 0, items.splice(index, 1)[0]);
      };

      factory.moveItem = moveItem;

      factory.movePlaylistItemDown = function (item) {
        if (factory.canPlaylistItemMoveDown(item)) {
          moveItem(item, _getItemIndex(item) + 1);
        }
      };

      factory.movePlaylistItemUp = function (item) {
        if (factory.canPlaylistItemMoveUp(item)) {
          moveItem(item, _getItemIndex(item) - 1);
        }
      };

      return factory;
    }
  ]);
