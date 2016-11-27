angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $state) {

  $scope.goPost = function(){
    $state.go('app.post');
  };

})

.controller('PostCtrl', function($scope) {
})

.controller('SetupCtrl', function($scope) {

  $scope.loggedIn = false;
    $scope.loginToFacebook = function() {
      var fbLoginSuccess = function (userData) {
        $scope.loggedIn = true;
        var userID = userData.authResponse.userID;
        facebookConnectPlugin.api(userID+"/?fields=id,email,name", ["user_birthday"],
          function (result) {
              $scope.username = result.name;
          },
          function (error) {
              alert("Failed: " + error);
                $scope.loggedIn = false;
          });
      };
      $scope.logoutOfFacebook = function(){
        facebookConnectPlugin.logout();
        $scope.loggedIn = false;
        $scope.username = "";
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
