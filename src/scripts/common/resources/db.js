angular.module('spock.common.resources.db', [
  'pouchdb',
  'spock.constants'
])

.factory('db', [
  'pouchdb',
  'conf',
  function (pouchdb, conf) {
    var db = pouchdb.create('ng-db');
    var couchdb = conf.getApiUrl();
    db.sync = function(continuous) {

      var pouchOptions = {
        continuous: !!continuous,
        onChange: function(obj) {
          if(obj.ok){
            console.log('sync ok ', obj);
          } else{
            console.log('Sync error: ', obj)
          };
        },
        complete:  function(err) {
          console.log('complete', arguments);
        }
      };
      pouchdb.replicate('ng-db', couchdb, pouchOptions);
      pouchdb.replicate(couchdb, 'ng-db', pouchOptions);
    }

    db.sync.call(this, true);
    // db.info()
    //   .then(function () {
    //     console.log(arguments)
    //   })

    // pouchdb.allDbs()
    //   .then(function() { 
    //   console.log(arguments) 
    // });

    return db;

  }
])

.config(['pouchdbProvider', 
  function (pouchdbProvider) {
    pouchdbProvider.withAllDbsEnabled();
  }
])
;
