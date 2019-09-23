`confirm-instance` is the controller for the confirm message box. It's basically a simplification for the ui-bootstrap component, which always requires a controller to function. It is used in the following manner:

```
        $scope.modalInstance = $modal.open({
          templateUrl: 'partials/confirm-modal.html',
          controller: 'confirmInstance',
          windowClass: 'modal-custom',
          resolve: {
            confirmationTitle: function () {
              return 'schedules-app.details.deleteTitle';
            },
            confirmationMessage: function () {
              return 'schedules-app.details.deleteWarning';
            },
            confirmationButton: function () {
              return 'common.delete-forever';
            },
            cancelButton: null
          }
        });

        $scope.modalInstance.result.then(function () {
          // do what you need if user presses ok
          _delete();
        }, function () {
          // do what you need to do if user cancels
        });
```
