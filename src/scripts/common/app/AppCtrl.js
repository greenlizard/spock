angular.module('spock.common.app.AppCtrl', [
  'ui.bootstrap',
  'ui.router'
])

.controller('AppCtrl', ['$scope', '$rootScope', '$state',
  function ($scope, $rootScope, $state) {
    console.log('AppCtrl called');
    $scope.name = 'I am AppCtrl';

    // setInterval(function () {
    //   Page.set('title', new Date().getTime())
    //   Notifications.remove('bla', 0);
    //   Notifications.add('bla', { test: new Date().getTime() });
    //   $scope.$apply()
    // }, 1000);
  }
])

.config(['$stateProvider', '$urlRouterProvider', 
  function ($stateProvider, $urlRouterProvider) {
    

    $urlRouterProvider.otherwise('/');

    $stateProvider.state('root', {
      abstract: true,
      views: {
        'root': {
          templateUrl: 'scripts/common/app/layouts/default.tpl.html',
          controller: 'AppCtrl'
        }
      }
    })
  }
])

// debug
.run(['$rootScope', '$state', '$stateParams',
  function ($rootScope, $state, $stateParams) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
  }
])
