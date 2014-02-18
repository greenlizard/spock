angular.module('spock.common.app.HomeCtrl', [])

.controller('HomeCtrl', ['$scope', '$rootScope', '$state',
  function ($scope, $rootScope, $state) {
    console.log('HomeCtrl called');
    $scope.name = 'I am HomeCtrl';
  }
])

.config(['$stateProvider', '$urlRouterProvider', 
  function ($stateProvider, $urlRouterProvider) {

    $stateProvider
      .state('home', {
        parent: 'root',
        url: '/',
        views: {
          'header': {
            templateUrl: 'scripts/common/app/navbar.tpl.html',
            controller: 'NavbarCtrl'
          },
          'container' : {
            templateUrl: 'scripts/common/app/container.tpl.html',
            controller: 'HomeCtrl'
          },
          'footer': {
            templateUrl: 'scripts/common/app/footer.tpl.html'
          }
        }
      })
  }
]);


