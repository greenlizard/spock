requirejs.config({
  // Dependencies orders
  shim: {
    lodash: {
      exports: '_'
    },
    jquery: {
      exports: 'jQuery'
    },
    angular: {
      exports: 'angular',
      deps: ['jquery']
    },
    'pouchdb-nightly.min' : {
      exports: 'pouchdb'
    },
    'angular-mocks': ['angular'],
    'angular-bootstrap': ['angular'],
    'angular-ui-router': ['angular'],
    'angular-pouchdb': ['angular', 'pouchdb-nightly.min'],
    'restangular': ['angular', 'lodash'],
    'src.map': [
      'angular-mocks',
      'angular-ui-router',
      'angular-bootstrap',
      'restangular',
      'angular-pouchdb'
    ],    
    'constants': [
      'angular'
    ],
    app: [
      'constants',
      'src.map'
    ]
  },

  paths: {
    'src.map': '../config/src.map',
    'constants': '../config/constants',
    'angular-ui-router': '../../bower_components/angular-ui-router/release/angular-ui-router'
  },
  
})
