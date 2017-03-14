// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', [
	'ionic',
	'starter.controllers',
	'starter.services',
	'ngCordova',
  	'ngCordovaOauth',
  	'ngTwitter',
    'firebase'
])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
	// Initialize Firebase
	var config = {
      apiKey: "AIzaSyBV5PvXFlyFT-E34swOOX2BYqfaTwjicxI",
      authDomain: "mad-account-89bc1.firebaseapp.com",
      databaseURL: "https://mad-account-89bc1.firebaseio.com",
      storageBucket: "mad-account-89bc1.appspot.com",
      messagingSenderId: "492442337793"
    };
	firebase.initializeApp(config);
})

.config(function($stateProvider, $urlRouterProvider) {
$stateProvider
    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.post', {
    url: '/post',
    //cache: true,
    cache: false,
    views: {
      'menuContent': {
        templateUrl: 'templates/post.html',
        controller: 'PostCtrl'
      }
    }
  })

  .state('app.drafts', {
    url: '/drafts',
    cache: false,
    views: {
      'menuContent': {
        templateUrl: 'templates/drafts.html',
        controller: 'DraftsCtrl'
      }
    }
  })

  .state('app.setup', {
      url: '/setup',
      cache: false,
      views: {
        'menuContent': {
          templateUrl: 'templates/setup.html',
          controller: 'SetupCtrl'
        }
      }
    })

    .state('app.themes', {
      url: '/themes',
      cache: true,
      views: {
        'menuContent': {
          templateUrl: 'templates/themes.html',
          controller: 'ThemesCtrl'
        }
      }
    })
    .state('app.omdb', {
      url: '/omdb',
      cache: false,
      views: {
        'menuContent': {
          templateUrl: 'templates/omdb.html',
          controller: 'omdbCtrl'
        }
      }
    })
    .state('app.skiddle', {
      url: '/skiddle',
      cache: false,
      views: {
        'menuContent': {
          templateUrl: 'templates/skiddle.html',
          controller: 'skiddleCtrl'
        }
      }
    })

  .state('app.settings', {
      url: '/settings',
      views: {
        'menuContent': {
          templateUrl: 'templates/settings.html',
          controller: 'SettingsCtrl'
        }
      }
    })
  .state('app.sendFriendSignUp', {
      url: '/sendFriendSignUp',
      cache: false,
      views: {
        'menuContent': {
          templateUrl: 'templates/sendFriendSignUp.html',
          controller: 'sendFriendSignUpCtrl'
        }
      }
    });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/post');
});
