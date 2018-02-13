angular.module("risevision.widget.common")
  .factory("imageValidator", ["$q", function ($q) {
    var factory = {
      // Verify that URL is a valid image file.
      isImage: function(src) {
        var deferred = $q.defer(),
          image = new Image();

        image.onload = function() {
          deferred.resolve(true);
        };

        image.onerror = function() {
          deferred.resolve(false);
        };

        image.src = src;

        return deferred.promise;
      }
    };

    return factory;
  }]);
