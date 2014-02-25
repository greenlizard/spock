angular.module('spock.common.confProvider', [])

.provider('conf', [function () {
  this.conf = {
    appName: 'spock',
    domain: 'api.myserver.com',
    protocol: 'http'
  };

  this.$get = function () {
    var conf = this.conf;
    return {
      get: function (key) {
        return conf[key];
      },
      getApiUrl: function () {
        return conf.protocol + '://' +
          (conf.user ? conf.user : '') +
          (conf.pass ? ':' + conf.pass : '') +
          (conf.user || conf.pass ? '@' : '') +
          conf.domain +
          (conf.port ? ':' + conf.port : '') +
          (conf.path ? '/' + conf.path : '');
      },
      getAll: function () {
        return conf;
      }
    };
  };

  this.set = function (key, value) {
    return this.conf[key] = value;
  };
}])
