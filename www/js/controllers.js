angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $state) {

  $scope.goPost = function(){
    $state.go('app.post');
  };

})

.controller('PostCtrl', function($scope) {
})

.controller('SetupCtrl', function($scope) {
})

.controller('SettingsCtrl', function($scope) {
});
