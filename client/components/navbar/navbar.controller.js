'use strict';

angular.module('returnMeHomeApp').controller('NavbarCtrl', ['$scope', '$modal', function ($scope, $modal) {
  $scope.openModal = function () {
    $modal.open({
      templateUrl: 'components/modals/signtwo.html',
      controller: 'ModalCtrl'
    });
  };
}]);

angular.module('returnMeHomeApp').controller('ModalCtrl', ['$scope', '$modalInstance', 'Userservice', 'geolocation', '$location', '$window', function ($scope, $modalInstance, Userservice, geolocation, $location, $window) {
  $scope.registerData = {};
  geolocation.getLocation().then(function (data) {
    $scope.registerData.latitude = data.coords.latitude;
    $scope.registerData.longitude = data.coords.longitude;
  });
  $scope.register = function () {
    Userservice.register($scope.registerData).success(function (data) {
      $modalInstance.dismiss('cancel');
      $window.localStorage.setItem('username', $scope.registerData);
      $location.path('/user/dashboard');
    }).error(function (error) {
      $scope.error = error.message;
    });
  };
  $scope.login = function () {
    var loginData = {
      username: $scope.username,
      password: $scope.password
    };
    Userservice.login(loginData).success(function (data) {
      $modalInstance.dismiss('cancel');
      $window.localStorage.setItem('username', $scope.registerData);
      $location.path('/user/dashboard');
    }).error(function (error) {
      $scope.error = error.message;
    });
  };
}]);