'use strict';

angular.module('returnMeHomeApp').service('Userservice', ['$http', function Userservice($http) {
  return {
    login: function (loginData) {
      return $http({
        url: '/api/user/login',
        data: loginData,
        method: 'POST',
        header: {'Content-Type': 'application/x-www-form-urlencoded'}
      });
    },
    register: function (registerData) {
      return $http({
        url: '/api/user/register',
        data: registerData,
        method: 'POST',
        header: {'Content-Type': 'application/x-www-form-urlencoded'}
      });
    }
  };
}]);
