`message-box` is the controller for an informational only message box. It is used in the following manner:

```
        $scope.modalInstance = $modal.open({
          templateUrl: 'partials/message-box.html',
          controller: 'messageBoxController',
          windowClass: 'modal-custom',
          resolve: {
            title: function () {
              return 'editor-app.json-error.title';
            },
            message: function () {
              return 'editor-app.json-error.message';
            },
            button: function () {
              return 'common.close';
            }
          }
        });

        $scope.modalInstance.result.then(function () {
          // do what you need when user presses ok
          _continue();
        });
```
