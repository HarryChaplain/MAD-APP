angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $state) {

  $scope.goPost = function(){
    $state.go('app.post');
  };

})

.controller('ThemesCtrl', function($scope, $ionicModal, $timeout, $state) {
  var stylesheet = document.getElementById('stylesheet');

  $scope.setTheme = function(colour){
    switch(colour) {
      case "red":
        stylesheet.href = "css/redStyle.css";
        break;
      case "yellow":
      stylesheet.href = "css/yellowStyle.css";
        break;
      case "green":
      stylesheet.href = "css/greenStyle.css";
        break;
      case "default":
      stylesheet.href = "css/defaultStyle.css";
        break;
    }
  }

})


.controller('PostCtrl', function($scope, $cordovaEmailComposer, $ionicPopup, $http, $twitterApi, $cordovaCamera, Copy) {

  //array of places to post review to
  $scope.postList = [];

  $scope.pasteData = {};

  $scope.email = {
    enabled: false
  };

  //dropbox token information
  var dropboxKey = 'STORAGE.DROPBOX.KEY';
  $scope.dropboxToken = JSON.parse(window.localStorage.getItem(dropboxKey));

  //facebook token information
  var facebookKey = 'STORAGE.FACEBOOK.KEY';
  $scope.facebookToken = JSON.parse(window.localStorage.getItem(facebookKey));

  //twitter token information
  var twitterKey = 'STORAGE.TWITTER.KEY';
  $scope.twitterToken = JSON.parse(window.localStorage.getItem(twitterKey));
  var clientId = '1HTt2CDZ9T8E9Swqk0zeNewJ3';
  var clientSecret = 'nWXiDdFMRi6SpamRHvvc0WFSqX0vLbhp9PCUxMB0YWf6vN6QSm';

  //for pop up when posting
  $scope.showPopUp = function(){
    // An elaborate, custom popup
   var myPopup = $ionicPopup.show({
     templateUrl: 'templates/popupPost.html',
     title: 'Post To...',
     scope: $scope,
     buttons: [
      {
        text: 'Cancel',
        type: 'button-assertive'
      },
      {
        text: '<b>Post</b>',
        type: 'button-positive',
        onTap: function(e) {
          if($scope.postData.title != "" && $scope.postData.body != "") {
            $scope.post();
          }
        }
      }
    ]
   });
 };
  //data object of post data
  $scope.postData = {
    to: "",
    subject: "",
    body: "",
    attachments: [],
    isHtml: true
  };

  $scope.noOfAttachments = 0;
  $scope.attachImg = function() {

    var options = {
      //destinationType : Camera.DestinationType.FILE_URI, //harry's original option destinationType
      destinationType : Camera.DestinationType.DATA_URL, //sunny's changed destinationType, test with email!
      sourceType : Camera.PictureSourceType.PHOTOLIBRARY,
      allowEdit : false,
      encodingType: Camera.EncodingType.JPG,
      popoverOptions: CameraPopoverOptions
    };

    $cordovaCamera.getPicture(options).then(function(imageData) {
      $scope.postData.attachments.push("base64:img.jpg//" + imageData) ;
      $scope.noOfAttachments++;
    }, function(error) {
      console.error(error);
    });
  }

  $scope.paste = function(){
    var pasteData = Copy.getCopy();

    if(pasteData.eventname){
      $scope.postData.title = "My Review Of: " + pasteData.eventname;
      $scope.postData.body =  pasteData.description + "\n\n" + "Venue: " + pasteData.venue.name;
    }else{
      $scope.postData.title = "My Review Of: " + pasteData.Title;
      $scope.postData.body =  pasteData.Plot + "\n\n" + "Released: " + pasteData.Released;
    }

  }

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


    for(i=0;i<$scope.postList.length;i++) {
//      console.log($scope.postList[i]);
      switch($scope.postList[i]) {
        case 'facebook':
          $scope.postToFacebook();
          break;
        case 'twitter':
          $scope.postFile();
          break;
      }
    }



    if ($scope.email.enabled === true){
      cordova.plugins.email.open($scope.postData, function () {
        console.log('email view dismissed');
        $scope.postData.title = "";
        $scope.postData.body = "";
        $scope.postData.attachmets = [];
        $scope.noOfAttachments = 0;
      }, this);
    }
    //cordova.plugins.email.open($scope.postData);
  };




  $scope.postToFacebook = function(){
    var message = $scope.postData.body;
    $http({
      url:'https://graph.facebook.com/v2.8/me/feed?method=post&message='+encodeURIComponent(message),
      method: "POST",
      data:{
        access_token: $scope.facebookToken.config.params.access_token
      }
    }).then(function(response) {
      console.log(response);
      $scope.postData.title = "";
      $scope.postData.body = "";
    },
    function(response) { // optional
      alert(response);
    });
  };

  $scope.postFile = function() {
    //create our HTML to generate PDF report
    // $scope.html = "<!DOCTYPE html>" +
    // "<head>" +
    // "</head>" +
    // "<body>" +
    // "<header style='padding-top: 18px; text-align: center; height: 100px; background-color: #387ef5; color: white; font-family: sans-serif;'>" +
    // "<h1>" + $scope.postData.title + "</h1>" +
    // "</header>" +
    // "<section style='text-align: center; margin-top: 15px; font-family: sans-serif; font-size: 18px;'>" +
    // "<p>" + $scope.postData.body + "</p>" +
    // "</section>" +
    // "<section style='text-align: center;'>" +
    // "<img style='width: 50%' src='data:image/jpeg;base64," + $scope.postData.attachments[0] + "'>" +
    // "</section>" +
    // "</body>" +
    // "</html>";

    //create our HTML to generate PDF report
    $scope.html = "<!DOCTYPE html>" +
    "<head>" +
    "</head>" +
    "<body>" +
    "<header style='padding-top: 18px; text-align: center; height: 100px; background-color: #387ef5; color: white; font-family: sans-serif;'>" +
    "<h1>" + $scope.postData.title + "</h1>" +
    "</header>" +
    "<section style='text-align: center; margin-top: 15px; font-family: sans-serif; font-size: 18px;'>" +
    "<p>" + $scope.postData.body + "</p>" +
    "</section>";

    //if any image attachments, add this in
    if($scope.postData.attachments.length > 0) {

      //go through attachments and create html to append to pdf document created above
      for($scope.increment = 0; $scope.increment < $scope.postData.attachments.length; $scope.increment++) {

        //remove appended text that is required for email, which then equals base64 string
        $scope.stringAttachment = $scope.postData.attachments[$scope.increment].replace("base64:img.jpg//", "");
  
        $scope.image = "<section style='text-align: center; margin-top: 20px;'>" +
        //"<img style='width: 50%' src='data:image/jpeg;base64," + $scope.postData.attachments[$scope.increment] + "'>" +
        "<img style='width: 50%' src='data:image/jpeg;base64," + $scope.stringAttachment + "'>" +
        "</section>";
        
        //append this to html
        $scope.html = $scope.html + $scope.image;
      }
    }

    //use cordova PDF to generate the PDF document
    pdf.htmlToPDF({
      data: $scope.html,
      documentSize: "A4",
      landscape: "portrait",
      type: "base64"
    }, function(result){
      console.log("success");
      $scope.postToDropbox(result); //document created successfully, in base64 format
    }, function(failure) {
      console.log("failure");
    });
  };

  //required to convert base64 string into buffer array
  function base64ToArrayBuffer(base64) {
    var binary_string =  window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++)        {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
  }

  $scope.postToDropbox = function(base64PDF) {
    //convert base64 file into array buffer, else we get a blank docuent
    var bufferArray = base64ToArrayBuffer(base64PDF);

    //bufferArray file into new blob, ready to send to dropbox
    var file = new Blob([bufferArray], {type: "application/pdf"});

    $http({
      url: 'https://content.dropboxapi.com/2/files/upload',
      method: "POST",
      headers: {
          'Authorization': 'Bearer ' + $scope.dropboxToken.access_token,
          'Content-Type': 'application/octet-stream',
          'Dropbox-API-Arg': '{"path": "/' + $scope.postData.title + '.pdf","mode": "add","autorename": true,"mute": true}'
      },
      data: file
    }).then(function(response) {
      console.log("worked");
      console.log(response.data);
      $scope.getShareURL(response.data.path_display);
    },
    function(response) { // optional
      console.log("failed");
      console.log(response);
    });
  };

  $scope.getShareURL = function(path) {
    console.log(path);
    $http({
      url: 'https://api.dropboxapi.com/2/sharing/create_shared_link_with_settings',
      method: "POST",
      headers: {
          'Authorization': 'Bearer ' + $scope.dropboxToken.access_token,
          'Content-Type': 'application/json'
      },
      data: {
          // "path": path_display,
          "path": String(path),
          "settings": {
              "requested_visibility": "public"
          }
      }
    }).then(function(response) {
      console.log("worked");
      console.log(response);
      //$scope.postToTwitter(response.data.url);
    },
    function(response) { // optional
      console.log("failed");
      console.log(response);
    });
  };

  $scope.postToTwitter = function(shareUrl) {
    $twitterApi.configure(clientId, clientSecret, $scope.twitterToken);
    var tweet = "Hey, I posted a new review! Link to view is attached. " + shareUrl;
    $twitterApi.postStatusUpdate(tweet).then(function(result) {
      console.log("tweeted");
    });
  };

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

  //wordpress token information
  var wordpressKey = "STORAGE.WORDPRESS.KEY";
  $scope.wordpressToken = JSON.parse(window.localStorage.getItem(wordpressKey));


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

    //*******************************************
    // Wordpress User Setup
    //*******************************************
    $scope.loginToWordpress = function() {
      //launch in app browser to wordpress API
      $scope.browser = window.cordova.InAppBrowser.open("https://public-api.wordpress.com/oauth2/authorize?client_id=51873&redirect_uri=http://localhost/callback&response_type=token", "_blank", "location=no,clearsessioncache=yes,clearcache=yes");

      //add listener to the in app browser
      $scope.browser.addEventListener("loadstart", function(event) {
        //if url returned has callback url in
        if((event.url).indexOf("http://localhost/callback") === 0) {

          //remove event listener and close browser as successfully logged in
          $scope.browser.removeEventListener("exit",function(event){});
          $scope.browser.close();

          //get then token from the url <--- token expires in 2 weeks
          $scope.accessToken = (event.url).split("access_token=")[1];
          $scope.accessToken = ($scope.accessToken).split("&expires_in")[0];
          console.log($scope.accessToken);

          //get token expiry (seconds) to see how long left
          $scope.expires = (event.url).split("&expires_in=")[1];
          $scope.expires = ($scope.expires).split("&token_type")[0];
          console.log($scope.expires);

          //create object to save in local storage
          $scope.data = {
            "accessToken": $scope.accessToken,
            "expires": $scope.expires
          };

          //save in local storage
          $scope.wordpressToken = $scope.data;
          window.localStorage.setItem(wordpressKey, JSON.stringify($scope.data));

          //update html to show we have logged in
          $scope.$apply();
        }
      });

      //called when exited from sign in browser
      $scope.browser.addEventListener("exit", function(event) {
        console.log("The sign in flow was canceled");
      });
    };

    $scope.logoutOfWordpress = function() {
      localStorage.removeItem(wordpressKey);
      $scope.wordpressToken = null;
    };
})

