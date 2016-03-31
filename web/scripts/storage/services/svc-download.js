/* globals JSZip */
'use strict';
angular.module('risevision.storage.services')
  .factory('download', ['$rootScope', 'storage', 'fileRetriever', '$q',
    '$timeout', '$window', '$stateParams',
    function ($rootScope, storage, fileRetriever, $q, $timeout, $window,
      $stateParams) {
      var svc = {};
      var downloadCount = 0;
      var iframeContainer = document.createElement('div');

      iframeContainer.style.display = 'none';
      document.body.appendChild(iframeContainer);

      svc.rejectedUploads = [];
      svc.activeFolderDownloads = [];

      svc.downloadURL = function (url, fileName) {
        var hiddenIFrameID = 'hiddenDownloader' + downloadCount++;
        var iframe = document.createElement('iframe');
        iframe.id = hiddenIFrameID;
        iframe.style.display = 'none';
        iframeContainer.appendChild(iframe);
        iframe.src = url +
          '&response-content-disposition=attachment;filename=' + fileName;
      };

      svc.downloadBlob = function (blob, fileName) {
        var a = document.createElement('a');
        a.href = window.URL.createObjectURL(blob);
        a.download = fileName; // Set the file name.
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.appendChild(a);
      };

      svc.cancelFolderDownload = function (folder) {
        folder.cancelled = true;

        svc.activeFolderDownloads.splice(svc.activeFolderDownloads.indexOf(
          folder), 1);
      };

      svc.downloadFiles = function (files, bucketName, delay) {
        $timeout(function () {
          if (files.length === 0) {
            $timeout(function () {
              $(iframeContainer).empty();
            }, 1000);

            return;
          }

          var file = files.shift();
          var fileName = file.name;

          if (fileName.substr(-1) !== '/') {
            svc.downloadFile(file);
          } else {
            svc.downloadFolder(file);
          }

          svc.downloadFiles(files, bucketName, 1000);
        }, delay, false);
      };

      svc.downloadFile = function (file) {
        storage.getSignedDownloadURI(file).then(
          function (resp) {
            if (resp.result) {
              var downloadName = file.name.replace('--TRASH--/', '');

              if (downloadName.indexOf('/') >= 0) {
                downloadName = downloadName.substr(downloadName.lastIndexOf(
                  '/') + 1);
              }

              svc.downloadURL(resp.message, encodeURIComponent(
                downloadName));
            } else {
              file.rejectedUploadMessage = resp.message;
              svc.rejectedUploads.push(file);
            }
          });
      };

      svc.downloadFolder = function (folder) {
        var params = {
          companyId: $stateParams.companyId,
          folderName: folder.name
        };

        folder.cancelled = false;
        folder.currentFile = null;
        svc.activeFolderDownloads.push(folder);

        requestor.executeRequest('storage.getFolderContents', params).then(
          function (resp) {
            var zip = new JSZip();
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

            $q.all(promises).then(function (responses) {
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

                svc.downloadBlob(blob, folder.name.substr(0, folder.name
                  .length - 1) + '.zip');
              }
            }, function (err) {
              console.log(err);
              svc.activeFolderDownloads.splice(svc.activeFolderDownloads
                .indexOf(folder), 1);
            });
          });
      };

      return svc;
    }
  ]);
