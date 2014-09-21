'use strict';

angular.module('returnMeHomeApp').service('Itemservice', ['$http', function ($http) {
  return {
    addLost: function(lostData) {
      return $http({
        url: '/api/item/add',
        method: 'POST',
        data: lostData,
        header: {'Content-Type': 'application/x-www-form-urlencoded'}
      });
    },
    addFound: function(foundData) {
      return $http({
        url: '/api/item/found',
        method: 'POST',
        data: foundData,
        header: {'Content-Type': 'application/x-www-form-urlencoded'}
      });
    },
    lookup: function(lookupData) {
      return $http.get('/api/item/lookup?query=' + lookupData.query + '&category=' + lookupData.category);
    }
  };
}]);
