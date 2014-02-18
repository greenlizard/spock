angular.module('spock.modules.article.ArticleCtrl', [
  'spock.modules.article.ArticleLayout'
])

.controller('ArticleCtrl', ['$scope', '$rootScope', '$state', '$stateParams', 'db',
  function ($scope, $rootScope, $state, $stateParams, db) {
    

    this.create = function () {
      db.post({
        title: $scope.title,
        content: $scope.content
      })
      .then(function (article) {
        db.sync();
        $state.go('article');
      }, function (err) {
        console.log('Crap, error creating article!', err);
      });
    };

    this.remove = function (article) {
      article.$remove();

      for (var i in $scope.articles) {
        if ($scope.articles[i] == article) {
          $scope.articles.splice(i, 1);
        }
      }
    };

    this.update = function () {
      var article = $scope.article;
      if (!article.updated) {
        article.updated = [];
      }
      article.updated.push(new Date().getTime());

      article.$update(function () {
        $state.go('articles/' + article._id);
      });
    };

    this.find = function () {
      db.allDocs({include_docs: true})
        .then(function (articles) {
          console.log(articles)
          $scope.articles = _.pluck(articles.rows, 'doc');
        });
    };

    this.findOne = function () {
      Articles.get($stateParams._id)
        .then( function (article) {
          $scope.article = article;
        });
    };
  }
])

.config(['$stateProvider', '$urlRouterProvider',
  function ($stateProvider, $urlRouterProvider) {
    
    $stateProvider
      .state('article', {
        parent: 'articleLayout',
        url: 'article',
        views: {
          'center' : {
            templateUrl: 'scripts/modules/article/list.tpl.html',
            controller: 'ArticleCtrl as article'
          }
        }
      })
      .state('article.create', {
        parent: 'articleLayout',
        url: 'article',
        views: {
          'center' : {
            templateUrl: 'scripts/modules/article/create.tpl.html',
            controller: 'ArticleCtrl as article'
          }
        }
      })

      .state('article.detail', {
        parent: 'articleLayout',
        url: 'article/{_id:[0-9]{1,16}}',
        views: {
          'center' : {
            templateUrl: 'scripts/modules/article/edit.tpl.html',
            controller: 'ArticleCtrl as article'
          }
        }
      })
    }
]);

