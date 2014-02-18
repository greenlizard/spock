angular.module('spock.common.app.NavbarCtrl', [])

.controller('NavbarCtrl', ['$scope', 'conf', 
  function ($scope, conf) {
  console.log('NavbarCtrl called');
  $scope.name = 'I am NavCtrl';
  }
])

.config(['$stateProvider', '$urlRouterProvider', 
  function ($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('persona', {
    parent: 'root',
    url: 'persona',
    views: {
      'container' : {
        onEnter: ['$state', function ($state) {
          console.log('logout!');
          $state.go('home');
        }]
      }
    }
    })
  }
]);
