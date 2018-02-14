angular.module("risevision.widget.common")
  .constant("STORAGE_FILE_URL_BASE", "storage.googleapis.com/risemedialibrary-")
  .constant("STORAGE_FOLDER_URL_BASE", "googleapis.com/storage/")
  .factory("commonSettings", ["$log", "STORAGE_FILE_URL_BASE", "STORAGE_FOLDER_URL_BASE",
    function ($log, STORAGE_FILE_URL_BASE, STORAGE_FOLDER_URL_BASE) {

    var factory = {
      getStorageUrlData: function (url) {
        var storage = {},
          str, arr, params, pair;

        function getStorageType(storageUrl) {
          if (storageUrl.indexOf(STORAGE_FILE_URL_BASE) !== -1) {
            return "file";
          }

          if (storageUrl.indexOf(STORAGE_FOLDER_URL_BASE) !== -1) {
            return "folder";
          }

          return null;
        }

        function getCompanyId(storageUrl) {
          var p = storageUrl.split("risemedialibrary-");

          return p[1].slice(0, p[1].indexOf("/"));
        }

        if (getStorageType(url) === "file") {
          str = url.split(STORAGE_FILE_URL_BASE)[1];
          str = decodeURIComponent(str.slice(str.indexOf("/") + 1));
          arr = str.split("/");

          storage.companyId = getCompanyId(url);
          storage.fileName = arr.pop();
          storage.folder = arr.length > 0 ? arr.join("/") : "";

          if (storage.folder !== "") {
            // add ending "/" to the folder path
            storage.folder += "/";
          }
        }
        else if (getStorageType(url) === "folder") {
          params = url.split("?");

          for (var i = 0; i < params.length; i++) {
            pair = params[i].split("=");

            if (pair[0] === "prefix" && typeof pair[1] !== "undefined" && pair[1] !== "") {
              storage.companyId = getCompanyId(url);
              storage.folder = decodeURIComponent(pair[1]);
              storage.fileName = "";
              break;
            }
          }
        }

        return storage;
      }
    };

    return factory;
  }]);
