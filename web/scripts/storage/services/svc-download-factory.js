/* globals JSZip */
'use strict';
angular.module('risevision.storage.services')
  .factory('downloadFactory', ['storageUtils', 'storage', 'fileRetriever',
    '$q', '$log', '$timeout', '$window', '$stateParams',
    function (storageUtils, storage, fileRetriever,
      $q, $log, $timeout, $window, $stateParams) {
      var svc = {};
      var downloadCount = 0;
      var iframeContainer = $window.document.createElement('div');

      iframeContainer.style.display = 'none';
      $window.document.body.appendChild(iframeContainer);

      svc.rejectedUploads = [];
      svc.activeFolderDownloads = [];

      var downloadURL = function (url, fileName) {
        var hiddenIFrameID = 'hiddenDownloader' + downloadCount++;
        var iframe = $window.document.createElement('iframe');
        iframe.id = hiddenIFrameID;
        iframe.style.display = 'none';
        iframeContainer.appendChild(iframe);
        iframe.src = url +
          '&response-content-disposition=attachment;filename=' + fileName;
      };

      var downloadFile = function (file) {
        storage.getSignedDownloadURI(file).then(function (resp) {
          if (resp.result) {
            var downloadName = file.name.replace('--TRASH--/', '');

            if (downloadName.indexOf('/') >= 0) {
              downloadName = downloadName.substr(downloadName.lastIndexOf(
                '/') + 1);
            }

            downloadURL(resp.message, encodeURIComponent(downloadName));
          } else {
            file.rejectedUploadMessage = resp.message;
            svc.rejectedUploads.push(file);
          }
        });
      };

      var downloadBlob = function (blob, fileName) {
        var a = $window.document.createElement('a');
        a.href = $window.URL.createObjectURL(blob);
        a.download = fileName; // Set the file name.
        a.style.display = 'none';
        iframeContainer.appendChild(a);
        a.click();
      };

      var downloadFolder = function (folder) {
        folder.cancelled = false;
        folder.currentFile = null;
        svc.activeFolderDownloads.push(folder);

        storage.getFolderContents(folder.name).then(function (resp) {
            var zip = new $window.JSZip();
            var promises = [];

            resp.items.forEach(function (file) {
              if (!folder.cancelled) {
                if (file.folder) {
                  zip.folder(file.objectId);
                } else {
                  promises.push(fileRetriever.retrieveFile(
                    file.signedURL, file).then(function (response) {
                    folder.currentFile = file.objectId;

                    return $q.when(response);
                  }));
                }
              }
            });

            return $q.all(promises).then(function (responses) {
              if (!folder.cancelled) {
                responses.forEach(function (response) {
                  zip.file(response.userData.objectId, response.data, {
                    binary: true
                  });
                });

                var blob = zip.generate({
                  type: 'blob'
                });

                svc.activeFolderDownloads.splice(svc.activeFolderDownloads
                  .indexOf(folder), 1);

                downloadBlob(blob, folder.name.substr(0, folder.name
                  .length - 1) + '.zip');
              }
            });
          })
          .then(null, function (e) {
            console.error('Failed to download folder', e);

            svc.activeFolderDownloads.splice(svc.activeFolderDownloads
              .indexOf(folder), 1);
          });
      };

      svc.downloadFiles = function (files, delay) {
        $timeout(function () {
          if (files.length === 0) {
            $timeout(function () {
              angular.element(iframeContainer).empty();
            }, 1000);

            return;
          }

          var file = files.shift();
          var fileName = file.name;

          if (!storageUtils.fileIsFolder(file)) {
            downloadFile(file);
          } else {
            downloadFolder(file);
          }

          svc.downloadFiles(files, 1000);
        }, delay, false);
      };

      svc.cancelFolderDownload = function (folder) {
        folder.cancelled = true;

        svc.activeFolderDownloads.splice(svc.activeFolderDownloads.indexOf(
          folder), 1);
      };

      return svc;
    }
  ]);
