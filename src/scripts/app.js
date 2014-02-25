angular.module('spock', [
  'spock.constants',
  'spock.common',
  'spock.modules',
  'spock.templates.cache'
])

.config(['$httpProvider', function ($httpProvider) {
  console.log('config spock');
  $httpProvider.defaults.useXDomain = true;
  $httpProvider.defaults.withCredentials = true;
  delete $httpProvider.defaults.headers.common['X-Requested-With'];
}])

.config(['confProvider', 'API_PROTOCOL', 'API_DOMAIN', 'API_USER', 'API_PASS', 'API_PORT', 'API_PATH', 'personaProvider',
  function (confProvider, API_PROTOCOL, API_DOMAIN, API_USER, API_PASS, API_PORT, API_PATH, personaProvider) {
    console.log('config spock');
    confProvider.set('appName', 'spock');
    confProvider.set('protocol', API_PROTOCOL);
    confProvider.set('domain', API_DOMAIN);
    confProvider.set('user', API_USER);
    confProvider.set('pass', API_PASS);
    confProvider.set('port', API_PORT);
    confProvider.set('path', API_PATH);
    personaProvider.setBaseUrl('http://localhost:3000');
  }]
);

// angular.element(document).ready(function () {
//   angular.bootstrap(document, ['spock']);
// });
