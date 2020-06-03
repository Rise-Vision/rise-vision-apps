'use strict';

angular.module('risevision.storage.services')
  .factory('ExifStripper', ['$http', function ($http) {

    /**
     * Adapted from https://github.com/mshibl/Exif-Stripper
     */
    function removeExif(imageArrayBuffer, dv) {
      var offset = 0,
        recess = 0;
      var pieces = [];
      var i = 0;
      if (dv.getUint16(offset) === 0xffd8) {
        offset += 2;
        var app1 = dv.getUint16(offset);
        offset += 2;
        while (offset < dv.byteLength) {
          if (app1 === 0xffe1) {
            pieces[i] = {
              recess: recess,
              offset: offset - 2
            };
            recess = offset + dv.getUint16(offset);
            i++;
          } else if (app1 === 0xffda) {
            break;
          }
          offset += dv.getUint16(offset);
          app1 = dv.getUint16(offset);
          offset += 2;
        }
        if (pieces.length > 0) {
          var newPieces = [];
          pieces.forEach(function (v) {
            newPieces.push(imageArrayBuffer.slice(v.recess, v.offset));
          });
          newPieces.push(imageArrayBuffer.slice(recess));
          return newPieces;
        }
      }
    }

    return {
      strip: function (fileItem) {
        var objectURL = URL.createObjectURL(fileItem.domFileItem);
        return $http.get(objectURL, {
            responseType: 'arraybuffer'
          })
          .then(function (response) {
            var buffer = response.data;
            var dataView = new DataView(buffer);
            var fileBits = removeExif(buffer, dataView);
            if (fileBits) {
              fileItem.domFileItem = new File(fileBits, fileItem.file.name, {
                type: fileItem.file.type
              });

              fileItem.file.size = fileItem.domFileItem.size;
            }
            return fileItem;
          })
          .catch(function () {
            return fileItem;
          });
      }
    };
  }])
  .factory('XHRFactory', [function () {
    return {
      get: function () {
        return new XMLHttpRequest();
      }
    };
  }])
  .factory('FileUploader', ['fileUploaderFactory',
    function (fileUploaderFactory) {
      return fileUploaderFactory();
    }
  ])
  .factory('fileUploaderFactory', ['$rootScope', '$q', 'XHRFactory', 'encoding', 'ExifStripper', '$timeout',
    function ($rootScope, $q, XHRFactory, encoding, ExifStripper, $timeout) {
      return function () {
        var svc = {};
        var loadBatchTimer = null;

        svc.url = '/';
        svc.alias = 'file';
        svc.headers = {};
        svc.queue = [];
        svc.progress = 0;
        svc.method = 'PUT'; //'POST';
        svc.formData = [];
        svc.queueLimit = 10;
        // Tentative tracking for total remaining files
        svc.remainingFileCount = 0;
        svc.withCredentials = false;
        svc.isUploading = false;
        svc.nextIndex = 0;

        svc.removeExif = function (files) {
          var promises = [];

          for (var i = 0; i < files.length; i++) {
            var file = files[i];
            var fileItem = new FileItem(svc, file);

            if (fileItem.file.type === 'image/jpeg') {
              promises.push(ExifStripper.strip(fileItem));
            } else {
              promises.push($q.resolve(fileItem));
            }
          }
          return $q.all(promises);
        };

        svc.addToQueue = function (fileItems, options) {
          var deferred = $q.defer();
          var currItem = 0;
          svc.remainingFileCount += fileItems.length;
          svc.onAddingFiles();

          var enqueue = function (fileItem) {
            // Checks it's a file
            if (fileItem.file.size || fileItem.file.type) {
              svc.queue.push(fileItem);
              svc.onAfterAddingFile(fileItem);
            } else {
              console.log('File not added to queue: ', fileItem);
            }
          };

          var loadBatch = function () {
            if (currItem < fileItems.length) {
              while (svc.queue.length < svc.queueLimit && currItem < fileItems.length) {
                enqueue(fileItems[currItem++]);
              }

              loadBatchTimer = $timeout(loadBatch, 500);
            } else {
              loadBatchTimer = null;

              deferred.resolve();
            }

            svc.progress = svc.getTotalProgress();
            svc.render();
          };

          loadBatch();

          return deferred.promise;
        };

        svc.removeFromQueue = function (value) {
          var index = svc.getIndexOfItem(value);
          var item = svc.queue[index];

          if (item && item.isUploading) {
            svc.cancelItem(item);
          }

          if (index >= 0 && index < svc.queue.length) {
            svc.queue.splice(index, 1);
            svc.remainingFileCount--;
          }

          svc.progress = svc.getTotalProgress();
        };

        svc.removeAll = function () {
          if (loadBatchTimer) {
            $timeout.cancel(loadBatchTimer);
            loadBatchTimer = null;
          }

          for (var i = svc.queue.length - 1; i >= 0; i--) {
            svc.removeFromQueue(svc.queue[i]);
          }
        };

        svc.uploadItem = function (value) {
          var index = svc.getIndexOfItem(value);
          var item = svc.queue[index];

          if (!item) {
            return;
          }

          item.index = item.index || ++svc.nextIndex;
          item.isReady = true;

          if (svc.isUploading) {
            return;
          }

          svc.isUploading = true;
          return item.taskToken ? svc.tusUpload(item) : svc.xhrTransport(item);
        };

        svc.tusUpload = function (item) {
          var tusUpload = new tus.Upload(item.domFileItem, {
            endpoint: [item.url, item.taskToken].join('/'),
            retryDelays: [0, 2000, 6000, 9000],
            removeFingerprintOnSuccess: true,
            metadata: {
              filename: item.file.name,
              filetype: item.file.type
            },
            onError: function (e) {
              svc.notifyErrorItem(item, e.status);
              svc.notifyCompleteItem(item);
              encoding.disableEncoding();
            },
            onProgress: function (bytesUploaded, bytesTotal) {
              var pct = (bytesUploaded / bytesTotal * 100).toFixed(2);

              // Arbitrarily expect encoding to take as long as uploading
              svc.notifyProgressItem(item, pct / 2);
            },
            onSuccess: function () {
              item.tusURL = tusUpload.url;
              encoding.startEncoding(item)
                .then(function (resp) {
                  item.encodingStatusURL = resp.statusURL;

                  return encoding.monitorStatus(item, function (pct) {
                    // Arbitrarily expect upload was first 50% of progress,
                    // and encoding is remaining 50%
                    svc.notifyProgressItem(item, 50 + pct / 2);
                  });
                })
                .then(encoding.acceptEncodedFile.bind(null, item.encodingFileName))
                .then(function () {
                  svc.notifySuccessItem(item);
                  svc.notifyCompleteItem(item);
                })
                .then(null, function (e) {
                  svc.notifyErrorItem(item);
                  svc.notifyCompleteItem(item);
                  encoding.disableEncoding();
                });
            }
          });

          svc.notifyBeforeUploadItem(item);
          tusUpload.start();
        };

        svc.cancelItem = function (value) {
          var index = svc.getIndexOfItem(value);
          var item = svc.queue[index];
          if (item && item.isUploading) {
            item.xhr.abort();
          }
        };

        svc.retryItem = function (value) {
          var index = svc.getIndexOfItem(value);
          var item = svc.queue[index];

          if (!item) {
            return;
          }

          item.isReady = false;
          item.isUploading = false;
          item.isUploaded = false;
          item.isSuccess = false;
          item.isCancel = false;
          item.isError = false;
          item.isRetrying = true;
          item.progress = 0;

          svc.onAfterAddingFile(item);
        };

        svc.getErrorCount = function () {
          return svc.queue.filter(function (f) {
            return f.isError === true;
          }).length;
        };

        svc.getNotErrorCount = function () {
          return svc.queue.filter(function (f) {
            return f.isError === false;
          }).length;
        };

        svc.getIndexOfItem = function (value) {
          return angular.isNumber(value) ? value : svc.queue.indexOf(value);
        };

        svc.getNotUploadedItems = function () {
          return svc.queue.filter(function (item) {
            return !item.isUploaded;
          });
        };

        svc.getReadyItems = function () {
          return svc.queue
            .filter(function (item) {
              return (item.isReady && !item.isUploading);
            })
            .sort(function (item1, item2) {
              return item1.index - item2.index;
            });
        };

        svc.getTotalProgress = function (value) {
          var notUploaded = svc.getNotUploadedItems().length;
          var uploaded = notUploaded ? svc.queue.length - notUploaded : svc.queue.length;
          var ratio = 100 / svc.queue.length;
          var current = (value || 0) * ratio / 100;

          return Math.round(uploaded * ratio + current);
        };

        svc.render = function () {
          if (!$rootScope.$$phase) {
            $rootScope.$apply();
          }
        };

        svc.isSuccessCode = function (status) {
          return (status >= 200 && status < 300) || status === 304;
        };

        svc.notifyBeforeUploadItem = function (item) {
          item.isReady = true;
          item.isUploading = true;

          svc.onBeforeUploadItem(item);
        };

        svc.notifyProgressItem = function (item, progress) {
          var total = svc.getTotalProgress(progress);
          svc.progress = total;
          item.progress = progress;

          svc.render();
        };

        svc.notifyCancelItem = function (item, status) {
          item.isReady = false;
          item.isUploading = false;
          item.isCancel = true;

          svc.onCancelItem(item);
        };

        svc.notifyCompleteItem = function (item) {
          svc.onCompleteItem(item);

          var nextItem = svc.getReadyItems()[0];
          svc.isUploading = false;

          if (angular.isDefined(nextItem)) {
            svc.uploadItem(nextItem);
            return;
          }

          svc.progress = svc.getTotalProgress();
          svc.render();
        };

        svc.notifySuccessItem = function (item) {
          item.isReady = false;
          item.isUploading = false;
          item.isUploaded = true;
          item.isSuccess = true;
          item.progress = 100;
        };

        svc.notifyErrorItem = function (item, status) {
          item.isReady = false;
          item.isUploading = false;
          item.isUploaded = true;
          item.isError = true;
          item.isUnsupportedFile = status === 409;
        };

        svc.xhrTransport = function (item) {
          var xhr = item.xhr = XHRFactory.get();
          var form = new FormData();

          svc.notifyBeforeUploadItem(item);

          angular.forEach(item.formData, function (obj) {
            angular.forEach(obj, function (value, key) {
              form.append(key, value);
            });
          });

          form.append(item.alias, item.domFileItem, item.file.name);

          xhr.upload.onprogress = function (event) {
            var previousChunkBytes, progress;

            if (event.lengthComputable) {
              previousChunkBytes = item.chunkSize * (item.currentChunk - 1);
              progress = (event.loaded + previousChunkBytes) / item.file.size;
              progress = Math.round(progress * 100);
            } else {
              progress = 0;
            }

            svc.notifyProgressItem(item, progress);
          };

          xhr.onload = function () {
            var gist = svc.isSuccessCode(xhr.status) ? 'Success' : 'Error';
            var method = 'notify' + gist + 'Item';

            if (xhr.status === 308) {
              var range = xhr.getResponseHeader('Range');

              if (range) {
                range = parseInt(range.split('-')[1], 10) + 1;

                if (!isNaN(range)) {
                  this.sendChunk(range);
                } else {
                  console.log('Resumable upload - Failed to parse Range header', item);

                  this.onerror();
                }
              } else {
                console.log('Resumable upload - Range header not present, restarting', item);

                item.progress = 0;

                this.sendChunk(0);
              }
            } else if (xhr.status === 503) {
              xhr.requestNextStartByte();
            } else {
              svc[method](item, xhr.status);
              svc.notifyCompleteItem(item);
            }
          };

          xhr.onerror = function () {
            svc.notifyErrorItem(item, xhr.status);
            svc.notifyCompleteItem(item);
          };

          xhr.onabort = function () {
            svc.notifyCancelItem(item);
            svc.notifyCompleteItem(item);
          };

          xhr.requestNextStartByte = function () {
            xhr.open(item.method, item.url, true);
            xhr.withCredentials = item.withCredentials;
            xhr.setRequestHeader('Content-Range', 'bytes */' + item.file.size);
            xhr.send();
          };

          xhr.sendChunk = function (startByte) {
            var endByte = startByte + item.chunkSize - 1;
            var length = item.file.size;
            var range = 'bytes ';

            if (length === 0) {
              range += '*';
            } else {
              range += startByte + '-' + Math.min(endByte, length - 1);
            }
            range += '/' + item.file.size;

            item.currentChunk = item.currentChunk ? item.currentChunk + 1 : 1;

            xhr.open(item.method, item.url, true);
            xhr.withCredentials = item.withCredentials;

            angular.forEach(item.headers, function (value, name) {
              xhr.setRequestHeader(name, value);
            });

            xhr.setRequestHeader('Content-Range', range);
            xhr.send(item.domFileItem.slice(startByte, startByte + item.chunkSize));
          };

          xhr.sendChunk(0);

          svc.render();
        };

        function FileItem(uploader, file, options) {
          angular.extend(this, {
            url: uploader.url,
            alias: uploader.alias,
            headers: angular.copy(uploader.headers),
            formData: angular.copy(uploader.formData),
            withCredentials: uploader.withCredentials,
            method: uploader.method
          }, options, {
            uploader: uploader,
            domFileItem: file,
            file: {
              'lastModifiedDate': angular.copy(file.lastModifiedDate),
              'size': file.size,
              'type': file.type,
              'name': file.webkitRelativePath || file.name
            },
            isReady: false,
            isUploading: false,
            isUploaded: false,
            isSuccess: false,
            isCancel: false,
            isError: false,
            isUnsupportedFile: false,
            progress: 0,
            index: null
          });
        }

        return svc;
      };
    }
  ]);
