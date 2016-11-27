angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $state) {

  $scope.goPost = function(){
    $state.go('app.post');
  };

})

.controller('PostCtrl', function($scope) {
})

.controller('SetupCtrl', function($scope) {

    $scope.loginToFacebook = function() {
      var fbLoginSuccess = function (userData) {
        alert("Successful login");
        var userID = userData.authResponse.userID;
        facebookConnectPlugin.api(userID+"/?fields=id,email", ["user_birthday"],
          function (result) {
              alert(result.email);
          },
          function (error) {
              alert("Failed: " + error);
          });
      };

      facebookConnectPlugin.login(["email", "public_profile"], fbLoginSuccess,
        function loginError (error) {
          $scope.status = "ERROR connecting";
          alert("ERROR Connecting")
        }
      );

    };
})

.controller('SettingsCtrl', function($scope) {
});
