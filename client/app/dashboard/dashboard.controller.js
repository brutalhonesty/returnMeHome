'use strict';

angular.module('returnMeHomeApp').controller('DashboardCtrl', ['$scope', 'Itemservice', function ($scope, Itemservice) {
  $scope.categories = ["All", "Apparel", "Appliances", "ArtsAndCrafts", "Automotive", "Baby", "Beauty", "Blended", "Books", "Classical", "Collectibles", "DigitalMusic", "Grocery", "DVD", "Electronics", "HealthPersonalCare", "HomeGarden", "Industrial", "Jewelry", "KindleStore", "Kitchen", "LawnGarden", "Magazines", "Marketplace", "Merchants", "Miscellaneous", "MobileApps", "MP3Downloads", "Music", "MusicalInstruments", "MusicTracks", "OfficeProducts", "OutdoorLiving", "PCHardware", "PetSupplies", "Photo", "Shoes", "Software", "SportingGoods", "Tools", "Toys", "UnboxVideo", "VHS", "Video", "VideoGames", "Watches", "Wireless", "WirelessAccessories"];
  $scope.lookupFoundProduct  = function() {
    var foundData = {
      query: $scope.foundItemName,
      category: $scope.foundCategory
    };
    Itemservice.lookup(foundData).success(function (lookupResp) {
      $scope.foundList = lookupResp;
    }).error(function (error) {
      $scope.error = error.message;
    });
  };
  $scope.lookupLostProduct = function() {
    var lookupData = {
      query: $scope.lostItemName,
      category: $scope.lostCategory
    };
    Itemservice.lookup(lookupData).success(function (lookupResp) {
      $scope.lostList = lookupResp;
    }).error(function (error) {
      $scope.error = error.message;
    });
  };
  $scope.submitLost = function () {
    var lostData = {
      address: $scope.lostLocation,
      name: $scope.lostItemName,
      descriptions: [$scope.lostDetails],
      date: new Date($scope.lostDate + " " + $scope.lostTime).valueOf()
    };
    Itemservice.addLost(lostData).success(function (lostResp) {
      $scope.lostMessage = lostResp.message;
    }).error(function (error) {
      $scope.lostError = error.message;
    });
  };
  $scope.submitFound = function () {
    var foundData = {
      address: $scope.foundLocation,
      name: $scope.foundItemName,
      descriptions: [$scope.foundDetails],
      date: new Date($scope.foundDate + " " + $scope.foundTime).valueOf()
    };
    Itemservice.addFound(foundData).success(function (foundResp) {
      $scope.foundMessage = foundResp.message;
    }).error(function (error) {
      $scope.foundError = error.message;
    });
  };
}]);
