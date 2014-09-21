'use strict';

angular.module('returnMeHomeApp').controller('NavbarCtrl', ['$scope', '$modal', function ($scope, $modal) {
  $scope.openModal = function () {
    $modal.open({
      templateUrl: 'components/modals/signtwo.html',
      controller: 'ModalCtrl'
    });
  };
}]);

angular.module('returnMeHomeApp').controller('ModalCtrl', ['$scope', '$modalInstance', 'Userservice', 'geolocation', function ($scope, $modalInstance, Userservice, geolocation) {
  geolocation.getLocation().then(function (data) {
    $scope.latitude = data.coords.latitude;
    $scope.longitude = data.coords.longitude;
  });
  $scope.register = function () {
    var registerData = {
      username: $scope.username,
      password: $scope.password,
      email: $scope.email,
      firstName: $scope.firstName,
      lastName: $scope.lastName,
      phone: $scope.phone,
      latitude: $scope.latitude,
      longitude: $scope.longitude
    };
    Userservice.register(registerData).success(function (data) {
      $modalInstance.dismiss();
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
      $modalInstance.dismiss();
    }).error(function (error) {
      $scope.error = error.message;
    });
  };
}]);