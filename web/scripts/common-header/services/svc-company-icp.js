'use strict';

angular.module('risevision.common.header')
  .value('COMPANY_ROLE_FIELDS', [
    ['IT/Network Administrator', 'it_network_administrator'],
    ['Facilities', 'facilities'],
    ['Professor/Instructor/Teacher', 'professor_instructor_teacher'],
    ['Marketing', 'marketing'],
    ['Designer', 'designer'],
    ['Executive/Business Owner', 'executive_business_owner'],
    ['Reseller/Integrator', 'reseller_integrator'],
    ['Architect/Consultant', 'architect_consultant'],
    ['Administrator/Volunteer/Intern', 'administrator_volunteer_intern'],
    ['Developer', 'developer'],
    ['Other', 'other']
  ])
  .value('EDUCATION_COMPANY_ROLE_FIELDS', [
    ['IT', 'education_it'],
    ['Librarian', 'education_librarian'],
    ['Marketing/Communications', 'education_marketing_communications'],
    ['Other', 'education_other'],
    ['Principal', 'education_principal'],
    ['Media Specialist', 'education_media_specialist'],
    ['Learning/Technology Coach', 'education_learning_technology_coach'],
    ['Receptionist/Admin', 'education_receptionist_admin'],
    ['Superintendent', 'education_superintendent'],
    ['Teacher', 'education_teacher'],
    ['Professor', 'education_professor'],
    ['Dean', 'education_dean'],
    ['Student', 'education_student']
  ])
  .value('COMPANY_INDUSTRY_FIELDS', [
    ['K-12 Education', 'PRIMARY_SECONDARY_EDUCATION'],
    ['Higher Education', 'HIGHER_EDUCATION',],
    ['Religious', 'RELIGIOUS_INSTITUTIONS',],
    ['Nonprofit', 'PHILANTHROPY',],
    ['Retail', 'RETAIL',],
    ['Restaurants and Bars', 'RESTAURANTS',],
    ['Hospital and Healthcare', 'HOSPITAL_HEALTH_CARE',],
    ['Libraries', 'LIBRARIES',],
    ['Financial Services', 'FINANCIAL_SERVICES',],
    ['Gyms and Fitness', 'HEALTH_WELLNESS_AND_FITNESS',],
    ['Hotels and Hospitality', 'HOSPITALITY'],
    ['Corporate Offices', 'EXECUTIVE_OFFICE'],
    ['Manufacturing', 'INDUSTRIAL_AUTOMATION'],
    ['Government', 'GOVERNMENT_ADMINISTRATION'],
    ['Auto Dealerships', 'AUTOMOTIVE',],
    ['Marketing and Advertising', 'MARKETING_AND_ADVERTISING',],
    ['Technology and Integrator', 'INFORMATION_TECHNOLOGY_AND_SERVICES'],
    ['Warehousing', 'WAREHOUSING'],
    ['Logistics and Supply Chain', 'LOGISTICS_AND_SUPPLY_CHAIN'],
    ['Supermarkets', 'SUPERMARKETS'],
    ['Construction', 'CONSTRUCTION'],
    ['Senior Living', 'SENIOR_LIVING'],
    ['Real Estate', 'REAL_ESTATE'],
    ['Other', 'OTHER']
  ])
  .value('COMPANY_SIZE_FIELDS', [
    ['Solo', '1'],
    ['Fewer than 20 employees', '2'],
    ['21-50 employees', '21'],
    ['51-250 employees', '51'],
    ['More than 250 employees', '250']
  ])
  .constant('USER_ICP_WRITABLE_FIELDS', [
    'mailSyncEnabled'
  ])
  .constant('COMPANY_ICP_WRITABLE_FIELDS', [
    'companyIndustry'
  ])
  .constant('COMPANY_ROLE_WRITABLE_FIELDS', [
    'companyRole'
  ])
  .factory('companyIcpFactory', ['$rootScope', '$q', '$log', '$state', 'userState',
    'updateCompany', 'updateUser', '$modal', 'pick',
    'USER_ICP_WRITABLE_FIELDS', 'COMPANY_ICP_WRITABLE_FIELDS', 'COMPANY_ROLE_WRITABLE_FIELDS',
    function ($rootScope, $q, $log, $state, userState, updateCompany, updateUser, $modal, pick,
      USER_ICP_WRITABLE_FIELDS, COMPANY_ICP_WRITABLE_FIELDS, COMPANY_ROLE_WRITABLE_FIELDS) {
      var factory = {};

      factory.init = function () {
        $rootScope.$on('risevision.company.selectedCompanyChanged', function () {
          //make sure user registration process is complete
          if ($state.current.name.indexOf('common.auth') !== -1) {
            return false;
          }

          if (!_checkIcpCollection()) {
            _checkRoleCollection();
          }
        });
      };

      var _saveIcpData = function (result) {
        var company = result.company;
        var user = result.user;
        var companyId = company.id;
        var username = user.username;

        company = pick(company, COMPANY_ICP_WRITABLE_FIELDS);
        user = pick(user, USER_ICP_WRITABLE_FIELDS);

        var companyPromise = updateCompany(companyId, company);
        var userPromise = updateUser(username, user);

        $q.all([companyPromise, userPromise]).then(function () {
          $log.debug('User & Company Profiles updated');
        });
      };

      var _checkIcpCollection = function () {
        var user = userState.getCopyOfProfile(true);
        var company = userState.getCopyOfSelectedCompany(true);

        //Rise user should not be asked to confirm industry of a sub-company
        if (userState.isRiseAdmin()) {
          return false;
        }

        // Has industry been collected?
        if (company.companyIndustry) {
          return false;
        }

        var modalInstance = $modal.open({
          templateUrl: 'partials/common-header/company-icp-modal.html',
          controller: 'CompanyIcpModalCtrl',
          size: 'md',
          backdrop: 'static', //prevent from closing modal by clicking outside
          keyboard: false, //prevent from closing modal by pressing escape
          resolve: {
            user: function () {
              return user;
            },
            company: function () {
              return company;
            }
          }
        });

        modalInstance.result.then(function (result) {
          _saveIcpData(result);
        });

        return true;
      };

      var _checkUserCreationDate = function (user) {
        var creationDate = ((user && user.termsAcceptanceDate) ?
          (new Date(user.termsAcceptanceDate)) : (new Date()));

        var yesterdayDate = new Date();
        yesterdayDate.setDate(yesterdayDate.getDate() - 1);

        return creationDate < yesterdayDate;
      };

      var _saveRoleData = function (result) {
        var user = result.user;
        var username = user.username;

        user = pick(user, COMPANY_ROLE_WRITABLE_FIELDS);

        updateUser(username, user).then(function (resp) {
          if (resp && resp.item) {
            userState.updateUserProfile(resp.item);
          }

          $log.debug('User Profile updated');
        });
      };

      var _checkRoleCollection = function () {
        var user = userState.getCopyOfProfile(true);

        if (!userState.isEducationCustomer(true) || !_checkUserCreationDate(user)) {
          return;
        }

        // Has company role been collected?
        if (user.companyRole) {
          return;
        }

        var modalInstance = $modal.open({
          templateUrl: 'partials/common-header/company-role-modal.html',
          controller: 'CompanyRoleModalCtrl',
          size: 'md',
          backdrop: 'static', //prevent from closing modal by clicking outside
          keyboard: false, //prevent from closing modal by pressing escape
          resolve: {
            user: function () {
              return user;
            }
          }
        });

        modalInstance.result.then(function (result) {
          _saveRoleData(result);
        });

      };

      return factory;
    }
  ]);
