"use strict"
var app = angular.module('app', [ 'ui.bootstrap']);

app.controller('CountryController', function($scope, $http, $uibModal) {
    $scope.search = '';
    $scope.create = function() {
        $uibModal.open({
            templateUrl: '/template/country/create.html',
            controller: 'CountryModalController',
            size: 'md',
            scope: $scope,
            resolve: {
                country: null
            }
        });
    };
    
    $scope.read = function(country) {
        $uibModal.open({
            templateUrl: '/template/country/read.html',
            controller: 'CountryModalController',
            size: 'md',
            scope: $scope,
            resolve: {
                country: country
            }
        });
    }
    
    $scope.update = function(country) {
        $uibModal.open({
            templateUrl: '/template/country/update.html',
            controller: 'CountryModalController',
            size: 'md',
            scope: $scope,
            resolve: {
                country: country
            }
        });
    }
    
    $scope.delete = function(country) {
        $uibModal.open({
            templateUrl: '/template/country/delete.html',
            controller: 'CountryModalController',
            size: 'md',
            scope: $scope,
            resolve: {
                country: country
            }
        });
    }
    
    $scope.refresh = function() {
        $http.get('/api/country/search/name/' + $scope.search).success(function(response) {
            $scope.countries = response.data;
        });
    }
});

app.controller('CountryModalController', function($scope, $http, $uibModalInstance, country) {
    $scope.country = country;

    $scope.create = function () {
        $http.put('/api/country/create', $scope.country).then(function() {
            $scope.refresh();
            $uibModalInstance.close();
        });
    };

    $scope.update = function () {
        $http.patch('/api/country/update/' + $scope.country.id, $scope.country).then(function() {
            $scope.refresh();
            $uibModalInstance.close();
        });
    };
    
    $scope.delete = function () {
        $http.delete('/api/country/delete/' + $scope.country.id).then(function() {
            $scope.refresh();
            $uibModalInstance.close();
        });
    };
    $scope.dismiss = function () {
        $scope.refresh();
        $uibModalInstance.dismiss();
    };
});