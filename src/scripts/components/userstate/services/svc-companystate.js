(function (angular) {

  'use strict';

  angular.module('risevision.common.components.userstate')
    .constant('EDUCATION_INDUSTRIES', [
      'PRIMARY_SECONDARY_EDUCATION',
      'HIGHER_EDUCATION'
    ])
    .constant('DISCOUNT_INDUSTRIES', [
      'PRIMARY_SECONDARY_EDUCATION',
      'HIGHER_EDUCATION',
      'LIBRARIES',
      'PHILANTHROPY',
      'NON_PROFIT_ORGANIZATION_MANAGEMENT',
      'RELIGIOUS_INSTITUTIONS'
    ])
    .factory('companyState', ['$location', '$state', 'getCompany', 'objectHelper',
      '$rootScope', '$log', '$q', 'EDUCATION_INDUSTRIES', 'DISCOUNT_INDUSTRIES', 'broadcaster',
      function ($location, $state, getCompany, objectHelper, $rootScope, $log, $q,
        EDUCATION_INDUSTRIES, DISCOUNT_INDUSTRIES, broadcaster) {
        var pendingSelectedCompany;

        var _state = {
          userCompany: {},
          selectedCompany: {}
        };

        var _resetCompanyState = function () {
          objectHelper.clearObj(_state.selectedCompany);
          objectHelper.clearObj(_state.userCompany);
          $log.debug('Company state has been reset.');
        };

        if ($location.search() && $location.search().cid) {
          $log.debug('cid', $location.search().cid,
            'saved for later processing.');
          pendingSelectedCompany = $location.search().cid;
        }

        var _init = function () {
          var deferred = $q.defer();

          //populate userCompany
          getCompany().then(function (company) {
              var selectedCompanyId = _companyState.getSelectedCompanyId() ?
                _companyState.getSelectedCompanyId() :
                pendingSelectedCompany;

              objectHelper.clearAndCopy(company, _state.userCompany);

              return _switchCompany(selectedCompanyId);
            })
            .then(null, function () {
              if ($state.current.forceAuth !== false) {
                _companyState.resetCompany();
              }
            })
            .finally(function () {
              pendingSelectedCompany = null;

              deferred.resolve(null);
            });

          return deferred.promise;
        };

        var _switchCompany = function (companyId) {
          var deferred = $q.defer();

          if (companyId && companyId !== _state.userCompany.id) {
            getCompany(companyId)
              .then(function (company) {
                objectHelper.clearAndCopy(company, _state.selectedCompany);

                deferred.resolve();
                broadcaster.emit(
                  'risevision.company.selectedCompanyChanged');
              })
              .then(null, function (resp) {
                console.error('Failed to load selected company.', resp);

                deferred.reject(resp);
              });
          } else {
            _companyState.resetCompany();

            deferred.resolve();
          }

          return deferred.promise;
        };

        var _reloadSelectedCompany = function () {
          var deferred = $q.defer();

          getCompany(_state.selectedCompany.id)
            .then(function (company) {
              objectHelper.clearAndCopy(company, _state.selectedCompany);

              deferred.resolve();
              broadcaster.emitWithParams('risevision.company.updated', {
                'companyId': company.id
              });
            })
            .then(null, function (resp) {
              console.error('Failed to reload selected company.', resp);

              deferred.reject(resp);
            });

          return deferred.promise;
        };

        var _companyState = {
          init: _init,
          switchCompany: _switchCompany,
          reloadSelectedCompany: _reloadSelectedCompany,
          updateCompanySettings: function (company) {
            if (company && company.id === _companyState.getSelectedCompanyId()) {
              objectHelper.clearAndCopy(company, _state.selectedCompany);
            }
            if (company && company.id === _companyState.getUserCompanyId()) {
              objectHelper.clearAndCopy(company, _state.userCompany);
            }

            broadcaster.emitWithParams('risevision.company.updated', {
              'companyId': company.id
            });
          },
          resetCompany: function () {
            objectHelper.clearAndCopy(_state.userCompany, _state.selectedCompany);

            broadcaster.emit('risevision.company.selectedCompanyChanged');
          },
          resetCompanyState: _resetCompanyState,
          getUserCompanyId: function () {
            return (_state.userCompany && _state.userCompany.id) || null;
          },
          getUserCompanyName: function () {
            return (_state.userCompany && _state.userCompany.name) ||
              null;
          },
          getSelectedCompanyId: function () {
            return (_state.selectedCompany && _state.selectedCompany.id) ||
              null;
          },
          getSelectedCompanyName: function () {
            return (_state.selectedCompany && _state.selectedCompany.name) ||
              null;
          },
          getSelectedCompanyCountry: function () {
            return (_state.selectedCompany && _state.selectedCompany.country) ||
              null;
          },
          getCopyOfUserCompany: function (noFollow) {
            if (noFollow) {
              return angular.extend({}, _state.userCompany);
            } else {
              return objectHelper.follow(_state.userCompany);
            }
          },
          getCopyOfSelectedCompany: function (noFollow) {
            if (noFollow) {
              return angular.extend({}, _state.selectedCompany);
            } else {
              return objectHelper.follow(_state.selectedCompany);
            }
          },
          isSubcompanySelected: function () {
            return _state.selectedCompany && _state.selectedCompany.id !==
              (_state.userCompany && _state.userCompany.id);
          },
          isTestCompanySelected: function () {
            return _state.selectedCompany && _state.selectedCompany.isTest ===
              true;
          },
          isSeller: function () {
            return (_state.selectedCompany && _state.selectedCompany.sellerId) ?
              true : false;
          },
          isRootCompany: function () {
            return _state.userCompany && !_state.userCompany.parentId;
          },
          isSelectedCompanyChargebee: function () {
            return _state.selectedCompany && _state.selectedCompany.origin === 'Chargebee';
          },
          isEducationCustomer: function (checkUserCompany) {
            var company = checkUserCompany ? _state.userCompany : _state.selectedCompany;

            return company && EDUCATION_INDUSTRIES.indexOf(company.companyIndustry) !== -1;
          },
          isDiscountCustomer: function (checkUserCompany) {
            var company = checkUserCompany ? _state.userCompany : _state.selectedCompany;

            return company && DISCOUNT_INDUSTRIES.indexOf(company.companyIndustry) !== -1;
          },
          isK12Customer: function (checkUserCompany) {
            var company = checkUserCompany ? _state.userCompany : _state.selectedCompany;

            return company && company.companyIndustry === 'PRIMARY_SECONDARY_EDUCATION';
          }
        };

        return _companyState;
      }
    ]);

})(angular);
