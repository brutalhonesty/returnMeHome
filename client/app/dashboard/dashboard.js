'use strict';

angular.module('returnMeHomeApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/user/dashboard', {
        templateUrl: 'app/dashboard/dashboard.html',
        controller: 'DashboardCtrl'
      });
  });
