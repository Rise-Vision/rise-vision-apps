(function (angular) {
  "use strict";

  angular.module("risevision.core.util", [])

  .factory("pick", function () {
    var ArrayProto = Array.prototype;
    var
      slice = ArrayProto.slice,
      concat = ArrayProto.concat;
    // Internal function that returns an efficient (for current engines) version
    // of the passed-in callback, to be repeatedly applied in other Underscore
    // functions.
    var createCallback = function (func, context, argCount) {
      if (context === void 0) {
        return func;
      }
      switch (argCount === null ? 3 : argCount) {
      case 1:
        return function (value) {
          return func.call(context, value);
        };
      case 2:
        return function (value, other) {
          return func.call(context, value, other);
        };
      case 3:
        return function (value, index, collection) {
          return func.call(context, value, index, collection);
        };
      case 4:
        return function (accumulator, value, index, collection) {
          return func.call(context, accumulator, value, index,
            collection);
        };
      }
      return function () {
        return func.apply(context, arguments);
      };
    };

    return function (obj, iteratee, context) {
      var result = {},
        key;
      if (obj === null) {
        return result;
      }
      if (angular.isFunction(iteratee)) {
        iteratee = createCallback(iteratee, context);
        for (key in obj) {
          var value = obj[key];
          if (iteratee(value, key, obj)) {
            result[key] = value;
          }
        }
      } else {
        var keys = concat.apply([], slice.call(arguments, 1));
        obj = new Object(obj);
        for (var i = 0, length = keys.length; i < length; i++) {
          key = keys[i];
          if (key in obj) {
            result[key] = obj[key];
          }
        }
      }
      return result;
    };
  });

})(angular);
