'use strict';

angular.module('returnMeHomeApp', ['ngCookies', 'ngResource', 'ngSanitize', 'ngRoute', 'mm.foundation', 'geolocation']).config(function ($routeProvider, $locationProvider) {
  $routeProvider
    .otherwise({
      redirectTo: '/'
    });
  $locationProvider.html5Mode(true);
});