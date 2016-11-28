angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $state) {

  $scope.goPost = function(){
    $state.go('app.post');
  };

})

.controller('PostCtrl', function($scope) {
})

.controller('SetupCtrl', function($scope, $cordovaOauth, $twitterApi, $http) {
  
  //twitter & dropbox key information
  var appKey = '4umc6p0v84tdsxu'; //dropbox key
  var clientId = '1HTt2CDZ9T8E9Swqk0zeNewJ3'; //twitter client id
  var clientSecret = 'nWXiDdFMRi6SpamRHvvc0WFSqX0vLbhp9PCUxMB0YWf6vN6QSm'; //twitter client secret
  
  //dropbox token information
  var dropboxKey = 'STORAGE.DROPBOX.KEY';
  $scope.dropboxToken = JSON.parse(window.localStorage.getItem(dropboxKey));
  console.log($scope.dropboxToken);
  
  //twitter token information
  var twitterKey = 'STORAGE.TWITTER.KEY';
  $scope.twitterToken = JSON.parse(window.localStorage.getItem(twitterKey));
//  console.log($scope.twitterToken);

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
  
    //*******************************************
    // Twitter User Setup
    //*******************************************
    $scope.loginToTwitter = function() {
      if ($scope.twitterToken === '' || $scope.twitterToken === null) {
        $cordovaOauth.twitter(clientId, clientSecret).then(function(result) {
          $scope.twitterToken = result;
          window.localStorage.setItem(twitterKey, JSON.stringify(result));
        }, function(error) {
          console.log(error);
        });
      } 
      else {
        console.log("twitter already logged in!");
        console.log($scope.twitterToken);
      }
    };
  
    $scope.logoutOfTwitter = function() {
      localStorage.removeItem(twitterKey);
      $scope.twitterToken = null;
    };
  
    //*******************************************
    // Dropbox User Setup
    //******************************************* 
    $scope.loginToDropbox = function() {
      if ($scope.dropboxToken === '' || $scope.dropboxToken === null) {
        $cordovaOauth.dropbox(appKey).then(function(result) {
          $scope.dropboxToken = result;
          window.localStorage.setItem(dropboxKey, JSON.stringify(result));
        }, function(error) {
          console.log(error);
        });
      } 
      else {
        console.log("dropbox already logged in!");
        console.log($scope.dropboxToken);
      }
    };
  
    $scope.logoutOfDropbox = function() {
      localStorage.removeItem(dropboxKey);
      $scope.dropboxToken = null;
    };
})

.controller('SettingsCtrl', function($scope) {
});
