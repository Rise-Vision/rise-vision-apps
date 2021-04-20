'use strict';

angular.module('risevision.template-editor.directives')
  .directive('componentStorageSelector', ['$loading', 'filterFilter', 'storageManagerFactory',
    'templateEditorUtils',
    function ($loading, filterFilter, storageManagerFactory, templateEditorUtils) {
      return {
        restrict: 'E',
        scope: true,
        templateUrl: 'partials/template-editor/components/component-storage-selector.html',
        link: function ($scope, element) {
          $scope.storageManagerFactory = storageManagerFactory;
          $scope.folderItems = [];
          $scope.selectedItems = [];
          $scope.filterConfig = {
            placeholder: 'Search Rise Storage',
            id: 'componentStorageSearchInput'
          };
          $scope.search = {
            doSearch: function () {},
            reverse: false
          };

          $scope.storageSelectorId = 'storage-selector';
          $scope.storageUploadManager = {
            folderPath: '',
            onUploadStatus: function (isUploading) {
              $scope.isUploading = isUploading;
            },
            addFile: function (file) {
              templateEditorUtils.addOrReplaceAll($scope.folderItems, {
                name: file.name
              }, file);
            }
          };

          $scope.registerDirective({
            type: 'rise-storage-selector',
            element: element,
            show: function () {
              storageManagerFactory.isListView = true;

              $scope.fileType = storageManagerFactory.fileType;

              $scope.loadItems($scope.storageUploadManager.folderPath);
            },
            onBackHandler: function () {
              var parts = $scope.storageUploadManager.folderPath.split('/');

              if (parts.length === 1) {
                return false;
              } else {
                // Since paths are of the 'folder/' form, the last item is the empty string
                parts.splice(parts.length - 2, 2);
                $scope.storageUploadManager.folderPath = parts.length > 0 ? parts.join('/') + '/' : '';
                $scope.loadItems($scope.storageUploadManager.folderPath);

                return true;
              }
            }
          });

          function _reset() {
            $scope.folderItems = [];
            $scope.selectedItems = [];
            $scope.search.selectAll = false;
            $scope.storageUploadManager.folderPath = '';
          }

          $scope.isFolder = templateEditorUtils.isFolder;
          $scope.fileNameOf = templateEditorUtils.fileNameOf;
          $scope.hasRegularFileItems = function () {
            return templateEditorUtils.hasRegularFileItems($scope.folderItems);
          };

          $scope.thumbnailFor = function (item) {
            if (item.metadata && item.metadata.thumbnail) {
              return item.metadata.thumbnail + '?_=' + (item.timeCreated && item.timeCreated.value);
            } else {
              return item.mediaLink;
            }
          };

          var _handleNavigation = function (folderPath) {
            var folderName = templateEditorUtils.fileNameOf(folderPath);

            if (folderName) {
              $scope.setPanelIcon('folder', 'streamline');
              $scope.setPanelTitle(folderName);
            } else {
              $scope.resetPanelHeader();
            }
          };

          $scope.loadItems = function (newFolderPath) {
            $scope.currentFolder = templateEditorUtils.fileNameOf(newFolderPath);
            _handleNavigation(newFolderPath);

            return storageManagerFactory.loadFiles(newFolderPath)
              .then(function(folderItems) {
                $scope.folderItems = folderItems;

                $scope.selectedItems = [];
                $scope.search.selectAll = false;
                $scope.storageUploadManager.folderPath = newFolderPath;
              });
          };

          $scope.selectItem = function (item) {
            if (storageManagerFactory.isSingleFileSelector && storageManagerFactory.isSingleFileSelector()) {
              if ($scope.isSelected(item)) {
                $scope.selectedItems = [];
              } else {
                $scope.selectedItems = [item];
              }
            } else {
              templateEditorUtils.addOrRemove($scope.selectedItems, {
                name: item.name
              }, item);
            }
          };

          $scope.selectAllItems = function () {
            var filteredFiles = filterFilter($scope.folderItems, $scope.search.query);

            $scope.search.selectAll = !$scope.search.selectAll;

            for (var i = 0; i < $scope.folderItems.length; ++i) {
              var item = $scope.folderItems[i];

              if (templateEditorUtils.isFolder(item.name)) {
                continue;
              }

              var idx = _.findIndex($scope.selectedItems, {
                name: item.name
              });

              if ($scope.search.selectAll && filteredFiles.indexOf(item) >= 0 && idx === -1) {
                $scope.selectedItems.push(item);
              } else if (!$scope.search.selectAll && idx >= 0) {
                $scope.selectedItems.splice(idx, 1);
              }
            }
          };

          $scope.isSelected = function (item) {
            return _.findIndex($scope.selectedItems, {
              name: item.name
            }) >= 0;
          };

          $scope.addSelected = function () {
            if (storageManagerFactory.onSelectHandler) {
              storageManagerFactory.onSelectHandler($scope.selectedItems);

              _reset();

              $scope.showPreviousPage();
            }
          };

          $scope.sortBy = function (cat) {
            if (cat !== $scope.search.sortBy) {
              $scope.search.sortBy = cat;
            } else {
              $scope.search.reverse = !$scope.search.reverse;
            }
          };

          $scope.dateModifiedOrderFunction = function (file) {
            return file.updated ? file.updated.value : '';
          };

          $scope.fileNameOrderFunction = function (file) {
            return file.name.toLowerCase().split(' (').join('/(');
          };

          $scope.search.sortBy = $scope.fileNameOrderFunction;
          
          $scope.$watch('storageManagerFactory.loadingFiles', function (loading) {
            if (loading) {
              $loading.start('component-storage-selector-spinner');
            } else {
              $loading.stop('component-storage-selector-spinner');
            }
          });
        }
      };
    }
  ]);
