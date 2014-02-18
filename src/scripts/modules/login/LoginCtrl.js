angular
.module('spock.modules.login.LoginCtrl', ['spock.common.security.personaProvider'])
.controller('LoginCtrl', ['$scope', '$state', 
  function ($scope, $state) {
    console.log('LoginCtrl called');

    $scope.data = {};

    $scope.login = function (success, error) {
      console.info('Login call!');
    };
  }
])

.config(['$stateProvider', '$urlRouterProvider',
  function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('login', {
        parent: 'home',
        url: 'login',
        views: {
          'container@root' : {
            templateUrl: 'scripts/modules/login/login.html',
            controller: 'LoginCtrl'
          },
        },
      })
      .state('logout', {
        url: 'logout',
        onEnter: ['$state', function ($state) {
          console.log('logout!');
          $state.go('home');
        }]
      })
  }
])
