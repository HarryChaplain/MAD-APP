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
  	'ngTwitter'
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
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.post', {
    url: '/post',
    cache: true,
    views: {
      'menuContent': {
        templateUrl: 'templates/post.html',
        controller: 'PostCtrl'
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
	      cache: false,
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
    });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/post');
});
