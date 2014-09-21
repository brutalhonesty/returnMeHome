'use strict';

angular.module('returnMeHomeApp').filter('date', function () {
    return function (input) {
      if (input == null) {
        return "";
      }
      var _date = $filter('date')(new Date(input), 'MM dd yyyy');
      return _date.toUpperCase();
    };
  });
