angular.module('starter.CacheService', [])

.factory('CacheService', function($http, $q, $cacheFactory) {
  var cacheEngine = $cacheFactory('starter');
  return {
    cacheEngine: cacheEngine
  }
});

angular
  .module('AngularJeopardy')
  .service('CacheService', function($http, $q, $cacheFactory){
      return $cacheFactory('AngularJeopardy');
  });
