"use strict"
var app = angular.module('app', [ 'ui.bootstrap']);

app.controller('CountryController', function($scope, $http, $uibModal) {
    function modal(country, action) {
        $scope.country = country;
    
        return $uibModal.open({
            templateUrl: '/template/country/' + action + '.html',
            controller: 'CountryModalController',
            size: 'md',
            scope: $scope
        });
    };
    
    $scope.search = '';
    $scope.create = function() { return modal(null, 'create'); }
    $scope.read = function(country) { return modal(country, 'read'); }
    $scope.update = function(country) { return modal(country, 'update'); }
    $scope.delete = function(country) { return modal(country, 'delete'); }
    $scope.refresh = function() {
        $scope.country = null;
        $scope.countries = null;
        $http.get('/api/country/search/name/' + $scope.search).success(function(response) {
            $scope.countries = response.data;
        });
    }
});

app.controller('CountryModalController', function($scope, $http, $uibModalInstance) {
    function after() {
        $scope.refresh();
        $uibModalInstance.close();
    }

    $scope.create = function () {
        $http.put('/api/country/create', $scope.country).then(after);
    };

    $scope.update = function () {
        $http.patch('/api/country/update/' + $scope.country.id, $scope.country).then(after);
    };
    
    $scope.delete = function () {
        $http.delete('/api/country/delete/' + $scope.country.id).then(after);
    };
    
    $scope.dismiss = function () {
        $scope.refresh();
        $uibModalInstance.dismiss();
    };
});