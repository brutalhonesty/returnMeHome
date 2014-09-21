'use strict';

angular.module('returnMeHomeApp', ['ngCookies', 'ngResource', 'ngSanitize', 'ngRoute', 'mm.foundation', 'geolocation', 'ngAutocomplete']).config(function ($routeProvider, $locationProvider) {
  $routeProvider
    .otherwise({
      redirectTo: '/'
    });
  $locationProvider.html5Mode(true);
});