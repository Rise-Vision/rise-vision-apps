'use strict';

angular.module('risevision.displays.services')
  .factory('alertsFactory', ['$modal', 'companyService', 'userState', 'company',
    '$log', 'regenerateCompanyField', '$filter', 'humanReadableError',
    function ($modal, companyService, userState, company, $log,
      regenerateCompanyField, $filter, humanReadableError) {
      var factory = {};

      var _company = null;

      var _clearMessages = function () {

        factory.errorMessage = '';
        factory.apiError = '';
      };

      var _updateSettings = function (company) {
        _company = company;
        factory.alertKey = _company.alertKey;
        factory.alertSettings = _company.alertSettings;
        factory.changeDate = _company.changeDate;
        factory.changedBy = _company.changedBy;
      };

      factory.loadSettings = function () {
        _updateSettings(angular.copy(userState.getCopyOfSelectedCompany(
          true)));
      };

      factory.textFieldsValues = [{
        key: 'headline',
        label: $filter('translate')(
          'displays-app.alerts.textFields.headline')
      }, {
        key: 'description',
        label: $filter('translate')(
          'displays-app.alerts.textFields.description')
      }, {
        key: 'instruction',
        label: $filter('translate')(
          'displays-app.alerts.textFields.instruction')
      }, ];

      factory.allowedStatusesValues = [{
        key: 'Actual',
        label: $filter('translate')('displays-app.alerts.statuses.actual')
      }, {
        key: 'Exercise',
        label: $filter('translate')(
          'displays-app.alerts.statuses.exercise')
      }, {
        key: 'System',
        label: $filter('translate')('displays-app.alerts.statuses.system')
      }, {
        key: 'Test',
        label: $filter('translate')('displays-app.alerts.statuses.test')
      }, {
        key: 'Draft',
        label: $filter('translate')('displays-app.alerts.statuses.draft')
      }];

      factory.allowedCategoriesValues = [{
        key: 'Geo',
        label: $filter('translate')('displays-app.alerts.categories.geo')
      }, {
        key: 'Met',
        label: $filter('translate')('displays-app.alerts.categories.met')
      }, {
        key: 'Safety',
        label: $filter('translate')(
          'displays-app.alerts.categories.safety')
      }, {
        key: 'Security',
        label: $filter('translate')(
          'displays-app.alerts.categories.security')
      }, {
        key: 'Rescue',
        label: $filter('translate')(
          'displays-app.alerts.categories.rescue')
      }, {
        key: 'Fire',
        label: $filter('translate')('displays-app.alerts.categories.fire')
      }, {
        key: 'Health',
        label: $filter('translate')(
          'displays-app.alerts.categories.health')
      }, {
        key: 'Env',
        label: $filter('translate')('displays-app.alerts.categories.env')
      }, {
        key: 'Transport',
        label: $filter('translate')(
          'displays-app.alerts.categories.transport')
      }, {
        key: 'Infra',
        label: $filter('translate')(
          'displays-app.alerts.categories.infra')
      }, {
        key: 'CBRNE',
        label: $filter('translate')(
          'displays-app.alerts.categories.cbrne')
      }, {
        key: 'Other',
        label: $filter('translate')(
          'displays-app.alerts.categories.other')
      }];

      factory.allowedUrgenciesValues = [{
        key: 'Immediate',
        label: $filter('translate')(
          'displays-app.alerts.urgencies.immediate')
      }, {
        key: 'Expected',
        label: $filter('translate')(
          'displays-app.alerts.urgencies.expected')
      }, {
        key: 'Future',
        label: $filter('translate')(
          'displays-app.alerts.urgencies.future')
      }, {
        key: 'Past',
        label: $filter('translate')('displays-app.alerts.urgencies.past')
      }, {
        key: 'Unknown',
        label: $filter('translate')(
          'displays-app.alerts.urgencies.unknown')
      }];

      factory.allowedSeveritiesValues = [{
        key: 'Extreme',
        label: $filter('translate')(
          'displays-app.alerts.severities.extreme')
      }, {
        key: 'Severe',
        label: $filter('translate')(
          'displays-app.alerts.severities.severe')
      }, {
        key: 'Moderate',
        label: $filter('translate')(
          'displays-app.alerts.severities.moderate')
      }, {
        key: 'Minor',
        label: $filter('translate')(
          'displays-app.alerts.severities.minor')
      }, {
        key: 'Unknown',
        label: $filter('translate')(
          'displays-app.alerts.severities.unknown')
      }];

      factory.allowedCertaintiesValues = [{
        key: 'Observed',
        label: $filter('translate')(
          'displays-app.alerts.certainties.observed')
      }, {
        key: 'Likely',
        label: $filter('translate')(
          'displays-app.alerts.certainties.likely')
      }, {
        key: 'Possible',
        label: $filter('translate')(
          'displays-app.alerts.certainties.possible')
      }, {
        key: 'Unlikely',
        label: $filter('translate')(
          'displays-app.alerts.certainties.unlikely')
      }, {
        key: 'Unknown',
        label: $filter('translate')(
          'displays-app.alerts.certainties.unknown')
      }];

      factory.changePresentation = function () {
        var modalInstance = $modal.open({
          templateUrl: 'partials/editor/presentation-selector-modal.html',
          controller: 'PresentationSelectorModal'
        });
        modalInstance.result.then(function (presentationDetails) {
          factory.alertSettings.presentationId = presentationDetails[0];
          factory.alertSettings.presentationName = presentationDetails[1];
        });
      };

      factory.save = function () {
        _clearMessages();
        factory.savingAlerts = true;
        factory.errorSaving = false;
        company.updateAlerts(_company.id, _company).then(function (result) {
          factory.savingAlerts = false;
          userState.updateCompanySettings(result.item);
          _updateSettings(result.item);
        }, function (error) {
          factory.savingAlerts = false;
          factory.errorSaving = true;
          factory.errorMessage = 'Failed to update Alerts.';
          factory.apiError = humanReadableError(error && error.result || error);
          $log.error(factory.errorMessage, error);
        });
      };

      factory.regenerateAlertKey = function () {
        _clearMessages();

        regenerateCompanyField(_company.id, 'alertKey').then(function (result) {
          factory.alertKey = result.item;
        }, function (error) {
          factory.errorMessage = 'Failed to reset Web Service URL.';
          factory.apiError = humanReadableError(error);
          $log.error(factory.errorMessage, error);
        });
      };

      return factory;
    }
  ]);
