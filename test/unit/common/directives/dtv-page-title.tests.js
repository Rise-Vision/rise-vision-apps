/*jshint expr:true */

'use strict';

describe('directive: page title', function() {
  beforeEach(module('risevision.apps.directives'));

  var $rootScope, $timeout, $state, elem;
  beforeEach(module(function ($provide) {
    $provide.value('$state', {
      current: {}
    });
  }));

  beforeEach(inject(function($injector, $compile, _$rootScope_) {
    $timeout = $injector.get('$timeout');
    $state = $injector.get('$state');

    $rootScope = _$rootScope_;

    elem = angular.element('<title page-title>mock</title>');

    $compile(elem)($rootScope);

    $rootScope.$digest();
  }));

  it('should populate html', function() {
    expect(elem[0].outerHTML).to.equal('<title page-title="" class="ng-scope">mock</title>');
  });

  it('should initialize default title', function() {
    $timeout.flush();

    expect(elem.text()).to.equal('Rise Vision Apps');
  });

  it('should refresh value on state change', function() {
    $state.current.name = 'common.auth.signin';
    $rootScope.$broadcast('$stateChangeSuccess');
    $rootScope.$digest();

    $timeout.flush();

    expect(elem.text()).to.equal('Sign In | Rise Vision Apps');
  });
  
  it('should map states correctly to names', function() {
    var checkState = function(stateName, pageTitle) {
      $state.current.name = stateName;
      $rootScope.$broadcast('$stateChangeSuccess');
      $rootScope.$digest();

      $timeout.flush();

      expect(elem.text()).to.equal(pageTitle + ' | Rise Vision Apps');
    };

    // userstate routes:
    checkState('common', 'Sign In');
    checkState('common.auth', 'Sign In');
    checkState('common.auth.unauthorized', 'Sign In');

    checkState('common.auth.createaccount', 'Sign Up');
    checkState('common.auth.joinaccount', 'Sign Up');

    checkState('common.auth.requestpasswordreset', 'Reset Password');
    checkState('common.auth.resetpassword', 'Reset Password');

    checkState('common.auth.confirmaccount', 'Confirm Account');

    checkState('common.auth.unsubscribe', 'Unsubscribe');

    // Apps auth routes:
    checkState('common.auth.signin', 'Sign In');

    checkState('common.auth.signup', 'Sign Up');
    checkState('common.auth.unregistered', 'Sign Up');

    // Apps routes:
    checkState('apps', 'Home');
    checkState('apps.launcher', 'Home');
    checkState('apps.launcher.home', 'Home');

    checkState('apps.billing', 'Billing');
    checkState('apps.billing.home', 'Billing');

    checkState('apps.schedules', 'Schedules');
    checkState('apps.schedules.list', 'Schedules');

    checkState('apps.schedules.details', 'Edit Schedule');

    checkState('apps.schedules.add', 'Add Schedule');

    checkState('apps.displays', 'Displays');
    checkState('apps.displays.list', 'Displays');

    checkState('apps.displays.change', 'Display Settings');
    checkState('apps.displays.details', 'Display Settings');

    checkState('apps.displays.alerts', 'Alert Settings');

    checkState('apps.editor', 'Presentations');
    checkState('apps.editor.home', 'Presentations');
    checkState('apps.editor.list', 'Presentations');
    checkState('apps.editor.add', 'Presentations');

    checkState('apps.editor.workspace', 'Edit Presentation');
    checkState('apps.editor.workspace.artboard', 'Edit Presentation');
    checkState('apps.editor.workspace.htmleditor', 'Edit Presentation');
    checkState('apps.editor.templates', 'Edit Presentation');
    checkState('apps.editor.templates.edit', 'Edit Presentation');

    checkState('apps.storage', 'Storage');
    checkState('apps.storage.home', 'Storage');

  });
  
});