.controller('SettingsCtrl', function($scope) {
})

.controller('omdbCtrl', function($scope, $http, Copy, $state){
    $scope.movieData = {
      title: ""
    };
    $scope.formAction = function() {
      $scope.movie = null;
      $http.get('https://www.omdbapi.com/?s=' + $scope.movieData.title + '&y=&r=json').
        then(function(response){
          $scope.movies = response.data.Search;
      });
    };
    $scope.movieSelect = function(imdbID){
      $scope.movieData.title = null;
      $http.get('https://www.omdbapi.com/?i=' + imdbID + '&y=&plot=short&r=json').
        then(function(data){
          $scope.movie = data.data;
        });
    };

    $scope.copy = function(){
      Copy.setCopy($scope.movie);
      $state.go('app.post')
    }

})

.controller('skiddleCtrl', function($scope, $http, Copy, $state){
    $scope.showData = {
      title: ""
    };
    $scope.formAction = function() {
      $scope.show = null;
      $http.get('https://www.skiddle.com/api/v1/events/search/?api_key=aace5873a4a07d0b969b3b58cc3355bf&eventcode=THEATRE&keyword=' + $scope.showData.title).
        then(function(response){
          $scope.shows = response.data.results;
      });
    };
    $scope.showSelect = function(showID){
      $scope.showData.title = '';
      $scope.shows = null;
      $http.get('http://www.skiddle.com/api/v1/events/' + showID + '/?api_key=aace5873a4a07d0b969b3b58cc3355bf').
        then(function(response){
          $scope.show = response.data.results;
        });
    };

    $scope.copy = function(){
      Copy.setCopy($scope.show);
      $state.go('app.post')
    }

})
