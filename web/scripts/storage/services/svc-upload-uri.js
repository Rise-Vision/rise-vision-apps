'use strict';
angular.module('risevision.storage.services')
  .factory('UploadURIService', ['$q', 'storage', '$interpolate', '$translate',
    '$window',
    function uploadURIService($q, storage, $interpolate, $translate, $window) {
      var svc = {};

      var uriFailed = 'storage-client.error.upload-uri-request-failed';
      var uriFailedMail =
        'storage-client.error.upload-uri-request-failed-mail';
      var accessDenied = 'storage-client.error.access-denied';
      var inactiveSubscription =
        'storage-client.error.upload-inactive-subscription';
      var verifyCompany = 'storage-client.error.upload-verify-company';

      $translate([uriFailed, uriFailedMail, inactiveSubscription,
        verifyCompany, accessDenied
      ], {
        username: '{{username}}'
      }).then(function (values) {
        uriFailed = values[uriFailed];
        uriFailedMail = $interpolate(values[uriFailedMail]);
        inactiveSubscription = $interpolate(values[inactiveSubscription]);
        verifyCompany = $interpolate(values[verifyCompany]);
        accessDenied = values[accessDenied];
      });

      svc.getURI = function getURI(file) {
        if (!file.name) {
          return $q.reject('Invalid Params');
        }

        return storage.getResumableUploadURI(file.name, file.type)

          .then(function (resp) {
            if (resp.result === false) {
              if (resp.message === 'upload-inactive-subscription') {
                resp.message = inactiveSubscription({
                  username: resp.userEmail
                });
              } else if (resp.message === 'upload-verify-company') {
                resp.message = verifyCompany({
                  username: resp.userEmail
                });
              } else if (resp.code === 403) {
                console.log('getResumableUploadURI 403 error', file, resp);
                resp.message = accessDenied;
              } else {
                console.log('getResumableUploadURI generic error', file,
                  resp);
                resp.message = resp.userEmail ? uriFailedMail({
                  username: resp.userEmail
                }) : uriFailed;
              }
              return $q.reject(resp.message);
            } else {
              return resp.message;
            }
          })
          .then(null, function (resp) {
            return $q.reject(typeof (resp) === 'string' ? resp :
              'An error ocurred attempting to begin an upload. Please try again.'
            );
          });
      };

      return svc;
    }
  ]);
