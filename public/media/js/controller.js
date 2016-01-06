
var app = angular.module('app', ['ui.bootstrap']);

app.controller('CountryController', function($scope, $uibModal) {
    $scope.create = function() {
        console.log('create');
    var modalInstance = $uibModal.open({
      animation: $scope.animationsEnabled,
      templateUrl: '/template/country/create.html',
     // controller: 'ModalInstanceCtrl',
      size: 'sm',
      resolve: {
        items: function () {
          return $scope.items;
        }
      }
    });

    modalInstance.result.then(function (selectedItem) {
      $scope.selected = selectedItem;
    }, function () {
    });
    };
    
    $scope.read = function() {
        console.log('read');
        
    }
    
    $scope.update = function() {
        console.log('update');
        
    }
    
    $scope.delete = function() {
        console.log('delete');
        
    }
});