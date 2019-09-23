"use strict";

angular.module("risevision.common.components.ui-flow")
  .factory("uiFlowManager", ["$log", "$q", "$injector",
    "uiStatusDependencies", "$rootScope", "localStorageService",
    function ($log, $q, $injector, uiStatusDependencies, $rootScope,
      localStorageService) {

      var _status, _goalStatus, _retriesLeft = null;
      var _dependencyMap = uiStatusDependencies._dependencies;

      //generate a status that always resolves to true
      var genedateDummyStatus = function () {
        return function () {
          var deferred = $q.defer();
          deferred.resolve(true);
          return deferred.promise;
        };
      };

      var _getOrCreateDummyFactory = function (status) {
        var factory;
        try {
          factory = $injector.get(status);
        } catch (e) {
          $log.debug("Generating dummy status", status);
          factory = genedateDummyStatus();
        }
        return factory;
      };

      //internal method that attempt to reach a particular status
      var _attemptStatus = function (status) {
        var lastD;

        $log.debug("Attempting to reach status", status, "...");
        var dependencies = _dependencyMap[status];
        if (dependencies) {
          if (!(dependencies instanceof Array)) {
            dependencies = [dependencies];
          }

          var prevD = $q.defer(),
            firstD = prevD; //chain sibling dependency together

          angular.forEach(dependencies, function (dep) {
            //iterate through dependencies
            var currentD = $q.defer();
            prevD.promise.then(currentD.resolve, function () {
              _attemptStatus(dep).then(function () {
                //should come here if any of the dependencies is satisfied
                if (_dependencyMap[dep]) {
                  $log.debug("Deps for status", dep, "satisfied.");
                }
                //find factory function and check for satisfaction

                _getOrCreateDummyFactory(status)().then(
                  function () {
                    $log.debug("Status", status, "satisfied.");
                    currentD.resolve(true);
                  },
                  function () {
                    $log.debug("Status", status, "not satisfied.");
                    currentD.reject(status);
                  }
                );
              }, function (lastRej) {
                if (_dependencyMap[dep]) {
                  $log.debug("Failed to reach status", dep,
                    " because its dependencies are not satisfied. Last rejected dep: ",
                    lastRej);
                  currentD.reject(lastRej);
                } else {
                  currentD.reject(dep);
                }

              });
            });
            lastD = prevD = currentD;
          });

          //commence the avalance
          firstD.reject();
        } else {
          //at deep level of termination status
          lastD = $q.defer();
          _getOrCreateDummyFactory(status)().then(
            function () {
              $log.debug("Termination status", status, "satisfied.");
              lastD.resolve(true);
            },
            function () {
              $log.debug("Termination status", status, "not satisfied.");
              lastD.reject(status);
            }
          );
        }

        return lastD.promise;
      };

      var deferred, final = true;
      var _recheckStatus = function (desiredStatus) {
        if (!desiredStatus && !_goalStatus) {
          //no goal, no desired status. resolve to true immediately
          var d = $q.defer();
          d.resolve();
          return d.promise;
        }
        if (!_goalStatus && final) {
          _goalStatus = desiredStatus;
          //start afresh
          _retriesLeft = angular.copy(uiStatusDependencies._retries);
          deferred = $q.defer();
          final = false;
        }
        if (_goalStatus) {
          deferred = $q.defer();
          _attemptStatus(_goalStatus).then(
            function (s) {
              if (_goalStatus) {
                _status = _goalStatus;
              }
              deferred.resolve(s);
              _goalStatus = null;
              final = true;
            },
            function (status) {
              // if rejected at any given step,
              // show the dialog of that relevant step
              _status = status;
              if (_retriesLeft[status] !== undefined) {
                if (_retriesLeft[status] === 0) {
                  $log.debug("Maximum allowed retries for status", status,
                    "reached. Validation will cancel.");
                  cancelValidation();
                } else {
                  _retriesLeft[status]--;
                }
              }
              final = true;
              deferred.reject(status);
            });
        }
        return deferred && deferred.promise;
      };


      var invalidateStatus = function (desiredStatus) {
        _status = "pendingCheck";
        return _recheckStatus(desiredStatus);
      };

      var persist = function () {
        localStorageService.set("risevision.ui-flow.state", {
          goalStatus: _goalStatus,
          retriesLeft: _retriesLeft
        });
      };

      var cancelValidation = function () {
        _status = "";
        _goalStatus = "";
        _retriesLeft = null;
        final = true;
        $rootScope.$broadcast("risevision.uiStatus.validationCancelled");
        $log.debug("UI status validation cancelled.");
      };

      //restore
      if (localStorageService.get("risevision.ui-flow.state")) {
        var state = localStorageService.get("risevision.ui-flow.state");
        if (state && state.goalStatus) {
          _goalStatus = state.goalStatus;
          $log.debug("uiFlowManager.goalStatus restored to", state.goalStatus,
            state.retriesLeft);
          _retriesLeft = state.retriesLeft;
          deferred = $q.defer();
          final = false;
        }
        localStorageService.remove("risevision.ui-flow.state");
      }

      var manager = {
        invalidateStatus: invalidateStatus,
        cancelValidation: cancelValidation,
        getStatus: function () {
          return _status;
        },
        isStatusUndetermined: function () {
          return _status === "pendingCheck";
        },
        persist: persist
      };

      //DEBUG
      // window.uiFlowManager = manager;

      return manager;
    }
  ]);
