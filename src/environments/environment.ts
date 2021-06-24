// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  BLUEPRINT_URL: 'https://widgets.risevision.com/staging/templates/PRODUCT_CODE/blueprint.json',
  canvaApiKey: 'EwLWFws4Qjpa-n_2ZJgBMQbz',
  // AngularJS config
  APPS_ENV: 'TEST',
  STORE_ENDPOINT_URL: 'https://store-dot-rvacore-test.appspot.com/_ah/api', // override default Store server value
  STORE_SERVER_URL: 'https://store-dot-rvacore-test.appspot.com/',
  RVA_URL: 'http://rva-test.appspot.com',
  VIEWER_URL: 'https://widgets.risevision.com/viewer-stage-0',
  SHARED_SCHEDULE_URL: 'https://widgets.risevision.com/viewer-stage-0/?type=sharedschedule&id=SCHEDULE_ID',
  ALERTS_WS_URL: 'https://rvacore-test.appspot.com/alerts/cap',
  TAG_MANAGER_CONTAINER_ID: null,
  TAG_MANAGER_AUTH: null,
  TAG_MANAGER_ENV: null,
  STORAGE_ENDPOINT_URL: 'https://storage-dot-rvacore-test.appspot.com/_ah/api',
  MESSAGING_PRIMUS_URL: 'https://services-stage.risevision.com/messaging/primus?displayId=apps&machineId=1',
  APPS_URL: '',
  ENV_NAME: 'DEV',
  OAUTH_TOKEN_PROVIDER_URL: 'https://services-stage.risevision.com/oauthtokenprovider/',
  TWITTER_SERVICE_URL: 'https://services-stage.risevision.com/twitter/',
  OAUTH_PUBLIC_KEY: 'EJMI-lB9hB55OYEsYmjXDNfRGoY',
  HUBSPOT_ACCOUNT: '2939619',
  HTML_TEMPLATE_URL: 'https://widgets.risevision.com/staging/templates/PRODUCT_CODE/src/template.html'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
