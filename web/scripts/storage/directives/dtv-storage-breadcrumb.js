(function () {

  'use strict';

  angular.module('risevision.storage.directives')
    .directive('storageBreadcrumb', ['fileSelectorFactory', 'storageFactory',
      '$filter', '$window',
      function (fileSelectorFactory, storageFactory, $filter, $window) {
        return {
          restrict: 'E',
          scope: true,
          templateUrl: 'partials/storage/breadcrumb.html',
          link: function ($scope, element) {
            var _originalTree = [];
            $scope.fileSelectorFactory = fileSelectorFactory;
            $scope.storageFactory = storageFactory;

            angular.element($window).bind('resize', function () {
              _fitToWidth();
              $scope.$digest();
            });

            var _fitToWidth = function () {
              if (_originalTree.length > 3) {
                var spacePerFolder = 280;
                var width = element[0].parentNode.clientWidth;
                var steps = Math.min(_originalTree.length - 1, Math.floor(
                  width / spacePerFolder));
                var tree = [];
                tree.push(_originalTree[0]);
                if (steps < _originalTree.length - 1) {
                  tree.push({
                    name: '...'
                  });
                }
                for (var i = steps; i > 0; i--) {
                  tree.push(_originalTree[_originalTree.length - i]);
                }
                $scope.tree = tree;
              } else {
                $scope.tree = _originalTree;
              }
            };

            $scope.$watch('storageFactory.folderPath', function () {
              _originalTree = [{
                path: '',
                name: 'My Storage'
              }];
              var folders = storageFactory.folderPath.split('/');
              var path = '';
              for (var i = 0; i < folders.length; i++) {
                var folder = folders[i];
                if (folder !== '') {
                  path += folder + '/';
                  var name = folder === '--TRASH--' ? $filter(
                    'translate')('storage-client.trash') : folder;
                  name = name.length > 20 ? name.substr(0, 20) +
                    '...' : name;
                  _originalTree.push({
                    path: path,
                    name: name
                  });
                }
              }
              _fitToWidth();
            });
          }
        };
      }
    ]);
})();
