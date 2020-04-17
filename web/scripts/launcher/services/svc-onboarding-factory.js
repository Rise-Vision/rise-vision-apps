'use strict';

angular.module('risevision.apps.launcher.services')
  .constant('FEATURED_TEMPLATES', [{
      'productId': 'welcome_v2',
      'name': 'Welcome',
      'imageUrl': 'https://s3.amazonaws.com/Store-Products/Rise-Vision/TemplateLibrary/html-template-welcome2.png',
      'productTag': [
        'HTMLTemplates'
      ],
      'productCode': '754b4adfee710941ced5d54370537682c9fcf33c'
    },
    {
      'productId': 'fullscreen-image_v1',
      'name': 'Image Full Screen',
      'imageUrl': 'https://s3.amazonaws.com/Store-Products/Rise-Vision/TemplateLibrary/html-template-fullscreen-image2.png',
      'productTag': [
        'HTMLTemplates'
      ],
      'productCode': 'da323a98f097d8aca0a8b9671c9d4143d045ef87'
    },
    {
      'productId': 'office-greeting_v1',
      'name': 'Office Greeting',
      'imageUrl': 'https://storage.googleapis.com/risemedialibrary-7fa5ee92-7deb-450b-a8d5-e5ed648c575f/Template%20Library/Office%20Greeting/office-greeting-bezel.jpg',
      'productTag': [
        'HTMLTemplates'
      ],
      'productCode': '601ee80f3fe2950b7e4f15c57d88bf0963efb57a'
    }
  ])
  .factory('onboardingFactory', ['$q', 'userState', 'companyAssetsFactory', 'updateUser', '$rootScope',
    'analyticsFactory', '$exceptionHandler', 'updateCompany',
    function ($q, userState, companyAssetsFactory, updateUser, $rootScope, analyticsFactory, $exceptionHandler,
      updateCompany) {
      var factory = {};
      var onboarding = {
        currentStep: -1,
        activeStep: -1,
        tabsCompleted: {},
        steps: [{
            step: 'addTemplate',
            tab: 1,
            active: true
          },
          {
            step: 'templateAdded',
            tab: 1,
            active: true
          },
          {
            step: 'templateNotAdded1',
            tab: 2,
            active: false
          },
          {
            step: 'addDisplay',
            tab: 2,
            active: true
          },
          {
            step: 'activateDisplay',
            tab: 2,
            active: true
          },
          {
            step: 'displayActivated',
            tab: 2,
            active: true
          },
          {
            step: 'templateNotAdded2',
            tab: 3,
            active: false
          },
          {
            step: 'displayNotActivated',
            tab: 3,
            active: false
          },
          {
            step: 'promotePlaybook',
            tab: 3,
            active: true
          },
          {
            step: 'promoteTraining',
            tab: 3,
            active: true
          },
        ]
      };

      var _defaults = function () {
        onboarding.currentStep = -1;
        onboarding.activeStep = -1;
        onboarding.tabsCompleted = {};
      };

      var _setCurrentStep = function (step) {
        onboarding.currentStep = _.findIndex(onboarding.steps, {
          step: step
        });
        onboarding.activeStep = onboarding.currentStep;
      };

      var _getCurrentStep = function () {
        return onboarding.steps[onboarding.currentStep];
      };

      factory.isCurrentStep = function (step) {
        return !!(_getCurrentStep() && _getCurrentStep().step === step);
      };

      var _completeTabsUpTo = function (tabIndex) {
        for (var i = 1; i <= tabIndex; i++) {
          onboarding.tabsCompleted[i] = true;
        }
      };

      factory.isTabCompleted = function (tab) {
        return onboarding.tabsCompleted[tab] === true;
      };

      factory.isCurrentTab = function (tab) {
        return !!(_getCurrentStep() && _getCurrentStep().tab === tab);
      };

      factory.setCurrentTab = function (tab) {
        var index;
        var activeStep = onboarding.steps[onboarding.activeStep];
        var nextStepAfterActive = onboarding.steps[(onboarding.steps.indexOf(activeStep) + 1)];
        var activeIsFinalStepOfTab = nextStepAfterActive && nextStepAfterActive.tab !== activeStep.tab;

        if (activeStep && tab < activeStep.tab) {
          index = _.findLastIndex(onboarding.steps, {
            tab: tab,
            active: true
          });

          if (index !== -1) {
            onboarding.currentStep = index;
          }
        } else if (activeStep && tab === activeStep.tab) {
          onboarding.currentStep = onboarding.activeStep;
        } else if (activeStep && tab > activeStep.tab) {
          if (activeIsFinalStepOfTab) {
            index = _.findIndex(onboarding.steps, {
              tab: tab,
              active: true
            });
            onboarding.activeStep = index;
          } else {
            index = _.findIndex(onboarding.steps, {
              tab: tab,
              active: false
            });
          }
          if (index !== -1) {
            if (activeStep.tab === 2) {
              index++;
            }

            onboarding.currentStep = index;
          }
        }
      };

      var _checkCreationDate = function () {
        var company = userState.getCopyOfSelectedCompany();
        var creationDate = ((company && company.creationDate) ? (new Date(company.creationDate)) : (
          new Date()));
        return creationDate > new Date('Jan 7, 2020');
      };

      var _isMailSyncEnabled = function () {
        var profile = userState.getCopyOfProfile();

        return profile && profile.mailSyncEnabled;
      };

      factory.isOnboarding = function () {
        var profile = userState.getCopyOfProfile();
        var userCompleted = profile && profile.settings && profile.settings.onboardingCompleted === 'true';

        var company = userState.getCopyOfSelectedCompany();
        var companyCompleted = company && company.settings && company.settings.onboardingCompleted === 'true';

        return _checkCreationDate() && !(companyCompleted && userCompleted);
      };

      factory.isTemplateOnboarding = function () {
        return factory.isOnboarding() && factory.isCurrentTab(1);
      };

      factory.refresh = function (reset) {
        if (reset) {
          _defaults();
        }

        if (!factory.isOnboarding()) {
          return $q.resolve();
        }

        var schedulesCheck = companyAssetsFactory.hasSchedules();
        var displaysCheck = companyAssetsFactory.hasDisplays();

        factory.loading = true;

        return $q.all([schedulesCheck, displaysCheck, _isMailSyncEnabled()])
          .then(function (resp) {
            if (resp) {
              if (!resp[0]) {
                _setCurrentStep('addTemplate');
              } else if (factory.isCurrentStep('addTemplate')) {
                _setCurrentStep('templateAdded');
                _completeTabsUpTo(1);
              } else if (!resp[1].hasDisplays) {
                _setCurrentStep('addDisplay');
                _completeTabsUpTo(1);
              } else if (!resp[1].hasActivatedDisplays) {
                _setCurrentStep('activateDisplay');
                _completeTabsUpTo(1);
              } else if (factory.isCurrentStep('addDisplay') || factory.isCurrentStep('activateDisplay')) {
                _setCurrentStep('displayActivated');
                _completeTabsUpTo(2);
              } else if (!resp[2]) {
                _setCurrentStep('promotePlaybook');
                _completeTabsUpTo(2);
                analyticsFactory.track('Onboarding Newsletter Signup Visited');
              } else {
                factory.alreadySubscribed = true;
                return _completeOnboarding(true);
              }
            }
          })
          .finally(function () {
            factory.loading = false;
          });
      };

      factory.setPlaybookSignup = function (signupToNewsletter) {
        _completeOnboarding(signupToNewsletter);
      };

      var _completeCompanyOnboarding = function () {
        return updateCompany(userState.getSelectedCompanyId(), {
            settings: {
              'onboardingCompleted': 'true'
            }
          })
          .then(function (updatedCompany) {
            userState.updateCompanySettings(updatedCompany);
          });
      };

      var _completeUserOnboarding = function (signupToNewsletter) {
        return updateUser(userState.getUsername(), {
            'mailSyncEnabled': signupToNewsletter,
            'settings': {
              'onboardingCompleted': 'true'
            }
          })
          .then(function (resp) {
            userState.updateUserProfile(resp.item);
          });
      };

      var _completeOnboarding = function (signupToNewsletter) {
        factory.loading = true;

        return $q.all([_completeCompanyOnboarding(), _completeUserOnboarding(signupToNewsletter)])
          .then(function (resp) {
            _setCurrentStep('promoteTraining');
            _completeTabsUpTo(3);

            analyticsFactory.track('Onboarding Newsletter Signup Completed', {
              subscribed: signupToNewsletter
            });
          })
          .catch(function (err) {
            $exceptionHandler(err, 'Onboarding update failed.', true);
          })
          .finally(function () {
            factory.loading = false;
          });
      };

      $rootScope.$on('companyAssetsUpdated', function () {
        factory.refresh();
      });

      $rootScope.$on('risevision.company.selectedCompanyChanged', function () {
        factory.refresh(true);
      });

      _defaults();

      return factory;
    }
  ]);
