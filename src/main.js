require.config({baseUrl : './scripts'});
require(['require', 'config/require.js'], function (require) {
	// Require base files
	require(['app', 'angular', 'pouchdb'], function (app, angular, PouchDB) {

      angular.element(document).ready(function () {
      	window.PouchDB = PouchDB;
      	console.log('angular ready');
        angular.bootstrap(document, ['spock']);
      });

    });
});
