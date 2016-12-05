angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $state) {

  $scope.goPost = function(){
    $state.go('app.post');
  };

})

.controller('PostCtrl', function($scope, $cordovaEmailComposer, $ionicPopup, $http) {

  var facebookKey = 'STORAGE.FACEBOOK.KEY';
  $scope.facebookToken = JSON.parse(window.localStorage.getItem(facebookKey));

  console.log($scope.facebookToken);

  //for pop up when posting
  $scope.showPopUp = function(){
    // An elaborate, custom popup
   var myPopup = $ionicPopup.show({
     templateUrl: 'templates/popupPost.html',
     title: 'Post To...',
     buttons: [
      { text: 'Cancel',
        type: 'button-assertive'
      },
      {
        text: '<b>Post</b>',
        type: 'button-positive',
        onTap: function(e) {
          alert("Posting");
        }
      }
    ]
   });

   myPopup.then(function(res){
     console.log("closing pop up ");
   });

 };
  //data object of post data
  $scope.postData = {
    to: "",
    subject: "",
    body: "",
    isHtml: true
  };

  //speaks text in message field
  $scope.speakText = function() {
    TTS.speak({
          text: $scope.postData.body,
          locale: 'en-GB',
          rate: 1.5
      }, function () {
          // Do Something after success
      }, function (reason) {
          // Handle the error case
      });
  };

  //records voice into message field
  $scope.record = function() {
    var recognition = new SpeechRecognition();
    recognition.onresult = function(event) {
         if (event.results.length > 0) {
             $scope.postData.body = event.results[0][0].transcript;
             $scope.$apply()
         }
     };
     recognition.start();
  };

  //posts to social media and email
  $scope.post = function() {

    cordova.plugins.email.open($scope.postData);
  }



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

  //facebook token information
  var facebookKey = 'STORAGE.FACEBOOK.KEY';
  $scope.facebookToken = JSON.parse(window.localStorage.getItem(facebookKey));
  console.log($scope.facebookKey);

  //twitter token information
  var twitterKey = 'STORAGE.TWITTER.KEY';
  $scope.twitterToken = JSON.parse(window.localStorage.getItem(twitterKey));
//  console.log($scope.twitterToken);


//*******************************************
// Facebook User Setup
//*******************************************

  //facebook app ID to access the facebook API
  var facebookAppID = '1318210328221123';

  $scope.loginToFacebook = function() {
    if ($scope.facebookToken === '' || $scope.facebookToken === null) {
      $cordovaOauth.facebook(facebookAppID, ["email", "public_profile"]).then(function(result) {
        //the result of this only returns the access_token
        //Therefore a GET request has to be called to get the users data (name)
        setUpFacebookUser(result.access_token);
      }, function(error) {
        console.log(error);
      });
    }
    else {
      console.log("facebook already logged in!");
      console.log($scope.facebookToken);
    }
  };

  function setUpFacebookUser(access_token){
  //This gets the users data using the access_token from logging in
  $http.get("https://graph.facebook.com/v2.8/me", { params: { access_token: access_token, fields: "id,name,gender,location,website,picture,relationship_status", format: "json" }}).then(function(result) {
      $scope.facebookToken = result;
      window.localStorage.setItem(facebookKey, JSON.stringify(result));
    }, function(error) {
      alert("There was a problem getting your profile.  Check the logs for details.");
      console.log(error);
  });
};

  $scope.logoutOfFacebook = function() {
    localStorage.removeItem(facebookKey);
    $scope.facebookToken = null;
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
