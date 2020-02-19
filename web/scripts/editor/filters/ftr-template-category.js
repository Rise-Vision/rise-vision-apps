'use strict';

angular.module('risevision.editor.filters')
  .filter('templateCategory', [
    function () {
      return function (templates, category) {
        var categoryArrays = _.map(templates, category);
        var categories = [].concat.apply([], categoryArrays);
        var uniqueCategories = _.uniq(categories);
        var filteredCategories = uniqueCategories.filter(function (el) {
          return !!el;
        });

        return filteredCategories;
      };
    }
  ]);
