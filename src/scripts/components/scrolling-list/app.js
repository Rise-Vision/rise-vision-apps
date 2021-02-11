/* jshint unused: false */
(function (angular) {

  'use strict';

  angular.module('risevision.common.components.scrolling-list', [
      'rvScrollEvent'
    ])
    .value('BaseList', function (maxCount) {
      this.list = [];
      this.maxCount = maxCount ? maxCount : 40;
      this.cursor = null;
      this.endOfList = false;

      //unused
      this.searchString = '';
      this.clear = function () {
        this.list = [];
        this.cursor = null;
        this.endOfList = false;
      };
      this.concat = function (items) {
        this.list = this.list.concat(items);
      };
      this.add = function (items, cursor) {
        this.cursor = cursor;
        this.endOfList = items.length < this.maxCount;
        this.concat(items);
      };

      //unused
      var append = function (items) {
        for (var i = 0; i < items.length; i++) {
          this.list.push(items[i]);
        }
      };
      //unused
      var remove = function (index) {
        this.list.splice(index, 1);
      };
    });

})(angular);
